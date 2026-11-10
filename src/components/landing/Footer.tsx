import { Link } from '@tanstack/react-router'
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandX,
  IconBrandYoutube,
} from '@tabler/icons-react'
import ThemeToggle from '@/components/ThemeToggle'

export const footerContent = {
  logo: 'JPDH',
  tagline:
    '«No basta con que los derechos humanos estén escritos. Es necesario que las personas los conozcan, los comprendan y los hagan parte de su vida».',
  links: [
    { label: 'Inicio', href: '/' },
    { label: 'Quiénes somos', href: '/about' },
    { label: 'Nuestro propósito', href: '/purpose' },
    { label: 'Qué hacemos', href: '/what-we-do' },
    { label: 'Ley 10030', href: '/ley-10030' },
    { label: 'Noticias', href: '/blog' },
    { label: 'Contacto', href: '/contact' },
    { label: 'Zona estudiantes', href: '/student' },
    { label: 'Términos', href: '/terms' },
    { label: 'Privacidad', href: '/privacy' },
  ],
  socials: [
    { label: 'X', href: '#', Icon: IconBrandX },
    { label: 'Instagram', href: '#', Icon: IconBrandInstagram },
    { label: 'Facebook', href: '#', Icon: IconBrandFacebook },
    { label: 'YouTube', href: '#', Icon: IconBrandYoutube },
  ],
  legal:
    '© 2026 Jóvenes por los Derechos Humanos Costa Rica. Todos los derechos reservados.',
} as const

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <img src="/logojpdh.webp" alt="JPDH" className="h-18 w-auto" />
            <p className="mt-2 text-sm text-muted-foreground">
              {footerContent.tagline}
            </p>
          </div>
          <nav aria-label="Enlaces del pie de página">
            <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6">
              {footerContent.links.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith('/') ? (
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:underline"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:underline"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-3">
            <ul aria-label="Redes sociales" className="flex items-center gap-2">
              {footerContent.socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    className="flex size-9 items-center justify-center rounded-xl border border-border transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
                  >
                    <Icon aria-hidden="true" className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
            <ThemeToggle />
          </div>
        </div>
        <p className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground sm:text-left">
          {footerContent.legal}
        </p>
      </div>
    </footer>
  )
}
