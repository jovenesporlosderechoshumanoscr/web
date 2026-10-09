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
