import { IconArrowRight } from '@tabler/icons-react'

export const aboutContent = {
  eyebrow: 'Quiénes somos',
  title: 'Una comunidad que defiende la dignidad',
  paragraphs: [
    'Somos una organización dedicada a acompañar procesos comunitarios de justicia social, fortaleciendo liderazgos locales y creando redes de apoyo mutuo en cada territorio donde trabajamos.',
    'Creemos que la transformación sostenible nace de la escucha, la memoria y la acción colectiva. Por eso articulamos formación, incidencia y cuidado comunitario.',
  ],
  link: { label: 'Conoce más', href: '#nosotros' },
  image: {
    src: 'https://placehold.co/800x1000',
    alt: 'Integrantes de la comunidad reunidos en asamblea',
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
            <p key={paragraph.slice(0, 24)} className="mt-5 text-muted-foreground">
              {paragraph}
            </p>
          ))}
          <a
            href={aboutContent.link.href}
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
          >
            {aboutContent.link.label}
            <IconArrowRight aria-hidden="true" className="size-4" />
          </a>
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
