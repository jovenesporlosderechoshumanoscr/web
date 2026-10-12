import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
} from "@/components/ui/sidebar"
import { IconBook, IconCategory, IconRobot, IconTerminal2 } from "@tabler/icons-react"
import { AdminSidebarMain } from "./adminSidebarMain"

const data = {
	navMain: [
		{
			title: "Categorías",
			url: "/panel/categories",
			icon: (
				<IconCategory
				/>
			),
			items: [
				{
					title: "Todas",
					url: "/panel/categories",
				},
			],
		},
		{
			title: "Productos",
			url: "/panel/products",
			icon: (
				<IconTerminal2
				/>
			),
			isActive: true,
			items: [
				{
					title: "Todos",
					url: "/panel/products",
				},
			],
		},
		{
			title: "Ordenes",
			url: "/panel/orders",
			icon: (
				<IconRobot
				/>
			),
			items: [
				{
					title: "Todas",
					url: "/panel/orders",
				},
				{
					title: "Crear orden",
					url: "/panel/orders/new",
				},
				{
					title: "Pendientes",
					url: "/panel/orders",
				},
				{
					title: "En transito",
					url: "/panel/orders",
				},
				{
					title: "Completadas",
					url: "/panel/orders",
				},
			],
		},
		{
			title: "Proveedores",
			url: "/panel/proveedores",
			icon: (
				<IconRobot
				/>
			),
			items: [
				{
					title: "Todos",
					url: "/panel/proveedores",
				},
			],
		},
		{
			title: "usuarios",
			url: "/panel/users",
			icon: (
				<IconBook
				/>
			),
			items: [
				{
					title: "Crear Usuario",
					url: "/panel/users",
				},

			],
		},
	]}

export function AdminSidebar({ props }: { props: any }) {
	console.log(props)

	return (
		<Sidebar>
			<SidebarHeader className="py-2">
				<h1 className="text-2xl font-bold">JPDH</h1>
				<p className="text-sm">Bienvenido {props.name}</p>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup >
				<AdminSidebarMain items={data.navMain} />
				</SidebarGroup>
				<SidebarGroup className="border-t border-black">


				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter />
		</Sidebar>
	)
}
