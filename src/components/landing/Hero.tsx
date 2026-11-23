import { Link } from '@tanstack/react-router'
import { IconArrowRight } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'

export const heroContent = {
  titleLead: 'Jovenes por los',
  titleBoldA: 'Derechos Humanos',
  titleEnd: 'Costa Rica',
  subtitle:
    '15 años educando para hacer de los derechos humanos una realidad en Costa Rica.',
  description:
    'Trabajamos para que cada persona conozca, comprenda y ejerza sus derechos humanos. A través de la educación, inspiramos a niños, jóvenes y adultos a construir una sociedad donde la dignidad, el respeto, la libertad y la paz sean parte de nuestra vida cotidiana.',
  primaryCta: { label: 'Qué hacemos', href: '/what-we-do' },
  background: {
    desktop: '/landingheroimg.webp',
    mobile: '/heroimg.webp',
  },
} as const

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden text-white"
    >
      {/* Fondo a pantalla completa con difuminados que disimulan la compresión */}
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <picture>
          <source media="(max-width: 767px)" srcSet={heroContent.background.mobile} />
          <img
            src={heroContent.background.desktop}
            alt=""
            loading="eager"
            fetchPriority="high"
            className="size-full object-cover object-[center_65%]"
          />
        </picture>


        <div className="absolute inset-0 bg-gradient-to-r from-primary/45 via-primary/20 to-primary/10" />
        {/* Velado adicional en móvil, donde el texto ocupa todo el ancho */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/20 to-transparent md:hidden" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
        <div className="max-w-2xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
          <h1
            id="hero-title"
            className="text-4xl leading-tight font-light tracking-tight uppercase sm:text-5xl lg:text-6xl"
          >
            {heroContent.titleLead}{' '}
            <strong className="font-bold">{heroContent.titleBoldA}</strong>,{' '}
            {heroContent.titleEnd}
          </h1>
          <p className="mt-6 max-w-xl text-base font-medium text-white sm:text-lg">
            {heroContent.subtitle}
          </p>
          <p className="mt-4 max-w-xl text-base text-white sm:text-lg">
            {heroContent.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              nativeButton={false}
              render={
                <Link to={heroContent.primaryCta.href}>
                  {heroContent.primaryCta.label}
                  <IconArrowRight aria-hidden="true" />
                </Link>
              }
            />
          </div>
        </div>
      </div>
    </section>
  )
}
