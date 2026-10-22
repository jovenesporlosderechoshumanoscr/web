import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { CourseForm } from '@/components/courses/CourseForm'
import { useCreateCourse } from '@/functions/course-client'

export const Route = createFileRoute('/admin/panel/_protected/courses/create')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const createCourse = useCreateCourse()

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-semibold">Nuevo curso</h1>
      <CourseForm
        mode="create"
        isSubmitting={createCourse.isPending}
        serverError={createCourse.error?.message ?? null}
        onSubmit={(values) =>
          createCourse.mutate(values, {
            onSuccess: (course) =>
              navigate({
                to: '/admin/panel/courses/builder/$courseId',
                params: { courseId: course.id },
              }),
          })
        }
      />
    </div>
  )
}
