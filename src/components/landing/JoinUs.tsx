import { Link } from '@tanstack/react-router'
import { IconArrowRight } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'

export const joinUsContent = {
  eyebrow: 'Súmate a nuestra misión',
  title: 'Los derechos humanos comienzan contigo',
  paragraphs: [
    'Todos podemos contribuir a construir una sociedad donde la dignidad humana, el respeto y la paz sean una realidad cotidiana.',
  ],
  cta: { label: 'Participa con nosotros', href: '/contact' },
} as const

export default function JoinUs() {
  return (
    <section aria-labelledby="join-us-title" className="border-y bg-muted">
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          {joinUsContent.eyebrow}
        </p>
        <h2
          id="join-us-title"
          className="mt-3 text-3xl font-bold tracking-tight uppercase sm:text-4xl"
        >
          {joinUsContent.title}
        </h2>
        {joinUsContent.paragraphs.map((paragraph) => (
          <p
            key={paragraph.slice(0, 24)}
            className="mx-auto mt-5 max-w-2xl text-muted-foreground"
          >
            {paragraph}
          </p>
        ))}
        <Button
          size="lg"
          className="mt-8"
          nativeButton={false}
          render={
            <Link to={joinUsContent.cta.href}>
              {joinUsContent.cta.label}
              <IconArrowRight aria-hidden="true" />
            </Link>
          }
        />
      </div>
    </section>
  )
}
