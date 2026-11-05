import { Link } from '@tanstack/react-router'
import { IconArrowRight } from '@tabler/icons-react'

export const aboutContent = {
  eyebrow: 'Quiénes somos',
  title:
    'Una organización sin fines de lucro dedicada a la educación en derechos humanos',
  paragraphs: [
    'Somos parte del movimiento mundial Youth for Human Rights International (YHRI), fundado en 2001 por la Dra. Mary Shuttleworth, con 15 años de trabajo en Costa Rica.',
  ],
  link: { label: 'Conoce quiénes somos', href: '/about' },
  image: {
    src: 'https://placehold.co/800x1000',
    alt: 'Integrantes de Jóvenes por los Derechos Humanos Costa Rica en una actividad educativa',
  },
} as const

export default function About() {
  return (
    <section
      aria-labelledby="about-title"
      id="nosotros"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24"
    >
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14">
        <div>
          <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
            {aboutContent.eyebrow}
          </p>
          <h2
            id="about-title"
            className="mt-3 text-3xl font-bold tracking-tight uppercase sm:text-4xl"
          >
            {aboutContent.title}
          </h2>
          {aboutContent.paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 24)}
              className="mt-5 text-muted-foreground"
            >
              {paragraph}
            </p>
          ))}
          <Link
            to={aboutContent.link.href}
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
          >
            {aboutContent.link.label}
            <IconArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
        <div>
          <img
            src={aboutContent.image.src}
            alt={aboutContent.image.alt}
            loading="lazy"
            className="aspect-[4/5] w-full rounded-2xl object-cover"
          />
        </div>
      </div>
    </section>
  )
}
