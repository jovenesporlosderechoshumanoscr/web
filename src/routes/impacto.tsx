import { createFileRoute } from '@tanstack/react-router'
import Footer from '@/components/landing/Footer'
import Header from '@/components/landing/Header'
import { statsContent } from '@/components/landing/Stats'

export const Route = createFileRoute('/impacto')({
  head: () => ({
    meta: [{ title: 'Nuestro impacto — JPDH' }],
  }),
  component: ImpactoPage,
})

const paragraphs = [
  'Estadísticas, fotografías de nuestras actividades, reconocimientos y testimonios que muestran cómo la educación en derechos humanos está llegando a diferentes comunidades de Costa Rica.',
  'Aquí presentaremos los resultados acumulados de nuestros 15 años, una vez consolidadas las cifras actualizadas.',
]

function ImpactoPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main>
        <section
          aria-labelledby="impacto-page-title"
          className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24"
        >
          <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
            Nuestro impacto
          </p>
          <h1
            id="impacto-page-title"
            className="mt-3 text-4xl leading-tight font-light tracking-tight uppercase sm:text-5xl lg:text-6xl"
          >
            La educación en derechos humanos llega a{' '}
            <strong className="font-bold">las comunidades</strong>
          </h1>
        </section>
        <section
          aria-labelledby="impacto-content-title"
          className="border-t bg-muted"
        >
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
            <h2
              id="impacto-content-title"
              className="text-2xl font-bold tracking-tight uppercase sm:text-3xl"
            >
              {statsContent.title}
            </h2>
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="mt-5 text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:divide-x sm:divide-border">
              {statsContent.items.map(({ value, label, Icon }) => (
                <li
                  key={label}
                  className="flex flex-col items-center gap-2 px-6 py-6 text-center sm:py-2"
                >
                  <Icon
                    aria-hidden="true"
                    className="size-6 text-muted-foreground"
                  />
                  <p className="text-4xl font-bold tracking-tight sm:text-5xl">
                    {value}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground uppercase">
                    {label}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
