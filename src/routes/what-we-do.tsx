import { createFileRoute } from '@tanstack/react-router'
import Footer from '@/components/landing/Footer'
import Header from '@/components/landing/Header'
import { whatWeDoContent } from '@/components/landing/WhatWeDo'

export const Route = createFileRoute('/what-we-do')({
  head: () => ({
    meta: [{ title: 'Qué hacemos — JPDH' }],
  }),
  component: WhatWeDoPage,
})

const paragraphs = [
  'En Jóvenes por los Derechos Humanos Costa Rica promovemos la educación en los derechos humanos, especialmente aquellos contenidos en la Declaración Universal de Derechos Humanos de las Naciones Unidas, con el propósito de que las personas los conozcan, comprendan y apliquen en su vida cotidiana.',
  'Desarrollamos seminarios, charlas, talleres y actividades educativas dirigidas a niños, jóvenes, docentes y personas de todas las edades, en centros educativos, universidades, instituciones públicas y comunidades de todo el país.',
  'Proporcionamos materiales didácticos, publicaciones, videos y herramientas educativas que facilitan la enseñanza y el aprendizaje de los 30 derechos humanos. Asimismo, capacitamos y apoyamos a docentes para incorporar estos conocimientos en sus actividades educativas.',
  'Trabajamos en colaboración con instituciones públicas, organizaciones nacionales e internacionales y diversos sectores de la sociedad para ampliar el alcance de nuestros programas y promover la implementación de la Ley N.° 10030, que establece el estudio permanente de la Declaración Universal de Derechos Humanos en el sistema educativo costarricense.',
  'A través de estas acciones buscamos inspirar a las personas a reconocer su propia dignidad y la de los demás, fomentar el respeto mutuo, la tolerancia y la responsabilidad personal, y contribuir a la construcción de una sociedad más pacífica, justa y respetuosa de los derechos de todos.',
]

function WhatWeDoPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main>
        <section
          aria-labelledby="what-we-do-page-title"
          className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24"
        >
          <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
            {whatWeDoContent.eyebrow}
          </p>
          <h1
            id="what-we-do-page-title"
            className="mt-3 text-4xl leading-tight font-light tracking-tight uppercase sm:text-5xl lg:text-6xl"
          >
            Educación en derechos humanos para{' '}
            <strong className="font-bold">todas las edades</strong>
          </h1>
        </section>
        <section
          aria-labelledby="what-we-do-content-title"
          className="border-t bg-muted"
        >
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
            <h2
              id="what-we-do-content-title"
              className="text-2xl font-bold tracking-tight uppercase sm:text-3xl"
            >
              {whatWeDoContent.title}
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
