import { Link, createFileRoute } from '@tanstack/react-router'
import {
  IconArrowRight,
  IconCategory,
  IconMail,
  IconSchool,
} from '@tabler/icons-react'
import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/admin/panel/_protected/')({
  component: RouteComponent,
})

type PanelCard = {
  title: string
  description: string
  to: string
  icon: typeof IconSchool
  roles?: string[]
}

const panels: PanelCard[] = [
  {
    title: 'Cursos',
    description:
      'Crea y edita cursos, organiza sus lecciones y revisa el contenido para estudiantes.',
    to: '/admin/panel/courses',
    icon: IconSchool,
  },
  {
    title: 'Blog',
    description:
      'Publica noticias y actividades: redacta artículos con bloques, imágenes y videos.',
    to: '/admin/panel/blog',
    icon: IconCategory,
  },
  {
    title: 'Boletín',
    description:
      'Administra la lista de suscriptores y envía el boletín a la comunidad.',
    to: '/admin/panel/newsletter',
    icon: IconMail,
    roles: ['admin'],
  },
]

function RouteComponent() {
  const { user } = Route.useRouteContext()
  const items = panels.filter(
    (panel) => !panel.roles || panel.roles.includes(user.role ?? ''),
  )

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          ¡Hola, {user.name}!
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Bienvenido al panel de administración. ¿Qué quieres administrar hoy?
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((panel) => {
          const Icon = panel.icon
          return (
            <Card key={panel.to} className="flex flex-col">
              <CardHeader>
                <span className="flex size-10 items-center justify-center rounded-full bg-primary/15">
                  <Icon className="size-5 text-primary" aria-hidden="true" />
                </span>
                <CardTitle className="mt-2">{panel.title}</CardTitle>
                <CardDescription>{panel.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Link
                  to={panel.to}
                  className={buttonVariants({ variant: 'outline' })}
                >
                  Acceder
                  <IconArrowRight data-icon="inline-end" />
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
