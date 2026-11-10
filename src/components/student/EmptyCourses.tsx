import { buttonVariants } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

/** Estado vacío del dashboard: aún no hay cursos publicados. */
export function EmptyCourses() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
      <svg
        viewBox="0 0 160 120"
        className="w-44 text-muted-foreground/50"
        aria-hidden="true"
      >
        <rect
          x="30"
          y="18"
          width="100"
          height="84"
          rx="10"
          className="fill-primary/10 stroke-primary/40"
          strokeWidth="2"
        />
        <line
          x1="45"
          y1="42"
          x2="115"
          y2="42"
          className="stroke-primary/40"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <line
          x1="45"
          y1="58"
          x2="100"
          y2="58"
          className="stroke-muted-foreground/40"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <line
          x1="45"
          y1="74"
          x2="92"
          y2="74"
          className="stroke-muted-foreground/30"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="126" cy="24" r="8" className="fill-secondary/60" />
        <circle cx="26" cy="96" r="5" className="fill-accent/50" />
      </svg>
      <div>
        <h2 className="font-heading text-lg font-bold">Aún no hay cursos</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Cuando el equipo publique cursos, aparecerán aquí para que empieces a
          aprender sobre tus derechos humanos.
        </p>
      </div>
      <Link to="/" className={buttonVariants({ variant: 'outline' })}>
        Volver al inicio
      </Link>
    </div>
  )
}
