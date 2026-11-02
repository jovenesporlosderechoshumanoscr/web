import { AdminSidebar } from '@/components/adminSidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
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
		const ALLOWED_ROLES = ["admin", "editor"];
		if (!session.user.role || !ALLOWED_ROLES.includes(session.user.role)) {
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
			<SidebarInset>
				<header className="flex h-12 shrink-0 items-center gap-2 px-4">
					<SidebarTrigger />
				</header>
				<div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}
