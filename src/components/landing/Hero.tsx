import { IconArrowRight } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'

export const heroContent = {
  titleLead: 'Centrando la',
  titleBoldA: 'experiencia local',
  titleMid: 'para crear',
  titleBoldB: 'justicia sostenible',
  subtitle:
    'Acompañamos a comunidades y organizaciones en la defensa de sus derechos con formación, acción colectiva y memoria.',
  primaryCta: { label: 'Conoce nuestro trabajo', href: '#trabajo' },
  secondaryCta: { label: 'Centro de acción', href: '#accion' },
  image: {
    src: 'https://placehold.co/800x900',
    alt: 'Retrato de una lideresa comunitaria sonriendo',
  },
  stampText: 'JUSTICIA • COMUNIDAD • DIGNIDAD • ',
} as const

function Stamp() {
  return (
    <div
      aria-hidden="true"
      className="absolute -bottom-6 left-4 z-20 hidden size-28 items-center justify-center rounded-full bg-primary text-primary-foreground sm:flex lg:size-32"
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full">
        <defs>
          <path
            id="stamp-circle"
            d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
          />
        </defs>
        <text className="fill-current text-[10px] font-semibold tracking-widest uppercase">
          <textPath href="#stamp-circle">{heroContent.stampText}</textPath>
        </text>
      </svg>
      <span className="text-2xl font-bold" aria-hidden="true">
        ✦
      </span>
    </div>
  )
}

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="flex min-h-[calc(100svh-4rem)] items-center overflow-hidden"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:py-0">
        <div className="relative z-10">
          <h1
            id="hero-title"
            className="text-4xl leading-tight font-light tracking-tight uppercase sm:text-5xl lg:text-6xl"
          >
            {heroContent.titleLead}{' '}
            <strong className="font-bold">{heroContent.titleBoldA}</strong>{' '}
            {heroContent.titleMid}{' '}
            <strong className="font-bold">{heroContent.titleBoldB}</strong>
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            {heroContent.subtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              render={
                <a href={heroContent.primaryCta.href}>
                  {heroContent.primaryCta.label}
                  <IconArrowRight aria-hidden="true" />
                </a>
              }
            />
            <Button
              size="lg"
              variant="outline"
              render={
                <a href={heroContent.secondaryCta.href}>
                  {heroContent.secondaryCta.label}
                </a>
              }
            />
          </div>
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-md lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute inset-y-8 -left-4 w-3/4 bg-muted"
          />
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 h-2/3 w-2/3 bg-primary [clip-path:polygon(100%_0,0_0,100%_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-8 h-1/2 w-2/3 bg-secondary [clip-path:polygon(0_100%,0_0,100%_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute top-1/3 -right-2 h-24 w-24 rounded-full bg-accent"
          />
          <img
            src={heroContent.image.src}
            alt={heroContent.image.alt}
            loading="eager"
            className="absolute inset-x-8 top-8 bottom-12 z-10 w-[calc(100%-4rem)] object-cover"
          />
          <Stamp />
        </div>
      </div>
    </section>
  )
}
