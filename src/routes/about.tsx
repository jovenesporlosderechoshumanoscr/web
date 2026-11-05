import { createFileRoute } from '@tanstack/react-router'
import Footer from '@/components/landing/Footer'
import Header from '@/components/landing/Header'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [{ title: 'Quiénes somos — JPDH' }],
  }),
  component: AboutPage,
})

const aboutParagraphs = [
  'Jóvenes por los Derechos Humanos Costa Rica es una organización sin fines de lucro dedicada a promover la educación en derechos humanos, especialmente aquellos contenidos en la Declaración Universal de Derechos Humanos de las Naciones Unidas, con el propósito de que las personas los conozcan, comprendan y los hagan parte de su vida cotidiana.',
  'Somos parte del movimiento mundial Youth for Human Rights International (YHRI), fundado en 2001 por la Dra. Mary Shuttleworth, educadora sudafricana que vivió de primera mano las consecuencias de la discriminación durante el apartheid y que decidió dedicar sus esfuerzos a enseñar a las nuevas generaciones el valor de los derechos humanos.',
  'Desde hace 15 años trabajamos en Costa Rica para llevar este conocimiento a niños, jóvenes y adultos, convencidos de que la educación es una herramienta fundamental para fomentar el respeto por la dignidad humana, la tolerancia, la responsabilidad personal y la paz.',
  'Nuestra labor se desarrolla en centros educativos, universidades, instituciones públicas y comunidades de todo el país, mediante programas educativos, materiales audiovisuales, publicaciones, seminarios y actividades que presentan los derechos humanos de una manera sencilla, práctica y accesible para personas de todas las edades.',
  'Uno de nuestros logros más significativos ha sido promover la aprobación de la Ley N.° 10030, que incorpora el estudio permanente de la Declaración Universal de Derechos Humanos en el sistema educativo costarricense y establece el 10 de diciembre como Día Nacional de los Derechos Humanos.',
  'A lo largo de nuestra trayectoria hemos establecido relaciones de cooperación con instituciones públicas, organizaciones educativas, movimientos juveniles y entidades nacionales e internacionales, ampliando el alcance de nuestros programas y acercando el conocimiento de los derechos humanos a miles de personas.',
  'Creemos que los derechos humanos deben ser mucho más que palabras escritas en una declaración: deben convertirse en una realidad en la vida de cada persona, en nuestras familias, en nuestras comunidades y en toda Costa Rica.',
]

const historyParagraphs = [
  'Jóvenes por los Derechos Humanos Costa Rica forma parte de Youth for Human Rights International (YHRI), un movimiento educativo internacional fundado en 2001 por la Dra. Mary Shuttleworth, cuya experiencia al crecer en la Sudáfrica del apartheid la inspiró a promover el conocimiento de los derechos humanos entre las nuevas generaciones.',
  'El movimiento inició sus actividades con un concurso europeo de ensayos sobre derechos humanos, cuyos ganadores fueron reconocidos en las Naciones Unidas en Ginebra en octubre de 2001.',
  'En 2004, YHRI emprendió su primera gira educativa mundial, llevando su mensaje a diversos países y comunidades. Durante esa iniciativa se filmaron escenas de UNITED, un cortometraje musical realizado con la participación de miles de voluntarios y jóvenes artistas, que se convirtió en una de las herramientas educativas más representativas del movimiento.',
  'Desde entonces, Youth for Human Rights International ha extendido su labor a numerosos países mediante programas educativos, materiales audiovisuales, seminarios, campañas y actividades que promueven el conocimiento de la Declaración Universal de Derechos Humanos.',
]

const historyCostaRicaParagraphs = [
  'Desde 2011, Jóvenes por los Derechos Humanos Costa Rica ha trabajado para acercar la educación en derechos humanos a estudiantes, docentes, instituciones y comunidades de todo el país.',
  'A lo largo de estos 15 años, nuestra organización ha desarrollado seminarios, conferencias, talleres, campañas educativas y actividades comunitarias, utilizando materiales diseñados para explicar de manera sencilla y accesible los 30 artículos de la Declaración Universal de Derechos Humanos.',
  'Nuestro trabajo ha permitido establecer relaciones de cooperación con instituciones públicas, centros educativos, universidades, organizaciones juveniles y entidades nacionales e internacionales, ampliando progresivamente el alcance de nuestros programas.',
  'Entre nuestros logros destaca la promoción de la Ley N.° 10030, aprobada en 2021, que representa un importante avance para la educación en derechos humanos en Costa Rica.',
  'Hoy continuamos trabajando con la misma convicción que dio origen al movimiento internacional: que el conocimiento de los derechos humanos puede inspirar a las personas a reconocer su dignidad, respetar la de los demás y contribuir a construir un mundo de tolerancia y paz.',
]

function AboutPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main>
        <section
          aria-labelledby="about-page-title"
          className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24"
        >
          <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
            Quiénes somos
          </p>
          <h1
            id="about-page-title"
            className="mt-3 text-4xl leading-tight font-light tracking-tight uppercase sm:text-5xl lg:text-6xl"
          >
            Jóvenes por los{' '}
            <strong className="font-bold">Derechos Humanos</strong> Costa Rica
          </h1>
        </section>
        <section aria-labelledby="about-content-title" className="border-t">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
            <h2
              id="about-content-title"
              className="text-2xl font-bold tracking-tight uppercase sm:text-3xl"
            >
              Una organización dedicada a la educación en derechos humanos
            </h2>
            {aboutParagraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="mt-5 text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>
        <section
          aria-labelledby="about-history-title"
          className="border-t bg-muted"
        >
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
            <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
              Nuestra historia
            </p>
            <h2
              id="about-history-title"
              className="mt-3 text-2xl font-bold tracking-tight uppercase sm:text-3xl"
            >
              Un movimiento mundial por la educación en derechos humanos
            </h2>
            {historyParagraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="mt-5 text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>
        <section aria-labelledby="about-history-cr-title" className="border-t">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
            <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
              Nuestra historia en Costa Rica
            </p>
            <h2
              id="about-history-cr-title"
              className="mt-3 text-2xl font-bold tracking-tight uppercase sm:text-3xl"
            >
              15 años educando en derechos humanos
            </h2>
            {historyCostaRicaParagraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="mt-5 text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>
        <section
          aria-labelledby="about-cta-title"
          className="border-t bg-muted"
        >
          <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-24">
            <h2
              id="about-cta-title"
              className="text-2xl font-bold tracking-tight uppercase sm:text-3xl"
            >
              ¿Quieres colaborar o saber más?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Escríbenos y construyamos juntos.
            </p>
            <a
              href="/contact"
              className="mt-6 inline-flex h-11 items-center justify-center gap-1.5 rounded-2xl bg-primary px-6 text-sm font-medium text-primary-foreground"
            >
              Contacto
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
