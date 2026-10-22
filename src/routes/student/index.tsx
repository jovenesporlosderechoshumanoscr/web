import { Link, createFileRoute } from '@tanstack/react-router'
import { buttonVariants } from '@/components/ui/button'

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
          Hola {user.name}, revisa tus cursos y continúa donde lo dejaste.
        </p>
      </div>
      <Link
        to="/student/courses"
        className={buttonVariants({ variant: 'outline', className: 'w-fit' })}
      >
        Ir a mis cursos
      </Link>
    </div>
  )
}
