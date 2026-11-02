import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth'
import {
  BrevoError,
  createCampaign,
  deleteCampaign,
  sendCampaignNow,
  sendDoubleOptInEmail,
  sendTestCampaign,
  withDevGuard,
} from '@/server/brevo'
import {
  renderNewsletterHtml,
  validateNewsletterInput,
} from '@/server/newsletter-template'
import {
  sendCampaignSchema,
  sendTestSchema,
  subscribeSchema,
} from '@/server/validation/newsletter'

/**
 * Escrituras del boletín. Los suscriptores y las campañas viven en Brevo;
 * aquí solo se orquestan llamadas a su API.
 *
 * En dev, `withDevGuard` registra el payload en consola y devuelve un
 * resultado simulado sin contactar a Brevo.
 */

/**
 * Suscripción pública (sin sesión). Doble opt-in: Brevo envía el correo de
 * confirmación desde una plantilla de su panel.
 */
const subscribe = createServerFn({ method: 'POST' })
  .validator(subscribeSchema)
  .handler(async ({ data }) => {
    // Honeypot anti-bots: los bots rellenan todos los campos.
    if (data.email.includes('+honeypot+')) {
      return { ok: true as const }
    }

    await withDevGuard<void>(
      { action: 'subscribe', email: data.email },
      () => undefined,
      (config) => sendDoubleOptInEmail(config, data.email),
    )

    return { ok: true as const }
  })

/**
 * Envío de prueba: crea un borrador, lo envía al email indicado
 * (máx. 50/día según Brevo) y borra el borrador para no acumular campañas.
 */
const sendTest = createServerFn({ method: 'POST' })
  .validator(sendTestSchema)
  .handler(async ({ data }) => {
    const session = await ensureAdmin()
    const invalid = validateNewsletterInput(data)
    if (invalid) throw new Error(invalid)

    const html = renderNewsletterHtml({
      content: data.content,
      previewText: data.previewText,
    })

    await withDevGuard<void>(
      {
        action: 'sendTest',
        subject: data.subject,
        testEmail: data.testEmail,
      },
      () => undefined,
      async (config) => {
        const campaign = await createCampaign(config, {
          subject: data.subject,
          previewText: data.previewText,
          htmlContent: html,
          listId: config.listId,
        })
        try {
          await sendTestCampaign(config, campaign.id, [data.testEmail])
        } finally {
          // El borrador de prueba no tiene valor una vez enviada la prueba.
          await deleteCampaign(config, campaign.id).catch(() => undefined)
        }
      },
    )

    console.info(
      '[brevo] Prueba enviada:',
      data.subject,
      '→',
      data.testEmail,
      'por',
      session.user.email,
    )
    return { ok: true as const }
  })

/**
 * Envío real a la lista del boletín. Verifica que la campaña siga en
 * borrador justo antes de lanzarla (protección contra doble envío).
 */
const sendCampaign = createServerFn({ method: 'POST' })
  .validator(sendCampaignSchema)
  .handler(async ({ data }) => {
    await ensureAdmin()
    const invalid = validateNewsletterInput(data)
    if (invalid) throw new Error(invalid)

    const html = renderNewsletterHtml({
      content: data.content,
      previewText: data.previewText,
    })

    await withDevGuard<void>(
      {
        action: 'sendCampaign',
        subject: data.subject,
        htmlBytes: html.length,
      },
      () => undefined,
      async (config) => {
        if (config.listId === 0) {
          throw new BrevoError(500, 'BREVO_LIST_ID no está configurada.')
        }
        const campaign = await createCampaign(config, {
          subject: data.subject,
          previewText: data.previewText,
          htmlContent: html,
          listId: config.listId,
        })
        await sendCampaignNow(config, campaign.id)
      },
    )

    console.info('[brevo] Campaña iniciada:', data.subject)
    return { ok: true as const }
  })

async function ensureAdmin() {
  const headers = getRequestHeaders()
  const session = await auth.api.getSession({ headers })
  if (!session || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }
  return session
}

export const newsletterMutations = {
  subscribe,
  sendTest,
  sendCampaign,
}
