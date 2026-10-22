import { Link } from '@tanstack/react-router'
import { IconTrophy } from '@tabler/icons-react'
import { Button, buttonVariants } from '@/components/ui/button'

/**
 * Popup de celebración: se muestra cuando el estudiante completa la ÚLTIMA
 * lección del curso (el servidor devuelve `courseJustCompleted`).
 */
export function CourseCompletedModal({
  open,
  courseTitle,
  onClose,
}: {
  open: boolean
  courseTitle: string
  onClose: () => void
}) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-completed-title"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border bg-card p-8 text-center shadow-lg animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="flex size-16 items-center justify-center rounded-full bg-amber-100 text-4xl dark:bg-amber-400/20">
          <IconTrophy className="size-8 text-amber-500" />
        </span>
        <h2 id="course-completed-title" className="text-xl font-bold">
          ¡Curso completado! 🎉
        </h2>
        <p className="text-sm text-muted-foreground">
          Has terminado todas las lecciones de{' '}
          <span className="font-medium text-foreground">{courseTitle}</span>.
          ¡Excelente trabajo!
        </p>
        <div className="flex gap-2">
          <Button type="button" onClick={onClose} variant="outline">
            Seguir revisando
          </Button>
          <Link
            to="/student/courses"
            className={buttonVariants()}
            onClick={onClose}
          >
            Ir a mis cursos
          </Link>
        </div>
      </div>
    </div>
  )
}
