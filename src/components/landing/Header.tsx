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
    { label: 'Inicio', href: '/' },
    { label: 'Quiénes somos', href: '/about' },
    { label: 'Nuestro propósito', href: '/purpose' },
    { label: 'Qué hacemos', href: '/what-we-do' },
    { label: 'Ley 10030', href: '/ley-10030' },
    { label: 'Noticias', href: '/blog' },
    { label: 'Contacto', href: '/contact' },
  ],
} as const

export default function Header() {
  return (
    <header className="sticky top-0 z-50 h-19 border-b bg-background">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          className="text-lg font-bold tracking-wide uppercase"
          aria-label="JPDH — inicio"
        >
          <img src="/logojpdh.webp" alt="JPDH" className="h-18 w-auto" />
        </Link>

        <nav aria-label="Navegación principal" className="hidden md:block">
          <ul className="flex items-center gap-6 lg:gap-8">
            {headerContent.navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:underline focus-visible:outline-none"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:block">
          <Link
            to="/login"
            className="mt-auto inline-flex h-9 items-center justify-center gap-1.5 rounded-2xl bg-primary px-4 text-sm font-medium text-black dark:text-white"
          >
            Curso en linea
            <IconArrowRight aria-hidden="true" />
          </Link>
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
            <SheetContent showCloseButton={false} className="gap-0 p-6">
              <div className="flex items-center justify-between">
                <SheetTitle className="font-heading text-lg font-bold tracking-wide uppercase">
                  {headerContent.logo}
                </SheetTitle>
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
              <nav aria-label="Navegación móvil" className="mt-6 flex-1">
                <ul className="flex flex-col gap-1">
                  {headerContent.navLinks.map((link) => (
                    <li key={link.label}>
                      <SheetClose
                        nativeButton={false}
                        render={
                          <Link
                            to={link.href}
                            className="block rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted hover:text-primary focus-visible:bg-muted focus-visible:outline-none"
                          >
                            {link.label}
                          </Link>
                        }
                      />
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="mt-6 border-t pt-6">
                <SheetClose
                  nativeButton={false}
                  render={
                    <Link
                      to="/login"
                      className="flex h-11 w-full items-center justify-center gap-1.5 rounded-2xl bg-primary px-4 text-sm font-semibold text-black transition-colors hover:bg-primary/90 dark:text-white"
                    >
                      zona estudiantes
                      <IconArrowRight aria-hidden="true" />
                    </Link>
                  }
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
