import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/student/')({
	component: RouteComponent,
})

function RouteComponent() {
	const { user } = Route.useRouteContext()

	return (
		<div className="flex flex-col gap-4 p-4">
			<div>
				<h1 className="text-xl font-semibold">Zona de estudiantes</h1>
				<p className="text-sm text-muted-foreground">
					Hola {user.name}, explora los módulos del curso en el menú lateral.
				</p>
			</div>
		</div>
	)
}
