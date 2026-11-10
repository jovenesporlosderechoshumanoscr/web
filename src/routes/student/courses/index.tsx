import { createFileRoute, redirect } from '@tanstack/react-router'

/**
 * El listado "Mis cursos" se eliminó: el dashboard de /student hace ese
 * papel. Redirect permanente a la nueva ubicación.
 */
export const Route = createFileRoute('/student/courses/')({
  beforeLoad: () => {
    throw redirect({ to: '/student', replace: true })
  },
})
