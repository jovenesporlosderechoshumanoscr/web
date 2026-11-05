import { useEffect, useReducer, useRef } from 'react'
import {
  IconAlertCircle,
  IconArrowLeft,
  IconArrowRight,
  IconBulb,
  IconCircleCheck,
  IconCheck,
} from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { REFLEXION, articulos } from '@/data/articulos'

type Fase = 'respondiendo' | 'correcto' | 'incorrecto' | 'reflexion'

type EstadoQuiz = {
  indice: number
  eleccion: number | null
  fase: Fase
  completados: number[]
}

type AccionQuiz =
  | { tipo: 'elegir'; opcion: number }
  | { tipo: 'reintentar' }
  | { tipo: 'continuar' }
  | { tipo: 'anterior' }
  | { tipo: 'siguiente' }

const estadoInicial: EstadoQuiz = {
  indice: 0,
  eleccion: null,
  fase: 'respondiendo',
  completados: [],
}

function reducer(estado: EstadoQuiz, accion: AccionQuiz): EstadoQuiz {
  switch (accion.tipo) {
    case 'elegir': {
      if (estado.fase === 'reflexion') return estado
      const articulo = articulos[estado.indice]
      return {
        ...estado,
        eleccion: accion.opcion,
        fase: accion.opcion === articulo.correcta ? 'correcto' : 'incorrecto',
      }
    }
    case 'reintentar':
      return { ...estado, eleccion: null, fase: 'respondiendo' }
    case 'continuar': {
      const articulo = articulos[estado.indice]
      return {
        ...estado,
        fase: 'reflexion',
        completados: estado.completados.includes(articulo.id)
          ? estado.completados
          : [...estado.completados, articulo.id],
      }
    }
    case 'anterior':
      if (estado.indice === 0) return estado
      return {
        ...estado,
        indice: estado.indice - 1,
        eleccion: null,
        fase: 'respondiendo',
      }
    case 'siguiente':
      if (estado.indice === articulos.length - 1) return estado
      return {
        ...estado,
        indice: estado.indice + 1,
        eleccion: null,
        fase: 'respondiendo',
      }
  }
}

export default function Quiz() {
  const [estado, dispatch] = useReducer(reducer, estadoInicial)
  const retroRef = useRef<HTMLDivElement>(null)
  const esPrimeraRenderRef = useRef(true)

  const { indice, eleccion, fase, completados } = estado
  const articulo = articulos[indice]
  const esUltimo = indice === articulos.length - 1
  const yaCompletado = completados.includes(articulo.id)

  useEffect(() => {
    if (esPrimeraRenderRef.current) {
      esPrimeraRenderRef.current = false
      return
    }
    if (fase !== 'respondiendo') {
      retroRef.current?.focus()
    }
  }, [fase, indice])

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
            Artículo {indice + 1} de {articulos.length}
          </p>
          {yaCompletado && (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
              <IconCheck className="size-3" aria-hidden="true" />
              Completado
            </span>
          )}
        </div>
        <div
          role="progressbar"
          aria-label={`Progreso: artículo ${indice + 1} de ${articulos.length}`}
          aria-valuemin={1}
          aria-valuemax={articulos.length}
          aria-valuenow={indice + 1}
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"
        >
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{
              width: `${((indice + 1) / articulos.length) * 100}%`,
            }}
          />
        </div>
        <CardTitle className="mt-3 text-xl font-bold tracking-tight sm:text-2xl">
          {articulo.titulo}
        </CardTitle>
        <p className="text-base leading-relaxed text-muted-foreground">
          {articulo.texto}
        </p>
      </CardHeader>
      <CardContent>
        <fieldset
          disabled={fase === 'correcto' || fase === 'reflexion'}
          className="disabled:opacity-60"
        >
          <legend className="text-base font-medium">{articulo.pregunta}</legend>
          <div className="mt-3 grid gap-2">
            {articulo.opciones.map((opcion, i) => (
              <label
                key={opcion}
                className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-background p-3 text-sm transition-colors hover:bg-muted has-checked:border-primary/40 has-checked:bg-primary/5 has-focus-visible:border-ring has-focus-visible:ring-3 has-focus-visible:ring-ring/30"
              >
                <input
                  type="radio"
                  name={`quiz-articulo-${articulo.id}`}
                  checked={eleccion === i}
                  onChange={() => dispatch({ tipo: 'elegir', opcion: i })}
                  className="size-4 shrink-0 accent-primary"
                />
                <span>{opcion}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {fase === 'correcto' && (
          <div
            ref={retroRef}
            tabIndex={-1}
            aria-live="polite"
            className="mt-4 flex items-start gap-3 rounded-2xl bg-muted p-4 outline-none"
          >
            <IconCircleCheck
              className="mt-0.5 size-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-semibold">¡Correcto! Muy bien.</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {articulo.explicacion}
              </p>
            </div>
          </div>
        )}

        {fase === 'incorrecto' && (
          <div
            ref={retroRef}
            tabIndex={-1}
            aria-live="polite"
            className="mt-4 flex items-start gap-3 rounded-2xl bg-muted p-4 outline-none"
          >
            <IconAlertCircle
              className="mt-0.5 size-5 shrink-0 text-destructive"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-semibold">
                Casi. Inténtalo una vez más.
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {articulo.explicacion}
              </p>
            </div>
          </div>
        )}

        {fase === 'correcto' && (
          <Button
            className="mt-4"
            onClick={() => dispatch({ tipo: 'continuar' })}
          >
            Continuar
          </Button>
        )}

        {fase === 'incorrecto' && (
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => dispatch({ tipo: 'reintentar' })}
          >
            Intentar de nuevo
          </Button>
        )}

        {fase === 'reflexion' && (
          <>
            <div
              ref={retroRef}
              tabIndex={-1}
              aria-live="polite"
              className="mt-4 flex items-start gap-3 rounded-2xl bg-muted p-4 outline-none"
            >
              <IconBulb
                className="mt-0.5 size-5 shrink-0 text-primary"
                aria-hidden="true"
              />
              <p className="text-sm leading-relaxed text-muted-foreground">
                ¡Bien hecho! Antes de continuar, reflexiona un momento.
                {esUltimo &&
                  ' Este era el último artículo disponible por ahora.'}
              </p>
            </div>
            <div className="mt-4 rounded-2xl border border-border p-4">
              <Label
                htmlFor={`reflexion-${articulo.id}`}
                className="items-start whitespace-normal"
              >
                {REFLEXION}
              </Label>
              <textarea
                id={`reflexion-${articulo.id}`}
                rows={3}
                placeholder="Escribe aquí tus ideas (opcional)"
                className="mt-2 w-full rounded-xl border border-border bg-background p-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Tu respuesta no se guarda ni se envía.
              </p>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="justify-between gap-2 border-t">
        <Button
          variant="outline"
          size="lg"
          onClick={() => dispatch({ tipo: 'anterior' })}
          disabled={indice === 0}
        >
          <IconArrowLeft data-icon="inline-start" />
          Anterior
        </Button>
        <Button
          size="lg"
          onClick={() => dispatch({ tipo: 'siguiente' })}
          disabled={esUltimo || fase !== 'reflexion'}
        >
          Siguiente derecho
          <IconArrowRight data-icon="inline-end" />
        </Button>
      </CardFooter>
    </Card>
  )
}
