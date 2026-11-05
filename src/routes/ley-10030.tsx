import { createFileRoute } from '@tanstack/react-router'
import Footer from '@/components/landing/Footer'
import Header from '@/components/landing/Header'
import { lawContent } from '@/components/landing/Law'

export const Route = createFileRoute('/ley-10030')({
  head: () => ({
    meta: [{ title: 'Ley N.° 10030 — JPDH' }],
  }),
  component: LeyPage,
})

const paragraphs = [
  'Uno de nuestros logros más importantes ha sido promover la aprobación de la Ley N.° 10030, que incorpora el estudio permanente de la Declaración Universal de Derechos Humanos en la educación costarricense y declara el 10 de diciembre como Día Nacional de los Derechos Humanos.',
  'Esta ley representa un paso significativo hacia nuestro objetivo de convertir el conocimiento de los derechos humanos en parte de la formación de las nuevas generaciones.',
  'Conoce la Ley N.° 10030 y cómo contribuir a su implementación.',
]

function LeyPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main>
        <section
          aria-labelledby="ley-page-title"
          className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24"
        >
          <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
            {lawContent.eyebrow}
          </p>
          <h1
            id="ley-page-title"
            className="mt-3 text-4xl leading-tight font-light tracking-tight uppercase sm:text-5xl lg:text-6xl"
          >
            Nuestro compromiso con{' '}
            <strong className="font-bold">Costa Rica</strong>
          </h1>
        </section>
        <section
          aria-labelledby="ley-content-title"
          className="border-t bg-muted"
        >
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
            <h2
              id="ley-content-title"
              className="text-2xl font-bold tracking-tight uppercase sm:text-3xl"
            >
              {lawContent.title}
            </h2>
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="mt-5 text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
