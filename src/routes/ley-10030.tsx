import { Link, createFileRoute } from '@tanstack/react-router'
import { IconArrowRight, IconConfetti, IconFileText } from '@tabler/icons-react'
import { buttonVariants } from '@/components/ui/button'
import Footer from '@/components/landing/Footer'
import Header from '@/components/landing/Header'
import { lawContent } from '@/components/landing/Law'
import { Rights } from '@/components/landing/Rights'

export const Route = createFileRoute('/ley-10030')({
  head: () => ({
    meta: [
      { title: 'Ley N.° 10030 — JPDH' },
      {
        name: 'description',
        content:
          'Conoce la Ley N.° 10030, impulsada por nuestra organización, que incorpora el estudio permanente de la Declaración Universal de Derechos Humanos en la educación costarricense y declara el 10 de diciembre como Día Nacional de los Derechos Humanos.',
      },
    ],
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
          className="border-t bg-primary/10"
        >
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
              <div>
                <h2
                  id="ley-content-title"
                  className="text-2xl font-bold tracking-tight uppercase sm:text-3xl"
                >
                  {lawContent.title}
                </h2>
                {paragraphs.map((paragraph) => {
                  const esEnlaceLey = paragraph.startsWith('Conoce la Ley')
                  return esEnlaceLey ? (
                    <a
                      key={paragraph.slice(0, 24)}
                      href="/la-gaceta-ley-10030.pdf"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex items-center gap-1.5 font-semibold text-foreground underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
                    >
                      {paragraph}
                      <IconFileText aria-hidden="true" className="size-4" />
                    </a>
                  ) : (
                    <p
                      key={paragraph.slice(0, 24)}
                      className="mt-5 text-muted-foreground"
                    >
                      {paragraph}
                    </p>
                  )
                })}
              </div>
              <div className="mx-auto w-full max-w-2xl rounded-3xl p-8 text-center sm:p-12">
                <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/15">
                  <IconConfetti className="size-7" aria-hidden="true" />
                </span>
                <p className="mt-4 text-sm font-semibold tracking-widest text-muted-foreground uppercase">
                  Actividad interactiva
                </p>
                <h3 className="mt-3 text-3xl font-bold tracking-tight uppercase sm:text-4xl">
                  Pon en práctica lo{' '}
                  <strong className="font-bold">aprendido</strong>
                </h3>
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
          </div>
        </section>
        <Rights />
      </main>
      <Footer />
    </div>
  )
}
