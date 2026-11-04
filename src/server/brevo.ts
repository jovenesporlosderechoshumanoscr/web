import { ContactsClient } from '@getbrevo/brevo/contacts'
import { EmailCampaignsClient } from '@getbrevo/brevo/emailCampaigns'
import { env } from 'cloudflare:workers'

/**
 * Cliente de la API de Brevo (SDK oficial @getbrevo/brevo v6).
 *
 * - Usa `fetch` nativo y no tiene dependencias: funciona en Workers.
 * - Subpaths (`/contacts`, `/emailCampaigns`) para no bundlear el resto.
 * - Retries automáticos (2 por defecto) con timeout de 30s.
 *
 * En desarrollo no se contacta con Brevo (ver `withDevGuard`).
 * En producción la API key se guarda como secreto:
 *   wrangler secret put BREVO_API_KEY
 */

interface BrevoConfig {
  apiKey: string
  listId: number
  senderEmail: string
  senderName: string
  replyTo: string
  doiTemplateId: number
  doiRedirectUrl: string
  dailyLimit: number
}
const isProduction = import.meta.env.PROD

export function getBrevoConfig(): BrevoConfig | null {
  const apiKey = env.BREVO_API_KEY
  if (!apiKey) return null

  return {
    apiKey,
    listId: Number(process.env.BREVO_LIST_ID ?? 0),
    senderEmail: process.env.BREVO_SENDER_EMAIL ?? 'boletin@jpdh.com',
    senderName: process.env.BREVO_SENDER_NAME ?? 'JPDH',
    replyTo: process.env.BREVO_REPLY_TO ?? 'contacto@jpdh.com',
    doiTemplateId: Number(process.env.BREVO_DOI_TEMPLATE_ID ?? 0),
    doiRedirectUrl:
      process.env.BREVO_DOI_REDIRECT_URL ?? 'https://jpdh.com/?newsletter=ok',
    dailyLimit: Number(process.env.BREVO_DAILY_LIMIT ?? 300),
  }
}

export class BrevoError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

/**
 * Traduce errores HTTP de Brevo a mensajes comprensibles.
 * El SDK lanza su propia `BrevoError` con `statusCode` y `body`;
 * se detecta por duck-typing para no importar la entrada principal del SDK.
 */
function toBrevoError(error: unknown): BrevoError {
  if (error instanceof BrevoError) return error

  const statusCode =
    (error as { statusCode?: number } | null)?.statusCode ?? 500
  let message = 'error desconocido'
  const body = (error as { body?: { message?: string } } | null)?.body
  if (body && 'message' in body) {
    message = body.message ?? message
  }
  console.error('[brevo] Error HTTP:', statusCode, message)
  return new BrevoError(statusCode, describeBrevoError(statusCode, message))
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

/** Clientes del SDK, uno por recurso, creados bajo demanda. */
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

/**
 * Guard de entorno: en desarrollo no se contacta con Brevo.
 * Devuelve el resultado simulado en dev, o ejecuta la acción real en prod.
 */
export async function withDevGuard<T>(
  payload: Record<string, unknown>,
  simulated: () => T,
  real: (config: BrevoConfig) => Promise<T>,
): Promise<T> {
  if (!isProduction) {
    console.info(
      '[brevo] Modo desarrollo: no se contacta con Brevo.',
      JSON.stringify(payload),
    )
    return simulated()
  }

  const config = getBrevoConfig()
  if (!config) {
    throw new BrevoError(500, 'BREVO_API_KEY no está configurada.')
  }
  try {
    return await real(config)
  } catch (error) {
    throw toBrevoError(error)
  }
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

/* ------------------------- Listas y estadísticas ------------------------- */

export async function fetchListInfo(
  config: BrevoConfig,
  listId: number,
): Promise<BrevoListInfo> {
  const response = await contactsClient(config).getList({ listId })
  return {
    id: response.id,
    name: response.name,
    totalSubscribers: response.totalSubscribers,
    totalBlacklisted: response.totalBlacklisted,
  }
}

export async function fetchRecentCampaigns(
  config: BrevoConfig,
): Promise<BrevoCampaign[]> {
  const response = await campaignsClient(config).getEmailCampaigns({
    limit: 10,
    offset: 0,
    sort: 'desc',
    excludeHtmlContent: true,
  })
  return (response.campaigns ?? []).map(mapCampaign)
}

export async function fetchCampaignById(
  config: BrevoConfig,
  campaignId: number,
): Promise<BrevoCampaign> {
  const response = await campaignsClient(config).getEmailCampaign({
    campaignId,
    excludeHtmlContent: true,
  })
  return mapCampaign(response)
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

/* ------------------------------- Contactos ------------------------------- */

/**
 * Doble opt-in. El endpoint `/contacts/doubleOptinConfirmation` está
 * implementado en el SDK pero no aparece en sus tipos, así que se llama
 * con `fetch` directamente.
 */
export async function sendDoubleOptInEmail(
  config: BrevoConfig,
  email: string,
): Promise<void> {
  const response = await fetch(
    'https://api.brevo.com/v3/contacts/doubleOptinConfirmation',
    {
      method: 'POST',
      headers: {
        'api-key': config.apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        includeListIds: [config.listId],
        templateId: config.doiTemplateId,
        redirectionUrl: config.doiRedirectUrl,
      }),
    },
  )

  if (!response.ok) {
    let message = 'error desconocido'
    try {
      const payload: { message?: string } = await response.json()
      message = payload.message ?? message
    } catch {
      // Respuesta sin cuerpo JSON.
    }
    console.error('[brevo] Error HTTP:', response.status, message)
    throw new BrevoError(
      response.status,
      describeBrevoError(response.status, message),
    )
  }
}

/* ------------------------------- Campañas ------------------------------- */

export async function createCampaign(
  config: BrevoConfig,
  params: {
    subject: string
    previewText: string
    htmlContent: string
    listId: number
  },
): Promise<{ id: number }> {
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
    recipients: { listIds: [params.listId] },
  })
  return { id: response.id }
}

export async function sendTestCampaign(
  config: BrevoConfig,
  campaignId: number,
  emailTo: string[],
): Promise<void> {
  await campaignsClient(config).sendTestEmail({
    campaignId,
    body: { emailTo },
  })
}

export async function sendCampaignNow(
  config: BrevoConfig,
  campaignId: number,
): Promise<void> {
  await campaignsClient(config).sendEmailCampaignNow({ campaignId })
}

export async function deleteCampaign(
  config: BrevoConfig,
  campaignId: number,
): Promise<void> {
  await campaignsClient(config).deleteEmailCampaign({ campaignId })
}
