import { createFileRoute } from '@tanstack/react-router'
import { CourseForm } from '@/components/courses/CourseForm'
import { useCourse, useUpdateCourse } from '@/functions/course-client'

export const Route = createFileRoute(
  '/admin/panel/_protected/courses/edit/$courseId',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { courseId } = Route.useParams()
  const courseQuery = useCourse(courseId)
  const updateCourse = useUpdateCourse()

  const course = courseQuery.data

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-semibold">Editar curso</h1>
      {courseQuery.isPending && <p className="text-sm">Cargando…</p>}
      {courseQuery.isError && (
        <p className="text-sm text-destructive">Error al cargar el curso.</p>
      )}
      {course && (
        <CourseForm
          mode="edit"
          initialValues={{
            title: course.title,
            status: course.status,
            description: course.description,
            coverImage: course.coverImage,
          }}
          isSubmitting={updateCourse.isPending}
          serverError={updateCourse.error?.message ?? null}
          onSubmit={(values) =>
            updateCourse.mutate({ id: course.id, ...values })
          }
        />
      )}
    </div>
  )
}
