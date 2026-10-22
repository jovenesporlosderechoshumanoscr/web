import { useEffect, useState } from 'react'
import { IconUpload } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUploadImage } from '@/functions/blog-client'
import { IMAGE_ACCEPT, slugify } from '@/server/validation/blog'
import { COURSE_STATUSES } from '@/server/validation/course'
import type { CourseStatus } from '@/server/validation/course'

const STATUS_LABELS: Record<CourseStatus, string> = {
  draft: 'Borrador',
  published: 'Publicado',
}

export type CourseFormValues = {
  title: string
  status: CourseStatus
  description: string
  coverImage: string
}

type CourseFormProps = {
  mode: 'create' | 'edit'
  initialValues?: Partial<{
    title: string | null
    status: string | null
    description: string | null
    coverImage: string | null
  }>
  isSubmitting?: boolean
  serverError?: string | null
  onSubmit: (values: {
    title: string
    slug: string
    status: CourseStatus
    description: string | null
    coverImage: string | null
  }) => void
  onCancel?: () => void
}

export function CourseForm({
  mode,
  initialValues,
  isSubmitting,
  serverError,
  onSubmit,
  onCancel,
}: CourseFormProps) {
  const [values, setValues] = useState<CourseFormValues>({
    title: '',
    status: 'draft',
    description: '',
    coverImage: '',
  })
  const [error, setError] = useState<string | null>(null)
  const uploadImage = useUploadImage()

  useEffect(() => {
    if (initialValues) {
      setValues({
        title: initialValues.title ?? '',
        status: (initialValues.status ?? 'draft') as CourseStatus,
        description: initialValues.description ?? '',
        coverImage: initialValues.coverImage ?? '',
      })
    }
    // Re-sincronizar cuando cambia el curso cargado.
  }, [initialValues?.title, initialValues?.status])

  function pickAndUploadCover() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = IMAGE_ACCEPT
    input.onchange = () => {
      const file = input.files?.[0]
      if (file) {
        uploadImage.mutate(file, {
          onSuccess: (result) =>
            setValues((prev) => ({ ...prev, coverImage: result.url })),
          onError: () =>
            alert(uploadImage.error?.message ?? 'Error al subir imagen'),
        })
      }
    }
    input.click()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!values.title.trim()) {
      setError('El título es requerido')
      return
    }
    onSubmit({
      title: values.title.trim(),
      slug: slugify(values.title),
      status: values.status,
      description: values.description.trim() || null,
      coverImage: values.coverImage.trim() || null,
    })
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? 'Crear curso' : 'Editar curso'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={values.title}
              onChange={(e) =>
                setValues((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="Título del curso"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Descripción</Label>
            <textarea
              id="description"
              value={values.description}
              onChange={(e) =>
                setValues((p) => ({ ...p, description: e.target.value }))
              }
              rows={3}
              className="w-full rounded-2xl border border-transparent bg-input/50 px-2.5 py-2 text-sm outline-none focus-visible:border-ring"
              placeholder="De qué trata el curso"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Portada</Label>
            {values.coverImage ? (
              <div className="flex items-center gap-3">
                <img
                  src={values.coverImage}
                  alt="Portada del curso"
                  className="h-20 w-32 rounded-lg border object-cover"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setValues((p) => ({ ...p, coverImage: '' }))}
                >
                  Quitar
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={pickAndUploadCover}
                disabled={uploadImage.isPending}
              >
                <IconUpload />
                {uploadImage.isPending ? 'Subiendo…' : 'Subir imagen'}
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="status">Estado</Label>
            <select
              id="status"
              value={values.status}
              onChange={(e) =>
                setValues((p) => ({
                  ...p,
                  status: e.target.value as CourseStatus,
                }))
              }
              className="h-8 rounded-2xl border border-transparent bg-input/50 px-2.5 text-sm outline-none focus-visible:border-ring"
            >
              {COURSE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>

          {(error || serverError) && (
            <p className="text-sm text-destructive">{error ?? serverError}</p>
          )}

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? 'Guardando…'
                : mode === 'create'
                  ? 'Crear'
                  : 'Guardar cambios'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
