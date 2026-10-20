import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
} from "@/components/ui/sidebar"
import { courseModules } from "@/lib/course"
import { StudentSidebarMain } from "./studentSidebarMain"
import { StudentSidebarUser } from "./studentSidebarUser"

export function StudentSidebar({
	user,
}: {
	user: { name: string; email: string }
}) {
	return (
		<Sidebar>
			<SidebarHeader className="py-2">
				<h1 className="text-2xl font-bold">JPDH</h1>
				<p className="text-sm">Bienvenido {user.name}</p>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<StudentSidebarMain modules={courseModules} />
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<StudentSidebarUser user={user} />
			</SidebarFooter>
		</Sidebar>
	)
}
