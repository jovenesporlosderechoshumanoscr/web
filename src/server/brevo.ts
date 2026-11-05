import { ContactsClient } from '@getbrevo/brevo/contacts'
import { EmailCampaignsClient } from '@getbrevo/brevo/emailCampaigns'
import { env } from 'cloudflare:workers'

/**
 * Integración con la API de Brevo usando el SDK oficial `@getbrevo/brevo`.
 *
 * - Solo funciones: cada llamada crea su cliente bajo demanda, sin clases
 *   ni estado compartido.
 * - Subpaths (`/contacts`, `/emailCampaigns`) para no bundlear el resto del SDK.
 * - Los errores de la API se traducen a `Error` con `status` (código HTTP) y
 *   mensaje en español; los problemas de configuración llevan `code`.
 *
 * La API key va como secreto en producción (`wrangler secret put BREVO_API_KEY`)
 * y el resto de variables (lista, remitente, plantilla DOI...) en `.env`.
 */

interface BrevoConfig {
  apiKey: string
  listId: number
  senderEmail: string
  senderName: string
  replyTo: string
  doiTemplateId: number
  doiRedirectUrl: string
}

/** `Error` enriquecido: `status` = código HTTP de Brevo, `code` = variable de entorno faltante. */
export type BrevoApiError = Error & { status?: number; code?: string }

function configError(code: string, message: string): Error {
  const error = new Error(message) as BrevoApiError
  error.code = code
  return error
}

/** Lee la configuración del boletín desde el entorno. Lanza si falta la API key. */
function getBrevoConfig(): BrevoConfig {
  const apiKey = env.BREVO_API_KEY || process.env.BREVO_API_KEY
  if (!apiKey) {
    throw configError('BREVO_API_KEY', 'BREVO_API_KEY no está configurada.')
  }

  return {
    apiKey,
    listId: Number(process.env.BREVO_LIST_ID ?? 0),
    senderEmail: process.env.BREVO_SENDER_EMAIL ?? 'boletin@jpdh.com',
    senderName: process.env.BREVO_SENDER_NAME ?? 'JPDH',
    replyTo: process.env.BREVO_REPLY_TO ?? 'contacto@jpdh.com',
    doiTemplateId: Number(process.env.BREVO_DOI_TEMPLATE_ID ?? 0),
    doiRedirectUrl:
      process.env.BREVO_DOI_REDIRECT_URL ?? 'https://jpdh.com/?newsletter=ok',
  }
}

/** Devuelve el id de la lista del boletín o lanza si no está configurada. */
function requireListId(config: BrevoConfig): number {
  if (config.listId === 0) {
    throw configError('BREVO_LIST_ID', 'BREVO_LIST_ID no está configurada.')
  }
  return config.listId
}

/** Código HTTP de un error traducido por este módulo (`status`), o null. */
function brevoErrorStatus(error: unknown): number | null {
  const status = (error as { status?: unknown } | null)?.status
  return typeof status === 'number' ? status : null
}

/** ¿El error indica que la lista del boletín no existe o no está configurada? */
export function isMissingBrevoList(error: unknown): boolean {
  return (
    (error as { code?: string } | null)?.code === 'BREVO_LIST_ID' ||
    brevoErrorStatus(error) === 404
  )
}

/** Traduce un error del SDK a `Error` con mensaje comprensible y `status`. */
function toBrevoError(error: unknown): Error {
  const status =
    (error as { statusCode?: number } | null)?.statusCode ?? 500
  let message = 'error desconocido'
  const body = (error as { body?: unknown } | null)?.body
  if (body && typeof body === 'object' && 'message' in body) {
    message = (body as { message?: string }).message ?? message
  }
  console.error('[brevo] Error HTTP:', status, message)
  const translated = new Error(describeBrevoError(status, message)) as BrevoApiError
  translated.status = status
  return translated
}

/** Ejecuta una llamada a la API y traduce sus errores. */
async function withBrevoErrors<T>(run: () => Promise<T>): Promise<T> {
  try {
    return await run()
  } catch (error) {
    throw toBrevoError(error)
  }
}

function describeBrevoError(status: number, message: string): string {
  switch (status) {
    case 400:
      if (message.includes('DMARC')) {
        return 'El dominio del remitente no está autenticado en Brevo.'
      }
      return `Petición inválida para Brevo: ${message}`
    case 401:
      return 'API key de Brevo inválida.'
    case 402:
      return 'No hay créditos suficientes en Brevo para enviar.'
    case 404:
      return 'No se encontró el recurso en Brevo (¿lista o campaña eliminada?).'
    case 429:
      return 'Límite de peticiones a la API de Brevo alcanzado.'
    default:
      return `Error de Brevo (${status}): ${message}`
  }
}

/** Clientes del SDK, creados por llamada: usan `fetch` nativo y sirven en Workers. */
function contactsClient(config: BrevoConfig): ContactsClient {
  return new ContactsClient({
    apiKey: config.apiKey,
    timeoutInSeconds: 30,
  })
}

