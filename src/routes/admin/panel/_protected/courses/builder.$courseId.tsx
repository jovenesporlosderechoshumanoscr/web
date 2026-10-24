import { createFileRoute } from '@tanstack/react-router'
import { CourseBuilder } from '@/components/courses/CourseBuilder'

export const Route = createFileRoute(
  '/admin/panel/_protected/courses/builder/$courseId',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { courseId } = Route.useParams()

  return <CourseBuilder courseId={courseId} />
}
