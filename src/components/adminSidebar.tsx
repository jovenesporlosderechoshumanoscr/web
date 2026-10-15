import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
} from "@/components/ui/sidebar"
import { IconBook, IconCategory} from "@tabler/icons-react"
import { AdminSidebarMain } from "./adminSidebarMain"
import { NavUser } from "./adminSidebarUser"

const data = {
	navMain: [
		{
			title: "Blog",
			url: "/admin/panel/blog",
			icon: (
				<IconCategory
				/>
			)
		},
		{
			title: "usuarios",
			url: "/admin/panel/users",
			roles: ["admin"],
			icon: (
				<IconBook
				/>
			),
			items: [
				{
					title: "Crear Usuario",
					url: "/admin/panel/users",
				},

			],
		},
	]
}

export function AdminSidebar({ props }: { props: any }) {

	const items = data.navMain.filter(
		(item) => !item.roles || item.roles.includes(props.role),
	)

	return (
		<Sidebar>
			<SidebarHeader className="py-2">
				<h1 className="text-2xl font-bold">JPDH</h1>
				<p className="text-sm">Bienvenido {props.name}</p>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup >
					<AdminSidebarMain items={items} />
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter >
				<NavUser user={props} />
			</SidebarFooter>
		</Sidebar>
	)
}
