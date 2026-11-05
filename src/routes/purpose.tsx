import { createFileRoute } from '@tanstack/react-router'
import Footer from '@/components/landing/Footer'
import Header from '@/components/landing/Header'
import { purposeContent } from '@/components/landing/Purpose'

export const Route = createFileRoute('/purpose')({
  head: () => ({
    meta: [{ title: 'Nuestro propósito — JPDH' }],
  }),
  component: PurposePage,
})

const paragraphs = [
  'El propósito de Jóvenes por los Derechos Humanos Costa Rica es enseñar a los jóvenes sobre los derechos humanos, especialmente los contenidos en la Declaración Universal de Derechos Humanos de las Naciones Unidas, e inspirarlos a convertirse en valiosos defensores de la tolerancia y la paz.',
  'Creemos que la educación es el primer paso para hacer de los derechos humanos una realidad. Por eso, trabajamos para que niños, jóvenes y adultos no solamente conozcan sus derechos, sino que comprendan su importancia, reconozcan la dignidad de cada persona y asuman la responsabilidad de respetar y proteger los derechos de los demás.',
  'Nuestro propósito es contribuir a formar generaciones conscientes de sus derechos y responsabilidades, capaces de aplicar estos principios en su vida cotidiana y de promover relaciones basadas en el respeto mutuo, la comprensión, la libertad y la paz.',
  'A través de materiales educativos sencillos, atractivos y eficaces, así como de programas de formación y actividades dirigidas a estudiantes, docentes, instituciones y comunidades, buscamos que cada persona descubra que puede desempeñar un papel activo en la construcción de una sociedad más respetuosa de la dignidad humana.',
  'Nuestra aspiración es que los derechos humanos dejen de ser solamente un ideal y se conviertan en una realidad cotidiana para todas las personas.',
]

function PurposePage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main>
        <section
          aria-labelledby="purpose-page-title"
          className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24"
        >
          <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
            {purposeContent.eyebrow}
          </p>
          <h1
            id="purpose-page-title"
            className="mt-3 text-4xl leading-tight font-light tracking-tight uppercase sm:text-5xl lg:text-6xl"
          >
            Enseñar los derechos humanos e inspirar{' '}
            <strong className="font-bold">defensores de la paz</strong>
          </h1>
        </section>
        <section
          aria-labelledby="purpose-content-title"
          className="border-t bg-muted"
        >
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
            <h2
              id="purpose-content-title"
              className="text-2xl font-bold tracking-tight uppercase sm:text-3xl"
            >
              {purposeContent.title}
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
