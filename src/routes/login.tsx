import { LoginForm } from '@/components/login-form'
import { getSession } from '@/lib/auth.functions';
import { createFileRoute, redirect } from '@tanstack/react-router'
export const Route = createFileRoute('/login')({
	beforeLoad: async () => {
		const session = await getSession();
		if (session) {
			throw redirect({
				to: "/",
			});
		}
	},
  component: RouteComponent,
})

function RouteComponent() {
	
return (
	<div>
	<LoginForm />
	</div>
)

}
