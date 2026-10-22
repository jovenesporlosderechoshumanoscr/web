import { Link, createFileRoute } from '@tanstack/react-router'
import { IconTrophy } from '@tabler/icons-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useMyCourses } from '@/functions/course-client'

export const Route = createFileRoute('/student/courses/')({
  component: RouteComponent,
})

function RouteComponent() {
  const query = useMyCourses()
  const items = query.data?.items ?? []

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <h1 className="text-xl font-semibold">Mis cursos</h1>
        <p className="text-sm text-muted-foreground">
          Continúa donde lo dejaste o repasa lo aprendido.
        </p>
      </div>

      {query.isPending && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
      )}
      {query.isError && (
        <p className="text-sm text-destructive">Error al cargar los cursos.</p>
      )}
      {query.isSuccess && items.length === 0 && (
        <p className="py-6 text-sm text-muted-foreground">
          Todavía no hay cursos disponibles.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((course) => {
          const percent =
            course.totalLessons > 0
              ? Math.round(
                  (course.completedLessons / course.totalLessons) * 100,
                )
              : 0
          return (
            <Link
              key={course.id}
              to="/student/courses/$courseSlug"
              params={{ courseSlug: course.slug }}
            >
              <Card className="h-full transition-colors hover:border-ring">
                <CardContent className="flex h-full flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-semibold">{course.title}</h2>
                    {course.completed && (
                      <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-400/20 dark:text-amber-400">
                        <IconTrophy className="size-3.5" />
                        Completado
                      </span>
                    )}
                  </div>
                  {course.description && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {course.description}
                    </p>
                  )}
                  <div className="mt-auto flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {course.completedLessons} de {course.totalLessons}{' '}
                        lecciones
                      </span>
                      <span>{percent}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    {course.lastActivityAt && (
                      <p className="text-xs text-muted-foreground">
                        Última actividad:{' '}
                        {new Date(course.lastActivityAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
