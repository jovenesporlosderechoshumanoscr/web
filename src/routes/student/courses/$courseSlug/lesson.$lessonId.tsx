import { useEffect, useRef, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { IconArrowLeft, IconArrowRight, IconCheck } from '@tabler/icons-react'
import { CourseCompletedModal } from '@/components/courses/CourseCompletedModal'
import { QuizView } from '@/components/courses/QuizView'
import { PostRenderer } from '@/components/blog/PostRenderer'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useSaveProgress, useStudentLesson } from '@/functions/course-client'

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
    return <Skeleton className="mx-4 my-4 h-96" />
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
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col gap-1">
        <p className="text-xs text-muted-foreground">
          <Link
            to="/student/courses/$courseSlug"
            params={{ courseSlug: lesson.course.slug }}
            className="hover:underline"
          >
            {lesson.course.title}
          </Link>{' '}
          · {lesson.module.title}
        </p>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">{lesson.title}</h1>
          {completed && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-400">
              <IconCheck className="size-3.5" />
              Completada
            </span>
          )}
        </div>
      </div>

      {lesson.type === 'reading' ? (
        <>
          <PostRenderer blocks={lesson.content ?? []} />
          {/* Centinela del final de la lectura */}
          <div ref={endRef} className="h-1" />
          {!completed && (
            <div className="flex w-full max-w-3xl flex-col items-center gap-2">
              <Button type="button" variant="outline" onClick={markCompleted}>
                <IconCheck />
                Marcar como completada
              </Button>
              <p className="text-xs text-muted-foreground">
                La lección se marca completada al llegar al final de la lectura.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center gap-6">
          <QuizView
            lessonId={lesson.id}
            questions={lesson.questions}
            lastAttempt={lesson.lastAttempt}
            onSubmitResult={(result) => {
              if (result.courseJustCompleted) setShowCompleted(true)
            }}
          />
        </div>
      )}

      {/* Navegación anterior/siguiente */}
      <div className="flex w-full max-w-3xl items-center justify-between border-t pt-4">
        {lesson.prevLessonId ? (
          <Button
            variant="ghost"
            render={
              <Link
                to="/student/courses/$courseSlug/lesson/$lessonId"
                params={{
                  courseSlug: lesson.course.slug,
                  lessonId: lesson.prevLessonId,
                }}
              />
            }
          >
            <IconArrowLeft />
            Anterior
          </Button>
        ) : (
          <span />
        )}
        {lesson.nextLessonId ? (
          <Button
            variant="ghost"
            render={
              <Link
                to="/student/courses/$courseSlug/lesson/$lessonId"
                params={{
                  courseSlug: lesson.course.slug,
                  lessonId: lesson.nextLessonId,
                }}
              />
            }
          >
            Siguiente
            <IconArrowRight />
          </Button>
        ) : (
          <span />
        )}
      </div>

      <CourseCompletedModal
        open={showCompleted}
        courseTitle={lesson.course.title}
        onClose={() => setShowCompleted(false)}
      />
    </div>
  )
}
