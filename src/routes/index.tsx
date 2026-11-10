import { Link, createFileRoute } from '@tanstack/react-router'
import { IconArrowRight, IconConfetti } from '@tabler/icons-react'
import { buttonVariants } from '@/components/ui/button'
import About from '@/components/landing/About'
import Footer from '@/components/landing/Footer'
import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import JoinUs from '@/components/landing/JoinUs'
import Law from '@/components/landing/Law'
import NewsSummary from '@/components/landing/NewsSummary'
import Newsletter from '@/components/landing/Newsletter'
import Purpose from '@/components/landing/Purpose'
import Stats from '@/components/landing/Stats'
import WhatWeDo from '@/components/landing/WhatWeDo'

export const Route = createFileRoute('/')({ component: LandingPage })

function LandingPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <About />
        <Purpose />
        <WhatWeDo />
        <Law />
        <section
          aria-labelledby="activity-title"
          className="border-y bg-muted"
        >
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
            <div className="mx-auto max-w-2xl rounded-3xl border bg-card p-8 text-center shadow-sm sm:p-12">
              <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/15">
                <IconConfetti className="size-7 text-primary" aria-hidden="true" />
              </span>
              <p className="mt-4 text-sm font-semibold tracking-widest text-muted-foreground uppercase">
                Actividad interactiva
              </p>
              <h2
                id="activity-title"
                className="mt-3 text-3xl font-bold tracking-tight uppercase sm:text-4xl"
              >
                Pon en práctica lo <strong className="font-bold">aprendido</strong>
              </h2>
              <p className="mt-5 text-muted-foreground">
                Un quiz sencillo para conocer la Declaración Universal de
                Derechos Humanos, artículo por artículo: responde, recibe
                retroalimentación inmediata y reflexiona cómo aplicar cada
                derecho en tu vida diaria. No necesitas registrarte ni dar
                ningún dato.
              </p>
              <Link
                to="/actividad"
                className={buttonVariants({ size: 'lg', className: 'mt-8' })}
              >
                Hacer la actividad
                <IconArrowRight data-icon="inline-end" />
              </Link>
            </div>
          </div>
        </section>
        <Stats />
        <NewsSummary />
        <JoinUs />
      </main>
      <Newsletter />
      <Footer />
    </div>
  )
}
