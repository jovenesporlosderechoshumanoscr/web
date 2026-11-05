import { createFileRoute } from '@tanstack/react-router'
import Footer from '@/components/landing/Footer'
import Header from '@/components/landing/Header'
import Quiz from '@/components/Quiz'

export const Route = createFileRoute('/aprende')({
  head: () => ({
    meta: [{ title: 'Aprende tus derechos — JPDH' }],
  }),
  component: AprendePage,
})

function AprendePage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main>
        <section
          aria-labelledby="aprende-page-title"
          className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24"
        >
          <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
            Aprende
          </p>
          <h1
            id="aprende-page-title"
            className="mt-3 text-4xl leading-tight font-light tracking-tight uppercase sm:text-5xl"
          >
            Aprende tus <strong className="font-bold">derechos</strong>
          </h1>
          <p className="mt-4 text-muted-foreground">
            Un quiz sencillo para conocer la Declaración Universal de Derechos
            Humanos, artículo por artículo. No necesitas registrarte ni dar
            ningún dato: empieza de inmediato.
          </p>
          <div className="mt-10">
            <Quiz />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
