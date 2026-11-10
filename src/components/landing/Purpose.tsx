import { Link } from '@tanstack/react-router'
import { IconArrowRight } from '@tabler/icons-react'

export const purposeContent = {
  eyebrow: 'Nuestro propósito',
  title: 'Enseñar los derechos humanos e inspirar defensores de la paz',
  paragraphs: [
    'Enseñamos a los jóvenes sobre los derechos humanos de la Declaración Universal e inspiramos a convertirse en valiosos defensores de la tolerancia y la paz.',
  ],
  link: { label: 'Conoce nuestro propósito', href: '/purpose' },
  image: {
    src: 'https://placehold.co/800x1000',
    alt: 'Jóvenes participando en un taller de derechos humanos',
  },
} as const

export default function Purpose() {
  return (
    <section
      aria-labelledby="purpose-title"
      id="proposito"
      className="border-y bg-muted"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <img
              src={purposeContent.image.src}
              alt={purposeContent.image.alt}
              loading="lazy"
              className="aspect-[4/5] w-full rounded-2xl object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
              {purposeContent.eyebrow}
            </p>
            <h2
              id="purpose-title"
              className="mt-3 text-3xl font-bold tracking-tight uppercase sm:text-4xl"
            >
              {purposeContent.title}
            </h2>
            {purposeContent.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="mt-5 text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
            <Link
              to={purposeContent.link.href}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
            >
              {purposeContent.link.label}
              <IconArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
