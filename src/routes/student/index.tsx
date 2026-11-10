import { PlatformLayout } from '@/components/student/PlatformLayout'
import { ContinueCard } from '@/components/student/ContinueCard'
import { CourseCard } from '@/components/student/CourseCard'
import { EmptyCourses } from '@/components/student/EmptyCourses'
import { Skeleton } from '@/components/ui/skeleton'
import { useMyCourses } from '@/functions/course-client'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/student/')({
  component: RouteComponent,
})

/** Frases motivadoras rotativas del hero (una por carga). */
const MOTIVATIONAL_LINES = [
  'Cada lección te acerca a defender tus derechos y los de tu comunidad.',
  'Aprender derechos humanos es sembrar paz para el futuro.',
  'El conocimiento de tus derechos es el primer paso para ejercerlos.',
] as const

function RouteComponent() {
  const { user } = Route.useRouteContext()
  const coursesQuery = useMyCourses()
  const courses = coursesQuery.data?.items ?? []

  const lessonsCompleted = courses.reduce(
    (sum, c) => sum + c.completedLessons,
    0,
  )
  const inProgress = courses.filter(
    (c) => c.totalLessons > 0 && !c.completed && c.completedLessons > 0,
  ).length

  const continueCourse =
    courses.find(
      (c) => c.continueLesson != null && !c.completed && c.totalLessons > 0,
    ) ?? null
  const featuredCourse = courses[0] ?? null

  return (
    <PlatformLayout user={user}>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Hero */}
        <header className="relative">
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            ¡Hola, {user.name}! 👋
          </h1>
          <p className="mt-2 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {
              MOTIVATIONAL_LINES[
                Math.floor(Math.random() * MOTIVATIONAL_LINES.length)
              ]
            }
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 font-medium text-primary">
              {inProgress}{' '}
              {inProgress === 1 ? 'curso en progreso' : 'cursos en progreso'}
            </span>
            <span className="rounded-full border border-success/25 bg-success/10 px-3.5 py-1.5 font-medium text-success">
              {lessonsCompleted}{' '}
              {lessonsCompleted === 1
                ? 'lección completada'
                : 'lecciones completadas'}
            </span>
          </div>
        </header>

        <div className="mt-8 flex flex-col gap-8">
          {coursesQuery.isPending && <DashboardSkeleton />}

          {coursesQuery.isSuccess && courses.length === 0 && <EmptyCourses />}

          {coursesQuery.isSuccess && courses.length > 0 && (
            <>
              {continueCourse && (
                <div className="animate-fade-up">
                  <ContinueCard course={continueCourse} />
                </div>
              )}

              <section aria-labelledby="courses-title">
                <h2
                  id="courses-title"
                  className="font-heading text-lg font-bold tracking-tight sm:text-xl"
                >
                  Mis cursos
                </h2>
                <div className="mt-4 flex flex-col gap-6">
                  {courses.length === 1 ? (
                    <div className="animate-fade-up">
                      <CourseCard course={featuredCourse} featured />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                      {courses.map((course, i) => (
                        <div
                          key={course.id}
                          className="animate-fade-up"
                          style={{ animationDelay: `${i * 70}ms` }}
                        >
                          <CourseCard course={course} featured={false} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </>
          )}

          {coursesQuery.isError && (
            <p className="text-sm text-destructive">
              Error al cargar tus cursos.
            </p>
          )}
        </div>
      </div>
    </PlatformLayout>
  )
}

function DashboardSkeleton() {
  return (
    <>
      <Skeleton className="h-32 rounded-3xl" />
      <div className="space-y-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-72 rounded-3xl" />
      </div>
    </>
  )
}
