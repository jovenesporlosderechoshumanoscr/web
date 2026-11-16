import { ResendVerificationForm } from '@/components/resend-verification-form'
import { createFileRoute } from '@tanstack/react-router'
import * as z from 'zod'

const resendVerificationSearchSchema = z.object({
	email: z.string().optional(),
})

export const Route = createFileRoute('/resend-verification')({
	validateSearch: resendVerificationSearchSchema,
	head: () => ({
		meta: [
			{ title: 'Reenviar verificación — JPDH' },
			{
				name: 'description',
				content:
					'Vuelve a enviarnos el enlace de verificación para confirmar tu correo electrónico y activar tu cuenta.',
			},
		],
	}),
	component: RouteComponent,
})

function RouteComponent() {
	const { email } = Route.useSearch()

	return (
		<div>
			<ResendVerificationForm defaultEmail={email ?? ''} />
		</div>
	)
}
