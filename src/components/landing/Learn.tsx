import { Link } from '@tanstack/react-router'
import { IconArrowRight } from '@tabler/icons-react'

export const learnContent = {
  eyebrow: 'Actividad interactiva',
  title: 'Conoce tus derechos humanos',
  paragraphs: [
    'Una introducción a los 30 artículos de la Declaración Universal de Derechos Humanos con un módulo interactivo: aprende artículo por artículo, sin registro y a tu propio ritmo.',
  ],
  cta: {
    label: 'Comienza a aprender',
    href: '/aprende',
  },
} as const

export default function Learn() {
  return (
    <section aria-labelledby="learn-title" id="aprende" className="border-b">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
            {learnContent.eyebrow}
          </p>
          <h2
            id="learn-title"
            className="mt-3 text-3xl font-bold tracking-tight uppercase sm:text-4xl"
          >
            {learnContent.title}
          </h2>
          {learnContent.paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 24)}
              className="mt-5 text-muted-foreground"
            >
              {paragraph}
            </p>
          ))}
          <Link
            to={learnContent.cta.href}
            className="mt-6 inline-flex h-11 items-center justify-center gap-1.5 rounded-2xl bg-primary px-6 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
          >
            {learnContent.cta.label}
            <IconArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
