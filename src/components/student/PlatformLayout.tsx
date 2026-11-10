import ThemeToggle from '@/components/ThemeToggle'
import { cn } from 'cn'
import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { UserMenu } from './UserMenu'

/**
 * Layout de la plataforma de estudiantes (todo lo que NO está dentro de un
 * curso): header con logo, theme toggle y dropdown de usuario, contenedor
 * centrado y un fondo con motivos sutiles de marca (bloques en diagonal y
 * punto circular, como el hero de la landing).
 */
export function PlatformLayout({
  user,
  children,
  className,
}: {
  user: { name: string; email: string }
  children: ReactNode
  className?: string
}) {
  return (
    <div className="relative flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link
            to="/student"
            aria-label="JPDH Costa Rica · Zona de estudiantes"
            className="flex items-center transition-opacity hover:opacity-80 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
          >
            <img
              src="/logojpdh.webp"
              alt="Jóvenes por los Derechos Humanos Costa Rica"
              className="h-16 w-auto"
            />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserMenu user={user} />
          </div>
        </div>
      </header>

      {/* Motivos de marca muy sutiles: diagonales del hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-72 overflow-hidden"
      >
        <div className="absolute top-0 right-0 h-40 w-1/3 bg-primary/8 [clip-path:polygon(100%_0,0_0,100%_100%)]" />
        <div className="absolute top-0 right-8 h-24 w-1/4 bg-secondary/6 [clip-path:polygon(0_0,100%_0,100%_60%)]" />
        <div className="absolute top-40 left-[16%] size-1.5 rounded-full bg-secondary/30" />
      </div>

      <main className={cn('relative z-10 flex-1', className)}>{children}</main>
    </div>
  )
}
