import { Resend } from "resend"
import { env } from "cloudflare:workers"

/**
 * Envío de correos transaccionales (verificación de cuenta, recuperación de
 * contraseña, cambio de correo) con Resend.
 *
 * - `RESEND_API_KEY` va como secreto en producción
 *   (`wrangler secret put RESEND_API_KEY`) y en `.env` en desarrollo.
 * - `EMAIL_FROM` es una variable de wrangler (`vars`).
 */

type SendEmailInput = {
	to: string
	from: string
	subject: string
	body: string
	text?: string
	attachment?: EmailAttachment
}

async function sendEmail({
	to,
	from,
	subject,
	body,
	text,
	attachment,
}: SendEmailInput) {
	const apiKey = env.RESEND_API_KEY || process.env.RESEND_API_KEY
	if (!apiKey) {
		const error = new Error("RESEND_API_KEY no está configurada.") as Error & {
			code?: string
		}
		error.code = "RESEND_API_KEY"
		throw error
	}

	const resend = new Resend(apiKey)

	const { data, error } = await resend.emails.send({
		from,
		to,
		subject,
		html: body,
		text,
		attachments: attachment
			? [
					{
						content: Buffer.isBuffer(attachment.content)
							? Buffer.from(attachment.content).toString("base64")
							: attachment.content.toString(),
						filename: attachment.filename,
					},
				]
			: undefined,
	})

	if (error) {
		throw new Error(`Resend: ${error.message}`)
	}

	return { messageId: data.id }
}

const EMAIL_FROM = env.EMAIL_FROM || process.env.EMAIL_FROM || "JPDH <no-reply@emails.jovenesporlosderechoshumanoscr.org>"

export async function sendVerificationEmail({
	to,
	url,
}: {
	to: string
	url: string
}) {
	const subject = "Verifica tu correo"
	const text = `Verifica tu correo electrónico haciendo clic en este enlace: ${url}\n\nEste enlace caduca en 1 hora.`
	const body = `<!doctype html>
<html lang="es">
	<body style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
		<h1 style="font-size: 22px;">Verifica tu correo</h1>
		<p>Haz clic en el siguiente botón para confirmar tu dirección de correo electrónico:</p>
		<p><a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #111827; color: #ffffff; text-decoration: none; border-radius: 6px;">Verificar correo</a></p>
		<p>O copia y pega este enlace en tu navegador:</p>
		<p><a href="${url}">${url}</a></p>
		<p>Este enlace caduca en 1 hora.</p>
	</body>
</html>`
	try {
		return await sendEmail({ to, from: EMAIL_FROM, subject, body, text })
	} catch (error) {
		// En desarrollo Resend puede no estar configurado.
		// Registramos el enlace para poder probar el flujo localmente.
		if (import.meta.env.DEV) {
			console.warn("[dev] sendEmail falló; usa este enlace de verificación:", url)
			return { messageId: "dev" }
		}
		throw error
	}
}

export async function sendPasswordResetEmail({
	to,
	url,
}: {
	to: string
	url: string
}) {
	const subject = "Recupera tu contraseña"
	const text = `Recupera tu contraseña haciendo clic en este enlace: ${url}\n\nEste enlace caduca en 1 hora. Si no solicitaste este cambio, ignora este correo.`
	const body = `<!doctype html>
<html lang="es">
	<body style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
		<h1 style="font-size: 22px;">Recupera tu contraseña</h1>
		<p>Haz clic en el siguiente botón para establecer una nueva contraseña:</p>
		<p><a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #111827; color: #ffffff; text-decoration: none; border-radius: 6px;">Cambiar contraseña</a></p>
		<p>O copia y pega este enlace en tu navegador:</p>
		<p><a href="${url}">${url}</a></p>
		<p>Este enlace caduca en 1 hora. Si no solicitaste este cambio, ignora este correo.</p>
	</body>
</html>`
	try {
		return await sendEmail({ to, from: EMAIL_FROM, subject, body, text })
	} catch (error) {
		// En desarrollo Resend puede no estar configurado.
		// Registramos el enlace para poder probar el flujo localmente.
		if (import.meta.env.DEV) {
			console.warn("[dev] sendEmail falló; usa este enlace de recuperación:", url)
			return { messageId: "dev" }
		}
		throw error
	}
}
