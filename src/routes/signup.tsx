import { SignupForm } from '@/components/signup-form'
import Footer from '@/components/landing/Footer'
import Header from '@/components/landing/Header'
import { getSession } from '@/lib/auth.functions';
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/signup')({
	beforeLoad: async () => {
		const session = await getSession();
		if (session) {
			throw redirect({
				to: session.user.role === 'student' ? '/student' : '/',
			});
		}
	},
  component: RouteComponent,
})

function RouteComponent() {

return (
	<div className="flex min-h-svh flex-col bg-background text-foreground">
		<Header />
		<main className="flex flex-1 items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-4xl">
				<SignupForm />
			</div>
		</main>
		<Footer />
	</div>
)

}
