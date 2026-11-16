import { LoginForm } from '@/components/login-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/login')({
  head: () => ({
    meta: [
      { title: 'Acceso administrativo — JPDH' },
      {
        name: 'description',
        content:
          'Acceso exclusivo para administradores y editores de Jóvenes por los Derechos Humanos Costa Rica.',
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-4xl">
        <LoginForm redirectTo="/admin/panel" />
      </div>
    </div>
  )
}
