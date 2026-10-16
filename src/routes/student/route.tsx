import { StudentSidebar } from '@/components/studentSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { getSession } from '@/lib/auth.functions';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/student')({
	beforeLoad: async ({ location }) => {
		const session = await getSession();
		if (!session) {
			throw redirect({
				to: "/login",
				search: { redirect: location.href },
			});
		}
		if (session.user.role !== "student") {
			throw redirect({
				to: "/",
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
			<StudentSidebar user={user} />
			<SidebarTrigger />
			<Outlet />

		</SidebarProvider>

	)
}
