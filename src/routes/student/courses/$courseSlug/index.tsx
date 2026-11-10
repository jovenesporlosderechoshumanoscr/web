import { createFileRoute, redirect } from '@tanstack/react-router'
import { courseQueries } from '@/server/queries/course-server'

/**
 * La raíz del curso redirige a la lección donde continúa el estudiante:
 * la última visitada sin completar (por lastAccessedAt) o la primera sin
 * completar.
 */
export const Route = createFileRoute('/student/courses/$courseSlug/')({
  beforeLoad: async ({ params }) => {
    const continuePoint = await courseQueries.getCourseContinuePoint({
      data: { slug: params.courseSlug },
    })
    if (continuePoint) {
      throw redirect({
        to: '/student/courses/$courseSlug/lesson/$lessonId',
        params: {
          courseSlug: continuePoint.courseSlug,
          lessonId: continuePoint.lessonId,
        },
        replace: true,
      })
    }
    throw redirect({ to: '/student', replace: true })
  },
})
