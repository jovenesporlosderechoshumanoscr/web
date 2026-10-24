import { Link, createFileRoute } from '@tanstack/react-router'
import Header from '@/components/landing/Header'
import Footer from '@/components/landing/Footer'
import { PostRenderer } from '@/components/blog/PostRenderer'
import { usePublicPostBySlug } from '@/functions/blog-client'

export const Route = createFileRoute('/blog/$slug')({
  component: BlogPostPage,
})

function BlogPostPage() {
  const { slug } = Route.useParams()
  const query = usePublicPostBySlug(slug)

  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6">
        {query.isPending && <p className="text-sm">Cargando…</p>}
        {query.isError && (
          <p className="text-sm text-destructive">
            Error al cargar la publicación.
          </p>
        )}
        {query.isSuccess && !query.data && (
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Publicación no encontrada</h1>
            <Link to="/blog" className="text-sm underline">
              Volver al blog
            </Link>
          </div>
        )}
        {query.isSuccess && query.data && (
          <article className="flex w-full min-w-0 flex-col gap-6">
            <header className="flex flex-col gap-3">
              <h1 className="text-3xl font-bold tracking-tight break-words">
                {query.data.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {query.data.publishedAt
                  ? new Date(query.data.publishedAt).toLocaleDateString()
                  : ''}
              </p>
              {query.data.coverImage && (
                <img
                  src={query.data.coverImage}
                  alt={query.data.title}
                  className="w-full max-h-72 rounded-lg border object-cover"
                />
              )}
            </header>
            <PostRenderer blocks={query.data.blocks} />
          </article>
        )}
      </main>
      <Footer />
    </div>
  )
}
