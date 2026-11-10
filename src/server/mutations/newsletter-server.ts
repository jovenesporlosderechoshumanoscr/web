import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth'
import { sendDoubleOptInEmail, sendNewsletter } from '@/server/brevo'
import {
	renderNewsletterHtml,
	validateNewsletterInput,
} from '@/server/newsletter-template'
import {
	sendCampaignSchema,
	subscribeSchema,
} from '@/server/validation/newsletter'

/**
 * Escrituras del boletín. Los suscriptores y las campañas viven en Brevo;
 * aquí solo se orquestan llamadas a su API (ver `src/server/brevo.ts`).
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
		try {
			await sendDoubleOptInEmail(data.email)
		} catch (err) {
			console.log(err)
		}
		return { ok: true as const }
	})

/**
 * Envío real a la lista del boletín.
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

		await sendNewsletter({
			subject: data.subject,
			previewText: data.previewText,
			htmlContent: html,
		})

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
	sendCampaign,
}
