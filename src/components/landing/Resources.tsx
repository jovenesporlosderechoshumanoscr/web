import { IconArrowRight, IconArticle, IconBook } from '@tabler/icons-react'
import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const resourcesContent = {
  title: 'Aprende y actúa',
  intro: 'Formación gratuita y relatos que sostienen nuestra lucha colectiva.',
  cards: [
    {
      title: 'Curso en línea',
      description: 'Formación introductoria en derechos y acción comunitaria.',
      cta: { label: 'Ir al curso', href: '/curso' },
      Icon: IconBook,
    },
    {
      title: 'Blogs',
      description: 'Historias, voces y análisis desde los territorios.',
      cta: { label: 'Leer blogs', href: '/blog' },
      Icon: IconArticle,
    },
  ],
} as const

export default function Resources() {
  return (
    <section
      aria-labelledby="resources-title"
      className="border-y bg-muted"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <h2
          id="resources-title"
          className="text-2xl font-bold tracking-tight uppercase sm:text-3xl"
        >
          {resourcesContent.title}
        </h2>
        <p className="mt-2 max-w-xl text-muted-foreground">
          {resourcesContent.intro}
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {resourcesContent.cards.map(({ title, description, cta, Icon }) => (
            <Card key={title}>
              <CardHeader>
                <span className="flex size-10 items-center justify-center rounded-xl bg-muted">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent />
              <CardFooter>
                <a href={cta.href} className={buttonVariants()}>
                  {cta.label}
                  <IconArrowRight aria-hidden="true" />
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
