import { useEffect, useState } from 'react'
import {
  IconAdjustmentsHorizontal,
  IconUpload,
  IconX,
} from '@tabler/icons-react'
import { BlockCanvas } from '@/components/blog/BlockCanvas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from 'cn'
import { useUploadImage } from '@/functions/blog-client'
import { IMAGE_ACCEPT, slugify } from '@/server/validation/blog'
import type { PostBlock, PostStatus } from '@/server/validation/blog'

const STATUS_LABELS: Record<PostStatus, string> = {
  draft: 'Borrador',
  published: 'Publicado',
}

export type PostEditorValues = {
  title: string
  slug: string
  status: PostStatus
  blocks: PostBlock[]
  excerpt: string
  coverImage: string
}

type PostEditorProps = {
  mode: 'create' | 'edit'
  initialValues?: Partial<{
    title: string | null
    slug: string
    status: string | null
    blocks: PostBlock[] | null
    excerpt: string | null
    coverImage: string | null
  }>
  isSubmitting?: boolean
  serverError?: string | null
  onSubmit: (values: {
    title: string
    slug: string
    status: PostStatus
    blocks: PostBlock[]
    excerpt: string | null
    coverImage: string | null
  }) => void
  onCancel?: () => void
}

/**
 * Editor visual de páginas: preview editable de bloques en el centro,
 * persiana izquierda con los metadatos (título, descripción y portada)
 * y barra de acciones sticky abajo.
 */
export function PostEditor({
  mode,
  initialValues,
  isSubmitting,
  serverError,
  onSubmit,
  onCancel,
}: PostEditorProps) {
  const [values, setValues] = useState<PostEditorValues>({
    title: '',
    slug: '',
    status: 'draft',
    blocks: [],
    excerpt: '',
    coverImage: '',
  })
  const [initialSlug, setInitialSlug] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const uploadImage = useUploadImage()

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

  useEffect(() => {
    if (initialValues) {
      setValues({
        title: initialValues.title ?? '',
        slug: initialValues.slug ?? '',
        status: (initialValues.status ?? 'draft') as PostStatus,
        blocks: initialValues.blocks ?? [],
        excerpt: initialValues.excerpt ?? '',
        coverImage: initialValues.coverImage ?? '',
      })
      setInitialSlug(initialValues.slug ?? '')
    }
    // Solo re-sincronizar cuando cambia la página cargada (por su slug).
  }, [initialValues?.slug])

  const slug = mode === 'create' ? slugify(values.title) : initialSlug

  function validate(): string | null {
    if (!values.title.trim()) return 'El título es requerido'
    if (!slug.trim()) return 'El slug es requerido'
    if (values.blocks.length === 0)
      return 'La página debe tener al menos un bloque'
    for (const [i, block] of values.blocks.entries()) {
      if (block.type === 'heading' && !block.text.trim())
        return `Bloque ${i + 1}: el título es requerido`
      if (block.type === 'paragraph' && !block.text.trim())
        return `Bloque ${i + 1}: el párrafo es requerido`
      if (block.type === 'image' && !block.url.trim())
        return `Bloque ${i + 1}: la imagen es requerida`
      if (block.type === 'video' && !block.url.trim())
        return `Bloque ${i + 1}: la URL del video es requerida`
    }
    return null
  }

  function submit() {
    setError(null)
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    onSubmit({
      title: values.title.trim(),
      slug: slug.trim(),
      status: values.status,
      blocks: values.blocks,
      excerpt: values.excerpt.trim() ? values.excerpt.trim() : null,
      coverImage: values.coverImage.trim() ? values.coverImage.trim() : null,
    })
  }

  return (
    <div className="flex h-svh min-w-0 flex-1 flex-col overflow-hidden">
      {/* Cabecera */}
      <header className="flex shrink-0 items-center gap-2 border-b bg-background px-4 py-2">
        <h1 className="truncate text-base font-semibold">
          {mode === 'create' ? 'Crear página' : 'Editar página'}
        </h1>
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-xs font-medium',
            values.status === 'published'
              ? 'bg-green-500/15 text-green-600 dark:text-green-400'
              : 'bg-muted text-muted-foreground',
          )}
        >
          {STATUS_LABELS[values.status]}
        </span>
        <div className="ml-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSheetOpen(true)}
          >
            <IconAdjustmentsHorizontal />
            Detalles
          </Button>
        </div>
      </header>

      {/* Preview editable (ocupa todo el alto y ancho disponibles) */}
      <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <article className="mx-auto flex w-full max-w-3xl flex-col gap-6">
          <header className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold tracking-tight break-words empty:before:content-['Título_de_la_página'] empty:before:text-muted-foreground/40">
              {values.title}
            </h1>
            {values.coverImage && (
              <img
                src={values.coverImage}
                alt={values.title}
                className="w-full max-h-72 rounded-lg border object-cover"
              />
            )}
          </header>
          <BlockCanvas
            blocks={values.blocks}
            onChange={(blocks) => setValues((prev) => ({ ...prev, blocks }))}
          />
        </article>
      </main>

      {/* Barra de acciones fija abajo */}
      <footer className="shrink-0 border-t bg-background px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="flex w-full flex-col gap-2">
          {(error || serverError) && (
            <p className="text-sm text-destructive">{error ?? serverError}</p>
          )}
          <div className="flex items-center justify-end gap-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="button" disabled={isSubmitting} onClick={submit}>
              {isSubmitting
                ? 'Guardando…'
                : mode === 'create'
                  ? 'Crear'
                  : 'Guardar cambios'}
            </Button>
          </div>
        </div>
      </footer>

      {/* Persiana de metadatos */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="left" className="w-full gap-0 sm:max-w-sm">
          <SheetHeader className="border-b">
            <SheetTitle>Detalles de la página</SheetTitle>
            <SheetDescription>
              Título, descripción e imagen de portada.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 overflow-y-auto p-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="post-title">Título</Label>
              <Input
                id="post-title"
                value={values.title}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Título de la página"
              />
              <p className="text-xs text-muted-foreground">
                URL: /blog/{slug || '…'}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="post-excerpt">Descripción (opcional)</Label>
              <textarea
                id="post-excerpt"
                value={values.excerpt}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                placeholder="Descripción breve"
                rows={3}
                className="rounded-2xl border border-transparent bg-input/50 px-2.5 py-2 text-sm outline-none focus-visible:border-ring"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Imagen de portada (opcional)</Label>
              {values.coverImage ? (
                <div className="flex flex-col gap-2">
                  <img
                    src={values.coverImage}
                    alt="Portada"
                    className="max-h-40 w-auto rounded-lg border"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={uploadImage.isPending}
                      onClick={pickAndUploadCover}
                    >
                      <IconUpload />
                      {uploadImage.isPending ? 'Subiendo…' : 'Reemplazar'}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={uploadImage.isPending}
                      onClick={() =>
                        setValues((prev) => ({ ...prev, coverImage: '' }))
                      }
                    >
                      <IconX />
                      Quitar
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="flex aspect-video w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/40 text-sm text-muted-foreground transition-colors hover:border-blue-500/60 hover:text-blue-500 disabled:opacity-50"
                  disabled={uploadImage.isPending}
                  onClick={pickAndUploadCover}
                >
                  <IconUpload className="size-4" />
                  {uploadImage.isPending ? 'Subiendo…' : 'Subir imagen'}
                </button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
