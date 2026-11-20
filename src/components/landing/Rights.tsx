import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { derechosUniversales, type DerechoUniversal } from '@/lib/rightsVideos'

function DerechoVideoLink({ derecho }: { derecho: DerechoUniversal }) {

  return (
    <a
      href={derecho.videoUrl}
      target="_blank"
      rel="noreferrer"
      className="font-medium hover:underline"
    >
      Ver video
    </a>
  )
}

export function Rights() {
  return (
    <section aria-labelledby="rights-title" className="border-t">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
            Declaración Universal de Derechos Humanos
          </p>
          <h2
            id="rights-title"
            className="mt-3 text-3xl font-bold tracking-tight uppercase sm:text-4xl"
          >
            Los <strong className="font-bold">30 derechos</strong> universales
          </h2>
          <p className="mt-5 text-muted-foreground">
            Explora artículo por artículo cada uno de los derechos de la
            Declaración Universal, con un video para verlo.
          </p>
        </div>
        <Accordion
          multiple
          className="mx-auto mt-10 w-full max-w-3xl gap-4 border-0 sm:max-w-5xl sm:grid sm:grid-cols-2 sm:items-start"
        >
          {derechosUniversales.map((derecho) => (
            <AccordionItem
              key={derecho.numero}
              value={String(derecho.numero)}
              className="overflow-hidden rounded-2xl border"
            >
              <AccordionTrigger>
                <span className="flex items-center gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-foreground">
                    {derecho.numero}
                  </span>
                  <span className="font-semibold">{derecho.titulo}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">{derecho.resumen}</p>
                  <DerechoVideoLink derecho={derecho} />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