function campaignsClient(config: BrevoConfig): EmailCampaignsClient {
  return new EmailCampaignsClient({
    apiKey: config.apiKey,
    timeoutInSeconds: 30,
  })
}

/* ------------------------------- Tipos ------------------------------- */

export interface BrevoListInfo {
  id: number
  name: string
  totalSubscribers: number
  totalBlacklisted: number
}

export interface BrevoCampaign {
  id: number
  name: string
  status: string
  subject?: string
  scheduledAt?: string
  sentDate?: string
  statistics?: {
    globalStats?: {
      sent?: number | null
      delivered?: number | null
      uniqueViews?: number | null
      uniqueClicks?: number | null
      unsubscriptions?: number | null
    }
    remaining?: number
  }
  recipients?: { lists?: number[] }
}

/* --------------------------- Suscripción --------------------------- */

/**
 * Doble opt-in: Brevo envía el correo de confirmación desde una plantilla
 * configurada en su panel y añade el contacto a la lista al confirmar.
 */
export async function sendDoubleOptInEmail(email: string): Promise<void> {
  const config = getBrevoConfig()
  const listId = requireListId(config)
  if (config.doiTemplateId === 0) {
    throw configError(
      'BREVO_DOI_TEMPLATE_ID',
      'BREVO_DOI_TEMPLATE_ID no está configurada.',
    )
  }

  await withBrevoErrors(() =>
    contactsClient(config).createDoiContact({
      email,
      includeListIds: [listId],
      templateId: config.doiTemplateId,
      redirectionUrl: config.doiRedirectUrl,
    }),
  )
}

/* ----------------------------- Campañas ----------------------------- */

/** Crea un borrador de campaña para la lista del boletín y devuelve su id. */
async function createDraft(
  config: BrevoConfig,
  params: { subject: string; previewText: string; htmlContent: string },
): Promise<number> {
  const response = await campaignsClient(config).createEmailCampaign({
    name: `Boletín - ${new Date().toISOString().slice(0, 10)} - ${params.subject}`.slice(
      0,
      120,
    ),
    sender: {
      name: config.senderName,
      email: config.senderEmail,
    },
    replyTo: config.replyTo,
    subject: params.subject,
    previewText: params.previewText,
    htmlContent: params.htmlContent,
    recipients: config.listId === 0 ? undefined : { listIds: [config.listId] },
  })
  return response.id
}

/**
 * Envío de prueba: crea un borrador, lo envía al email indicado
 * (máx. 50/día según Brevo) y borra el borrador para no acumular campañas.
 */
export async function sendNewsletterTest(params: {
  subject: string
  previewText: string
  htmlContent: string
  to: string
}): Promise<void> {
  const config = getBrevoConfig()

  await withBrevoErrors(async () => {
    const campaignId = await createDraft(config, params)
    try {
      await campaignsClient(config).sendTestEmail({
        campaignId,
        body: { emailTo: [params.to] },
      })
    } finally {
      // El borrador de prueba no tiene valor una vez enviada la prueba.
      await campaignsClient(config)
        .deleteEmailCampaign({ campaignId })
        .catch(() => undefined)
    }
  })
}

/** Envío real a la lista del boletín. */
export async function sendNewsletter(params: {
  subject: string
  previewText: string
  htmlContent: string
}): Promise<void> {
  const config = getBrevoConfig()
  requireListId(config)

  await withBrevoErrors(async () => {
    const campaignId = await createDraft(config, params)
    await campaignsClient(config).sendEmailCampaignNow({ campaignId })
  })
}

/* ------------------------- Lecturas (panel admin) ------------------------- */

export async function fetchListInfo(): Promise<BrevoListInfo> {
  const config = getBrevoConfig()
  const listId = requireListId(config)

  const response = await withBrevoErrors(() =>
    contactsClient(config).getList({ listId }),
  )
  return {
    id: response.id,
    name: response.name,
    totalSubscribers: response.totalSubscribers,
    totalBlacklisted: response.totalBlacklisted,
  }
}

export async function fetchRecentCampaigns(): Promise<BrevoCampaign[]> {
  const config = getBrevoConfig()

  const response = await withBrevoErrors(() =>
    campaignsClient(config).getEmailCampaigns({
      limit: 10,
      offset: 0,
      sort: 'desc',
      excludeHtmlContent: true,
    }),
  )
  return (response.campaigns ?? []).map(mapCampaign)
}

function mapCampaign(campaign: {
  id: number
  name: string
  status: string
  subject?: string
  scheduledAt?: string
  sentDate?: string
  statistics?: {
    globalStats?: {
      sent?: number | null
      delivered?: number | null
      uniqueViews?: number | null
      uniqueClicks?: number | null
      unsubscriptions?: number | null
    }
    remaining?: number
  }
  recipients?: { lists?: number[] }
}): BrevoCampaign {
  return {
    id: campaign.id,
    name: campaign.name,
    status: campaign.status,
    subject: campaign.subject,
    scheduledAt: campaign.scheduledAt,
    sentDate: campaign.sentDate,
    statistics: campaign.statistics,
    recipients: campaign.recipients,
  }
}
