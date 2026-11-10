import { getSession } from '@/lib/auth.functions'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

/**
 * Guard de la zona de estudiante. Sin UI propia: el layout visual depende
 * de la página (PlatformLayout en el dashboard/perfil, CourseLayout con
 * sidebar dentro de un curso).
 */
export const Route = createFileRoute('/student')({
  beforeLoad: async ({ location }) => {
    const session = await getSession()
    if (!session) {
      throw redirect({
        to: '/',
        search: { redirect: location.href },
      })
    }
    if (session.user.role === 'admin' || session.user.role === 'editor') {
      throw redirect({
        to: '/admin/panel',
      })
    }
    return { user: session.user }
  },
  component: () => <Outlet />,
})
