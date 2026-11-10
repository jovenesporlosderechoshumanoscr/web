import { Button, buttonVariants } from '@/components/ui/button'
import { ProgressRing } from '@/components/student/ProgressRing'
import { formatMinutes } from '@/lib/lesson-duration'
import { cn } from 'cn'
import { useGenerateCertificate } from '@/functions/course-client'
import {
  IconBook,
  IconDownload,
  IconPlayerPlay,
  IconRotate,
  IconTrophy,
} from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import type { CourseListItem } from './dashboard-types'

type CourseStatus = 'not-started' | 'in-progress' | 'completed'

function courseStatus(item: CourseListItem): CourseStatus {
  if (item.totalLessons === 0) return 'not-started'
  if (item.completedLessons === 0) return 'not-started'
  if (item.completed) return 'completed'
  return 'in-progress'
}

const STATUS_LABEL: Record<
  CourseStatus,
  { text: string; icon: typeof IconBook }
> = {
  'not-started': { text: 'Empezar', icon: IconPlayerPlay },
  'in-progress': { text: 'Continuar', icon: IconRotate },
  completed: { text: 'Descargar certificado', icon: IconDownload },
}

const STATUS_BADGE: Record<CourseStatus, string> = {
  'not-started': 'bg-muted text-muted-foreground',
  'in-progress': 'bg-primary/15 text-primary',
  completed: 'bg-success/15 text-success',
}

const STATUS_BADGE_TEXT: Record<CourseStatus, string> = {
  'not-started': 'Sin empezar',
  'in-progress': 'En progreso',
  completed: 'Completado',
}

/**
 * Tarjeta de curso del dashboard. Con un solo curso se muestra destacada
 * (portada a la izquierda, contenido a la derecha); en grid multi-curso la
 * portada queda arriba (pasa `featured={false}`).
 */
export function CourseCard({
  course,
  featured = true,
  className,
}: {
  course: CourseListItem
  featured?: boolean
  className?: string
}) {
  const status = courseStatus(course)
  const pct =
    course.totalLessons > 0
      ? Math.round((course.completedLessons / course.totalLessons) * 100)
      : 0
  const CtaIcon = STATUS_LABEL[status].icon
  const generateCertificate = useGenerateCertificate()
  const [downloadError, setDownloadError] = useState(false)
  const isCompleted = status === 'completed'

  return (
    <article
      className={cn(
        'group relative flex overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow duration-200 hover:shadow-xl',
        featured ? 'flex-col md:flex-row' : 'flex-col',
        className,
      )}
    >
      {/* Portada con fallback de marca (gradiente + diagonales) */}
      <div
        className={cn(
          'relative shrink-0 overflow-hidden',
          featured
            ? 'h-44 w-full bg-gradient-to-br from-primary/25 via-primary/10 to-accent/20 md:h-auto md:w-80 lg:w-96'
            : 'h-40 w-full bg-gradient-to-br from-primary/25 via-primary/10 to-accent/20',
        )}
      >
        {course.coverImage ? (
          <img
            src={course.coverImage}
            alt={`Portada del curso ${course.title}`}
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <div aria-hidden="true" className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/25" />
            <div className="absolute right-0 bottom-0 h-2/3 w-2/3 bg-primary/25 [clip-path:polygon(100%_0,0_0,100%_100%)]" />
            <div className="absolute bottom-0 left-4 h-1/2 w-1/2 bg-secondary/20 [clip-path:polygon(0_100%,0_0,100%_100%)]" />
            <div className="absolute top-6 left-6 size-4 rounded-full bg-accent/40" />
          </div>
        )}
        {status === 'completed' && (
          <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-success shadow-sm backdrop-blur">
            <IconTrophy className="size-3.5" />
            Completado
          </span>
        )}
      </div>

      <div className={cn('flex flex-1 flex-col gap-3 p-5 sm:p-6')}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2
              className={cn(
                'font-heading font-bold tracking-tight',
                featured ? 'text-2xl sm:text-3xl' : 'text-xl',
              )}
            >
              {course.title}
            </h2>
            <span
              className={cn(
                'mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                STATUS_BADGE[status],
              )}
            >
              {STATUS_BADGE_TEXT[status]}
            </span>
          </div>
          <ProgressRing value={pct} size={featured ? 72 : 56}>
            <span className="text-sm font-bold">{pct}%</span>
          </ProgressRing>
        </div>

        {course.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground sm:text-base">
            {course.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground sm:text-sm">
          <span className="flex items-center gap-1.5">
            <IconBook className="size-4" />
            {course.totalLessons}{' '}
            {course.totalLessons === 1 ? 'lección' : 'lecciones'}
          </span>
          {course.totalMinutes > 0 && (
            <span>≈ {formatMinutes(course.totalMinutes)} en total</span>
          )}
        </div>

        <div className="mt-auto flex items-center gap-3 pt-2">
          {isCompleted ? (
            <Button
              size={featured ? 'lg' : 'default'}
              onClick={() => {
                setDownloadError(false)
                generateCertificate.mutate(
                  { courseId: course.id },
                  { onError: () => setDownloadError(true) },
                )
              }}
              disabled={generateCertificate.isPending}
            >
              <CtaIcon />
              {generateCertificate.isPending
                ? 'Generando…'
                : STATUS_LABEL[status].text}
            </Button>
          ) : (
            <Button
              size={featured ? 'lg' : 'default'}
              render={
                <Link
                  to="/student/courses/$courseSlug"
                  params={{ courseSlug: course.slug }}
                />
              }
            >
              <CtaIcon />
              {STATUS_LABEL[status].text}
            </Button>
          )}
          <Link
            to="/student/courses/$courseSlug"
            params={{ courseSlug: course.slug }}
            className={buttonVariants({ variant: 'ghost' })}
          >
            Ver temario
          </Link>
        </div>
        {downloadError && (
          <p className="text-sm text-destructive">
            No se pudo descargar el certificado. Inténtalo de nuevo.
          </p>
        )}
      </div>
    </article>
  )
}
