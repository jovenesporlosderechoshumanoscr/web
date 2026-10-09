import { ResendVerificationForm } from '@/components/resend-verification-form'
import { createFileRoute } from '@tanstack/react-router'
import * as z from 'zod'

const resendVerificationSearchSchema = z.object({
	email: z.string().optional(),
})

export const Route = createFileRoute('/resend-verification')({
	validateSearch: resendVerificationSearchSchema,
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
