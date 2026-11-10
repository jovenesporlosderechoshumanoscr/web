import { Link } from '@tanstack/react-router'
import { IconDownload, IconTrophy } from '@tabler/icons-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { useGenerateCertificate } from '@/functions/course-client'
import { useState } from 'react'

/**
 * Popup de celebración: se muestra cuando el estudiante completa la ÚLTIMA
 * lección del curso (el servidor devuelve `courseJustCompleted`). Incluye
 * la descarga del certificado (antes vivía en el listado de cursos).
 */
export function CourseCompletedModal({
  open,
  courseId,
  courseTitle,
  onClose,
}: {
  open: boolean
  courseId: string
  courseTitle: string
  onClose: () => void
}) {
  const generateCertificate = useGenerateCertificate()
  const [downloadError, setDownloadError] = useState(false)

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
        className="flex w-full max-w-sm flex-col items-center gap-4 rounded-3xl border bg-card p-8 text-center shadow-lg animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="flex size-16 items-center justify-center rounded-full bg-warning/15 text-4xl">
          <IconTrophy className="size-8 text-warning" />
        </span>
        <h2
          id="course-completed-title"
          className="font-heading text-xl font-bold"
        >
          ¡Curso completado! 🎉
        </h2>
        <p className="text-sm text-muted-foreground">
          Has terminado todas las lecciones de{' '}
          <span className="font-medium text-foreground">{courseTitle}</span>.
          ¡Excelente trabajo!
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button type="button" onClick={onClose} variant="outline">
            Seguir revisando
          </Button>
          <Button
            type="button"
            onClick={() => {
              setDownloadError(false)
              generateCertificate.mutate(
                { courseId },
                { onError: () => setDownloadError(true) },
              )
            }}
            disabled={generateCertificate.isPending}
          >
            <IconDownload />
            {generateCertificate.isPending
              ? 'Generando…'
              : 'Descargar certificado'}
          </Button>
        </div>
        {downloadError && (
          <p className="text-sm text-destructive">
            No se pudo generar el certificado. Inténtalo de nuevo.
          </p>
        )}
        <Link
          to="/student"
          className={buttonVariants({ variant: 'link' })}
          onClick={onClose}
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  )
}
