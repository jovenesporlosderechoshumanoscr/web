import { AdminSidebar } from '@/components/adminSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
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
		if (!session.user.role || session.user.role !== "admin") {
			throw redirect({
				to: "/",
				search: { redirect: location.href },
			});
		}
		return { user: session.user };
	},
	component: RouteComponent,
})

function RouteComponent() {
	const { user } = Route.useRouteContext();
	return (
		<SidebarProvider>
			<AdminSidebar props={user} />
			<SidebarTrigger />
			<Outlet />

		</SidebarProvider>

	)
}
