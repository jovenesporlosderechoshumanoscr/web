import { Button } from '@/components/ui/button'
import { formatEstimated } from '@/lib/lesson-duration'
import { IconArrowRight, IconPlayerPlayFilled } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import type { CourseListItem } from './dashboard-types'

/**
 * Tarjeta destacada "Continuar donde lo dejaste": último curso con
 * actividad y su lección pendiente (dato de `lastAccessedAt`).
 */
export function ContinueCard({ course }: { course: CourseListItem }) {
  const pct =
    course.totalLessons > 0
      ? Math.round((course.completedLessons / course.totalLessons) * 100)
      : 0

  const cta =
    course.continueLesson != null ? (
      <Button
        size="lg"
        className="w-fit shrink-0"
        render={
          <Link
            to="/student/courses/$courseSlug/lesson/$lessonId"
            params={{
              courseSlug: course.slug,
              lessonId: course.continueLesson.id,
            }}
          />
        }
      >
        Continuar
        <IconArrowRight />
      </Button>
    ) : (
      <Button
        size="lg"
        className="w-fit shrink-0"
        render={
          <Link
            to="/student/courses/$courseSlug"
            params={{ courseSlug: course.slug }}
          />
        }
      >
        Empezar
        <IconArrowRight />
      </Button>
    )

  return (
    <section
      aria-labelledby="continue-title"
      className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-primary/12 via-transparent to-accent/10"
      />
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 h-full w-1/3 bg-primary/10 [clip-path:polygon(100%_0,0_0,100%_100%)]"
      />

      <div className="relative flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-8">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-xs font-semibold tracking-widest text-primary uppercase">
            <IconPlayerPlayFilled className="size-3.5" />
            Continúa donde lo dejaste
          </p>
          <h2
            id="continue-title"
            className="mt-2 truncate font-heading text-xl font-bold tracking-tight sm:text-2xl"
          >
            {course.title}
          </h2>
          {course.continueLesson && (
            <p className="mt-1 truncate text-sm text-muted-foreground">
              Lección:{' '}
              <span className="font-medium">{course.continueLesson.title}</span>
            </p>
          )}
          <div className="mt-3 flex items-center gap-3">
            <div
              className="h-2 w-full max-w-56 overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progreso del curso: ${pct}%`}
            >
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-muted-foreground">
              {pct}%
            </span>
            {course.totalMinutes > 0 && (
              <span className="hidden text-xs text-muted-foreground sm:block">
                {formatEstimated(course.totalMinutes)} en total
              </span>
            )}
          </div>
        </div>

        {cta}
      </div>
    </section>
  )
}
