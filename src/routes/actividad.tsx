import { createFileRoute } from '@tanstack/react-router'
import Footer from '@/components/landing/Footer'
import Header from '@/components/landing/Header'
import Quiz from '@/components/Quiz'

export const Route = createFileRoute('/actividad')({
  head: () => ({
    meta: [{ title: 'Actividad interactiva — JPDH' }],
  }),
  component: ActividadPage,
})

function ActividadPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main>
        <section
          aria-labelledby="actividad-page-title"
          className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24"
        >
          <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
            Actividad interactiva
          </p>
          <h1
            id="actividad-page-title"
            className="mt-3 text-4xl leading-tight font-light tracking-tight uppercase sm:text-5xl"
          >
            Pon en práctica lo{' '}
            <strong className="font-bold">aprendido</strong>
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
