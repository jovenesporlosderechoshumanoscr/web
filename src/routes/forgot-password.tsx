import { ForgotPasswordForm } from '@/components/forgot-password-form'
import { getSession } from '@/lib/auth.functions'
import { createFileRoute, redirect } from '@tanstack/react-router'
import * as z from 'zod'

const forgotPasswordSearchSchema = z.object({
	email: z.string().optional(),
})

export const Route = createFileRoute('/forgot-password')({
	validateSearch: forgotPasswordSearchSchema,
	beforeLoad: async () => {
		const session = await getSession()
		if (session) {
			throw redirect({ to: '/' })
		}
	},
	component: RouteComponent,
})

function RouteComponent() {
	const { email } = Route.useSearch()

	return (
		<div>
			<ForgotPasswordForm defaultEmail={email ?? ''} />
		</div>
	)
}
