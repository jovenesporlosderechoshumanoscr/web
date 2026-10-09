import { env } from "cloudflare:workers"


export async function sendEmail({ to, from, subject, body, text, attachment }:
	{
		to: string,
		from: string,
		subject: string,
		body: string,
		text?: string,
		attachment?: EmailAttachment
	}){
		const response = await env.EMAIL.send({
			to,
			from,
			subject,
			text,
			html: body,
			attachments: attachment ? [attachment] : undefined
		})
		return response
	}

	// Se lee como opcional: en local la var puede no estar definida aunque el tipado generado la marque requerida.
	const EMAIL_FROM: string = (process.env as Record<string, string | undefined>).EMAIL_FROM
		?? "JPDH <no-reply@jpdh.com>"

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
			// En desarrollo el binding send_email puede no estar disponible (Miniflare lo simula).
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
			// En desarrollo el binding send_email puede no estar disponible.
			// Registramos el enlace para poder probar el flujo localmente.
			if (import.meta.env.DEV) {
				console.warn("[dev] sendEmail falló; usa este enlace de recuperación:", url)
				return { messageId: "dev" }
			}
			throw error
		}
	}
