import { ForgotPasswordForm } from '@/components/forgot-password-form'
import Footer from '@/components/landing/Footer'
import Header from '@/components/landing/Header'
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
		<div className="flex min-h-svh flex-col bg-background text-foreground">
			<Header />
			<main className="flex flex-1 items-center justify-center p-6 md:p-10">
				<div className="w-full max-w-4xl">
					<ForgotPasswordForm defaultEmail={email ?? ''} />
				</div>
			</main>
			<Footer />
		</div>
	)
}
