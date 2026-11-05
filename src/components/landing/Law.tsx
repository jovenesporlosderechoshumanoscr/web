import { Link } from '@tanstack/react-router'
import { IconArrowRight } from '@tabler/icons-react'

export const lawContent = {
  eyebrow: 'Ley N.° 10030',
  title: 'Nuestro compromiso con Costa Rica',
  paragraphs: [
    'Promovimos la aprobación de la Ley N.° 10030, que incorpora el estudio permanente de la Declaración Universal de Derechos Humanos en la educación costarricense y declara el 10 de diciembre como Día Nacional de los Derechos Humanos.',
  ],
  link: {
    label: 'Conoce la Ley N.° 10030 y cómo contribuir a su implementación',
    href: '/ley-10030',
  },
} as const

export default function Law() {
  return (
    <section
      aria-labelledby="law-title"
      id="ley-10030"
      className="border-y bg-muted"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
            {lawContent.eyebrow}
          </p>
          <h2
            id="law-title"
            className="mt-3 text-3xl font-bold tracking-tight uppercase sm:text-4xl"
          >
            {lawContent.title}
          </h2>
          {lawContent.paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 24)}
              className="mt-5 text-muted-foreground"
            >
              {paragraph}
            </p>
          ))}
          <Link
            to={lawContent.link.href}
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
          >
            {lawContent.link.label}
            <IconArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
