import { Link } from '@tanstack/react-router'
import { IconArrowRight } from '@tabler/icons-react'
import { usePublicPosts } from '@/functions/blog-client'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'

export const newsContent = {
  eyebrow: 'Noticias y actividades',
  title: 'Nuestras últimas actividades',
  paragraphs: [
    'Nuestras últimas actividades educativas, convenios, visitas a centros de enseñanza, proyectos comunitarios y participación en encuentros nacionales e internacionales.',
  ],
  link: { label: 'Ver todas las noticias', href: '/blog' },
} as const

export default function NewsSummary() {
  const query = usePublicPosts({ page: 1, limit: 3 })
  const items = query.data?.items ?? []

  return (
    <section
      aria-labelledby="news-title"
      id="noticias"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24"
    >
      <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
        {newsContent.eyebrow}
      </p>
      <h2
        id="news-title"
        className="mt-3 text-3xl font-bold tracking-tight uppercase sm:text-4xl"
      >
        {newsContent.title}
      </h2>
      {newsContent.paragraphs.map((paragraph) => (
        <p
          key={paragraph.slice(0, 24)}
          className="mt-5 max-w-2xl text-muted-foreground"
        >
          {paragraph}
        </p>
      ))}
      <Link
        to={newsContent.link.href}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
      >
        {newsContent.link.label}
        <IconArrowRight aria-hidden="true" className="size-4" />
      </Link>

      {query.isPending && (
        <p className="mt-8 text-sm text-muted-foreground">Cargando…</p>
      )}
      {query.isError && (
        <p className="mt-8 text-sm text-destructive">
          Error al cargar las noticias.
        </p>
      )}
      {query.isSuccess && items.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">
          Pronto compartiremos aquí nuestras noticias y actividades.
        </p>
      )}
      {items.length > 0 && (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((post) => (
            <Card key={post.id} className="flex flex-col">
              {post.coverImage && (
                <img
                  src={post.coverImage}
                  alt={post.title}
                  loading="lazy"
                  className="aspect-[16/9] w-full rounded-t-xl border-b object-cover"
                />
              )}
              <CardHeader>
                <CardTitle>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    className="hover:underline"
                  >
                    {post.title}
                  </Link>
                </CardTitle>
                {post.publishedAt && (
                  <p className="text-xs text-muted-foreground">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </p>
                )}
                <CardDescription>{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1" />
              <CardFooter>
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className={buttonVariants({ variant: 'outline', size: 'sm' })}
                >
                  Leer más
                  <IconArrowRight aria-hidden="true" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
