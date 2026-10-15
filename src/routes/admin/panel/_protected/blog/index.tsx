import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDeletePost, usePosts, useUpdatePost } from '@/functions/blog-client'
import { POST_STATUSES } from '@/server/validation/blog'
import type { PostStatus } from '@/server/validation/blog'

export const Route = createFileRoute('/admin/panel/_protected/blog/')({
  component: RouteComponent,
})

type StatusFilter = 'all' | 'draft' | 'published'

const STATUS_LABELS: Record<PostStatus, string> = {
  draft: 'Borrador',
  published: 'Publicado',
}

function RouteComponent() {
  const [titleInput, setTitleInput] = useState('')
  const [statusInput, setStatusInput] = useState<StatusFilter>('all')
  const [page, setPage] = useState(1)
  const limit = 10

  const [applied, setApplied] = useState<{
    title?: string
    status?: PostStatus
  }>({})

  const query = usePosts({
    title: applied.title,
    status: applied.status,
    page,
    limit,
  })
  const deletePost = useDeletePost()
  const updatePost = useUpdatePost()

  function handleToggleStatus(id: string, status: PostStatus) {
    updatePost.mutate({
      id,
      status: status === 'published' ? 'draft' : 'published',
    })
  }

  function handleSearch() {
    setPage(1)
    setApplied({
      title: titleInput.trim() ? titleInput.trim() : undefined,
      status: statusInput === 'all' ? undefined : statusInput,
    })
  }

  function handleClear() {
    setTitleInput('')
    setStatusInput('all')
    setPage(1)
    setApplied({})
  }

  function handleDelete(id: string, title: string) {
    if (!window.confirm(`¿Eliminar la página "${title}"?`)) return
    deletePost.mutate({ id })
  }

  const items = query.data?.items ?? []
  const total = query.data?.total ?? 0
  const totalPages = query.data?.totalPages ?? 1

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Páginas</h1>
        <Link to="/admin/panel/blog/create" className={buttonVariants()}>
          Crear página
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3 md:items-end">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="search-title">Título</Label>
              <Input
                id="search-title"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="Buscar por título"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="search-status">Estado</Label>
              <select
                id="search-status"
                value={statusInput}
                onChange={(e) => setStatusInput(e.target.value as StatusFilter)}
                className="h-8 rounded-2xl border border-transparent bg-input/50 px-2.5 text-sm outline-none focus-visible:border-ring"
              >
                <option value="all">Todos</option>
                {POST_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button type="button" onClick={handleSearch}>
                Buscar
              </Button>
              <Button type="button" variant="outline" onClick={handleClear}>
                Limpiar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {query.isPending && <p className="py-6 text-sm">Cargando…</p>}
          {query.isError && (
            <p className="py-6 text-sm text-destructive">
              Error al cargar páginas.
            </p>
          )}
          {query.isSuccess && items.length === 0 && (
            <p className="py-6 text-sm text-muted-foreground">
              Sin resultados.
            </p>
          )}
          {deletePost.isError && (
            <p className="py-2 text-sm text-destructive">
              {deletePost.error.message}
            </p>
          )}
          {updatePost.isError && (
            <p className="py-2 text-sm text-destructive">
              {updatePost.error.message}
            </p>
          )}
          {query.isSuccess && items.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="py-2 pr-4 font-medium">Título</th>
                    <th className="py-2 pr-4 font-medium">Estado</th>
                    <th className="py-2 pr-4 font-medium">Actualizado</th>
                    <th className="py-2 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((p) => (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="py-2 pr-4">{p.title}</td>
                      <td className="py-2 pr-4">
                        <div className="flex items-center gap-1">
                          <span>
                            {p.status === 'published'
                              ? 'Publicado'
                              : 'Borrador'}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={updatePost.isPending}
                            onClick={() => handleToggleStatus(p.id, p.status)}
                          >
                            {p.status === 'published'
                              ? 'Despublicar'
                              : 'Publicar'}
                          </Button>
                        </div>
                      </td>
                      <td className="py-2 pr-4">
                        {new Date(p.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="flex gap-2 py-2">
                        <Link
                          to="/admin/panel/blog/edit/$postId"
                          params={{ postId: p.id }}
                          className={buttonVariants({
                            size: 'sm',
                            variant: 'outline',
                          })}
                        >
                          Editar
                        </Link>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={deletePost.isPending}
                          onClick={() => handleDelete(p.id, p.title)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-muted-foreground">
              Página {page} de {totalPages} · {total} páginas
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1 || query.isPending}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Anterior
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= totalPages || query.isPending}
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
