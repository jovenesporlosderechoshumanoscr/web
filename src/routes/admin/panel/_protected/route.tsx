import { getSession } from '@/lib/auth.functions';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/panel/_protected')({
   beforeLoad: async ({ location }) => {
		const session = await getSession();
		if (!session) {
			throw redirect({
				to: "/admin/login",
				search: { redirect: location.href },
			});
		}
		if (session.user.role !== "admin") {
			throw redirect({
				to: "/",
				search: { redirect: location.href },
			});
		}
		return { user: session.user };
	},
	component: () => (
				<Outlet />
	),
})
