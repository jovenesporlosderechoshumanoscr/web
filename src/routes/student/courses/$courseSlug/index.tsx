import { Link, createFileRoute } from '@tanstack/react-router'
import {
  IconBook,
  IconCheck,
  IconClipboardCheck,
  IconChevronRight,
  IconTrophy,
} from '@tabler/icons-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useStudentCourse } from '@/functions/course-client'

export const Route = createFileRoute('/student/courses/$courseSlug/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { courseSlug } = Route.useParams()
  const query = useStudentCourse(courseSlug)

  const course = query.data

  return (
    <div className="flex flex-col gap-4 p-4">
      {query.isPending && <Skeleton className="h-64" />}
      {query.isError && (
        <p className="text-sm text-destructive">Error al cargar el curso.</p>
      )}
      {query.isSuccess && !course && (
        <p className="py-6 text-sm text-muted-foreground">
          Curso no encontrado.
        </p>
      )}

      {course && (
        <>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold">{course.title}</h1>
            {course.description && (
              <p className="text-sm text-muted-foreground">
                {course.description}
              </p>
            )}
          </div>

          {/* Resumen de progreso */}
          <Card>
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span>
                  {course.summary.completedLessons} de{' '}
                  {course.summary.totalLessons} lecciones completadas
                </span>
                {course.summary.completed && (
                  <span className="flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
                    <IconTrophy className="size-4" />
                    ¡Curso completado!
                  </span>
                )}
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${
                      course.summary.totalLessons > 0
                        ? Math.round(
                            (course.summary.completedLessons /
                              course.summary.totalLessons) *
                              100,
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Checklist de módulos y lecciones */}
          <div className="flex flex-col gap-4">
            {course.modules.map((module, mi) => (
              <div key={module.id} className="flex flex-col gap-2">
                <h2 className="text-sm font-semibold text-muted-foreground">
                  Módulo {mi + 1} · {module.title}
                </h2>
                <div className="flex flex-col gap-1">
                  {module.lessons.map((lesson) => {
                    const completed = lesson.progressStatus === 'completed'
                    const Icon =
                      lesson.type === 'quiz' ? IconClipboardCheck : IconBook
                    return (
                      <Link
                        key={lesson.id}
                        to="/student/courses/$courseSlug/lesson/$lessonId"
                        params={{
                          courseSlug: course.slug,
                          lessonId: lesson.id,
                        }}
                        className="flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors hover:bg-accent"
                      >
                        <span
                          className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${
                            completed
                              ? 'border-emerald-500 bg-emerald-500 text-white'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {completed ? (
                            <IconCheck className="size-3.5" />
                          ) : (
                            <Icon className="size-3.5" />
                          )}
                        </span>
                        <span
                          className={
                            completed ? 'text-muted-foreground' : undefined
                          }
                        >
                          {lesson.title}
                        </span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {lesson.type === 'quiz' ? 'Quiz' : 'Lectura'}
                        </span>
                        <IconChevronRight className="size-4 text-muted-foreground" />
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
            {course.modules.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Este curso aún no tiene contenido.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
