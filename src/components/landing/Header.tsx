import { Link } from '@tanstack/react-router'
import { IconArrowRight, IconMenu, IconX } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export const headerContent = {
  logo: 'JPDH',
  navLinks: [
    { label: 'Trabajo', href: '#trabajo' },
    { label: 'Historias', href: '#historias' },
    { label: 'Voces', href: '#voces' },
    { label: 'Centro de acción', href: '#accion' },
    { label: 'Nosotros', href: '#nosotros' },
  ],
  donateLabel: 'Donar',
  donateHref: '#donar',
} as const

export default function Header() {
  return (
    <header className="sticky top-0 z-50 h-16 border-b bg-background">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          className="text-lg font-bold tracking-wide uppercase"
          aria-label="JPDH — inicio"
        >
          {headerContent.logo}
        </Link>

        <nav aria-label="Navegación principal" className="hidden md:block">
          <ul className="flex items-center gap-6 lg:gap-8">
            {headerContent.navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:underline focus-visible:outline-none"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:block">
          <Button
            render={
              <a href={headerContent.donateHref}>
                {headerContent.donateLabel}
                <IconArrowRight aria-hidden="true" />
              </a>
            }
          />
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="outline" size="icon" aria-label="Abrir menú">
                  <IconMenu aria-hidden="true" />
                </Button>
              }
            />
            <SheetContent>
              <div className="flex items-center justify-between">
                <SheetTitle>{headerContent.logo}</SheetTitle>
                <SheetClose
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Cerrar menú"
                    >
                      <IconX aria-hidden="true" />
                    </Button>
                  }
                />
              </div>
              <nav aria-label="Navegación móvil">
                <ul className="flex flex-col gap-1">
                  {headerContent.navLinks.map((link) => (
                    <li key={link.label}>
                      <SheetClose
                        render={
                          <a
                            href={link.href}
                            className="block rounded-md px-2 py-3 text-base font-medium hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
                          >
                            {link.label}
                          </a>
                        }
                      />
                    </li>
                  ))}
                </ul>
              </nav>
              <SheetClose
                render={
                  <a
                    href={headerContent.donateHref}
                    className="mt-auto inline-flex h-9 items-center justify-center gap-1.5 rounded-2xl bg-primary px-4 text-sm font-medium text-primary-foreground"
                  >
                    {headerContent.donateLabel}
                    <IconArrowRight aria-hidden="true" />
                  </a>
                }
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
