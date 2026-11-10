import { useEffect, useRef, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconClock,
  IconSparkles,
} from '@tabler/icons-react'
import { CourseCompletedModal } from '@/components/courses/CourseCompletedModal'
import { QuizView } from '@/components/courses/QuizView'
import { PostRenderer } from '@/components/blog/PostRenderer'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useSaveProgress, useStudentLesson } from '@/functions/course-client'
import { formatEstimated } from '@/lib/lesson-duration'
import { cn } from 'cn'

export const Route = createFileRoute(
  '/student/courses/$courseSlug/lesson/$lessonId',
)({
  component: RouteComponent,
})

type StudentLesson = NonNullable<ReturnType<typeof useStudentLesson>['data']>

function RouteComponent() {
  const { lessonId } = Route.useParams()
  const query = useStudentLesson(lessonId)

  if (query.isPending) {
    return <LessonSkeleton />
  }
  if (query.isError) {
    return (
      <p className="p-4 text-sm text-destructive">
        Error al cargar la lección.
      </p>
    )
  }
  if (!query.data) {
    return (
      <p className="p-4 text-sm text-muted-foreground">
        Lección no encontrada.
      </p>
    )
  }

  return <LessonView lesson={query.data} />
}

function LessonSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <Skeleton className="h-6 w-32 rounded-full" />
      <Skeleton className="mt-4 h-10 w-3/4" />
      <Skeleton className="mt-2 h-5 w-48" />
      <div className="mt-8 flex flex-col gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-full" />
        ))}
        <Skeleton className="h-5 w-2/3" />
      </div>
    </div>
  )
}

function LessonView({ lesson }: { lesson: StudentLesson }) {
  const lessonId = lesson.id
  const saveProgress = useSaveProgress()

  // Popup de curso completado (una sola vez por sesión de la página).
  const [showCompleted, setShowCompleted] = useState(false)
  const completedFired = useRef(false)

  // Centinela del final de la lectura.
  const endRef = useRef<HTMLDivElement | null>(null)

  function markCompleted() {
    if (completedFired.current) return
    completedFired.current = true
    saveProgress.mutate(
      { lessonId, status: 'completed' },
      {
        onSuccess: (data) => {
          if (data.courseJustCompleted) setShowCompleted(true)
        },
      },
    )
  }

  // Al abrir la lección: registrar actividad ("en progreso").
  useEffect(() => {
    saveProgress.mutate({ lessonId, status: 'in_progress' })
    // Solo al cambiar de lección.
  }, [lessonId])

  // Marcar la lectura como completada cuando el estudiante llega al final.
  useEffect(() => {
    if (lesson.type !== 'reading') return
    // Si ya estaba completada no hace falta observar.
    if (lesson.progress?.status === 'completed') {
      completedFired.current = true
      return
    }
    const node = endRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          markCompleted()
          observer.disconnect()
        }
      },
      // El "final de la lectura" es el último bloque con parte visible.
      { threshold: 0.8 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [lesson.id, lesson.progress?.status])

  const completed = lesson.progress?.status === 'completed'

  return (
    <div className="relative flex flex-col pb-24">
      <div
        data-reading-target
        className="mx-auto w-full max-w-[46rem] px-4 sm:px-6"
      >
        {/* Cabecera */}
        <header className="pt-8 pb-6">
          <Link
            to="/student/courses/$courseSlug"
            params={{ courseSlug: lesson.course.slug }}
            className="inline-flex w-fit items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/15 focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
          >
            {lesson.module.title}
          </Link>
          <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            {lesson.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              {lesson.type === 'quiz' ? 'Quiz' : 'Lectura'}
            </span>
            {lesson.estimatedMinutes != null && (
              <span className="flex items-center gap-1.5">
                <IconClock className="size-4" />
                {formatEstimated(lesson.estimatedMinutes)}
              </span>
            )}
            <span
              className={cn(
                'flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
                completed
                  ? 'bg-success/15 text-success'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              <IconCheck className="size-3.5" />
              {completed ? 'Completada' : 'En progreso'}
            </span>
          </div>
        </header>

        {lesson.type === 'reading' ? (
          <>
            <PostRenderer blocks={lesson.content ?? []} variant="lesson" />
            {/* Centinela del final de la lectura */}
            <div ref={endRef} className="h-1" />
            {!completed && (
              <div className="mt-10 flex flex-col items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="animate-fade-up rounded-2xl"
                  onClick={markCompleted}
                >
                  <IconCheck />
                  Marcar como completada
                </Button>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <IconSparkles className="size-3.5" />
                  La lección se marca completada al llegar al final de la
                  lectura.
                </p>
              </div>
            )}
          </>
        ) : (
          <QuizView
            lessonId={lesson.id}
            questions={lesson.questions}
            lastAttempt={lesson.lastAttempt}
            onSubmitResult={(result) => {
              if (result.courseJustCompleted) setShowCompleted(true)
            }}
          />
        )}

        {/* Navegación anterior/siguiente (títulos de la lección vecina) */}
        <div className="mt-12 flex items-stretch justify-between gap-3 border-t border-border pt-6">
          {lesson.prevLessonId ? (
            <Link
              to="/student/courses/$courseSlug/lesson/$lessonId"
              params={{
                courseSlug: lesson.course.slug,
                lessonId: lesson.prevLessonId,
              }}
              className="group flex min-w-0 max-w-[48%] flex-col gap-1 rounded-2xl border border-border bg-card px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
            >
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <IconArrowLeft className="size-3.5" />
                Anterior
              </span>
              <span className="truncate text-sm font-medium group-hover:text-primary">
                {lesson.prevLessonTitle ?? 'Lección anterior'}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {lesson.nextLessonId ? (
            <Link
              to="/student/courses/$courseSlug/lesson/$lessonId"
              params={{
                courseSlug: lesson.course.slug,
                lessonId: lesson.nextLessonId,
              }}
              className="group flex min-w-0 max-w-[48%] flex-col items-end gap-1 rounded-2xl border border-border bg-card px-4 py-3 text-right transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
            >
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                Siguiente
                <IconArrowRight className="size-3.5" />
              </span>
              <span className="truncate text-sm font-medium group-hover:text-primary">
                {lesson.nextLessonTitle ?? 'Lección siguiente'}
              </span>
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>

      {/* Navegación fija inferior (solo móvil) */}
      <nav
        aria-label="Navegación de lecciones"
        className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-2 border-t border-border bg-background/95 px-4 py-2.5 backdrop-blur md:hidden"
      >
        {lesson.prevLessonId ? (
          <Link
            to="/student/courses/$courseSlug/lesson/$lessonId"
            params={{
              courseSlug: lesson.course.slug,
              lessonId: lesson.prevLessonId,
            }}
            aria-label="Lección anterior"
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
          >
            <IconArrowLeft className="size-4" />
            Anterior
          </Link>
        ) : (
          <span />
        )}
        {lesson.nextLessonId ? (
          <Link
            to="/student/courses/$courseSlug/lesson/$lessonId"
            params={{
              courseSlug: lesson.course.slug,
              lessonId: lesson.nextLessonId,
            }}
            aria-label="Lección siguiente"
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Siguiente
            <IconArrowRight className="size-4" />
          </Link>
        ) : (
          <span />
        )}
      </nav>

      <CourseCompletedModal
        open={showCompleted}
        courseId={lesson.course.id}
        courseTitle={lesson.course.title}
        onClose={() => setShowCompleted(false)}
      />
    </div>
  )
}
