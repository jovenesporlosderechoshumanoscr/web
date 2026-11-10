import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import Header from '@/components/landing/Header'
import Footer from '@/components/landing/Footer'
import { PostRenderer } from '@/components/blog/PostRenderer'
import { blogPublicQueries } from '@/server/queries/blog-server'

export const Route = createFileRoute('/blog/$slug')({
  // SSR: la carga de datos ocurre en el servidor, antes de hidratar el cliente.
  loader: async ({ params }) => {
    const post = await blogPublicQueries.getPublicPostBySlug({
      data: { slug: params.slug },
    })
    if (!post) {
      throw notFound()
    }
    return post
  },
  component: BlogPostPage,
  notFoundComponent: NotFoundPost,
})

function NotFoundPost() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Publicación no encontrada</h1>
          <Link to="/blog" className="text-sm underline">
            Volver al blog
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function BlogPostPage() {
  const post = Route.useLoaderData()

  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6">
        <article className="flex w-full min-w-0 flex-col gap-6">
          <header className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold tracking-tight break-words">
              {post.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString()
                : ''}
            </p>
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full max-h-72 rounded-lg border object-cover"
              />
            )}
          </header>
          <PostRenderer blocks={post.blocks} />
        </article>
      </main>
      <Footer />
    </div>
  )
}
