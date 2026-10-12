import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandX,
  IconBrandYoutube,
} from '@tabler/icons-react'

export const footerContent = {
  logo: 'JPDH',
  tagline: 'Justicia, comunidad y dignidad.',
  links: [
    { label: 'Trabajo', href: '#trabajo' },
    { label: 'Historias', href: '#historias' },
    { label: 'Voces', href: '#voces' },
    { label: 'Centro de acción', href: '#accion' },
    { label: 'Nosotros', href: '#nosotros' },
    { label: 'Contacto', href: '#contacto' },
  ],
  socials: [
    { label: 'X', href: '#', Icon: IconBrandX },
    { label: 'Instagram', href: '#', Icon: IconBrandInstagram },
    { label: 'Facebook', href: '#', Icon: IconBrandFacebook },
    { label: 'YouTube', href: '#', Icon: IconBrandYoutube },
  ],
  legal: '© 2026 JPDH. Todos los derechos reservados.',
} as const

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-lg font-bold tracking-wide uppercase">
              {footerContent.logo}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {footerContent.tagline}
            </p>
          </div>
          <nav aria-label="Enlaces del pie de página">
            <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6">
              {footerContent.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
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
        </div>
        <p className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground sm:text-left">
          {footerContent.legal}
        </p>
      </div>
    </footer>
  )
}
