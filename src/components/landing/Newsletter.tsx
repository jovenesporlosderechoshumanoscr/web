import { useState } from 'react'
import { IconSend } from '@tabler/icons-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSubscribeNewsletter } from '@/functions/newsletter-client'

export const newsletterContent = {
  eyebrow: 'Boletín informativo',
  title: 'Noticias en tu correo',
  description:
    'Recibe cada mes novedades, convocatorias y recursos sobre derechos humanos directamente en tu bandeja de entrada.',
  emailLabel: 'Correo electrónico',
  emailPlaceholder: 'tu@correo.com',
  submitLabel: 'Suscribirme',
  successMessage:
    '¡Casi listo! Te enviamos un correo para confirmar tu suscripción.',
  errorMessage:
    'No se pudo procesar la suscripción. Inténtalo de nuevo más tarde.',
  invalidEmailMessage: 'Ingresa un correo electrónico válido.',
} as const

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Valor que el server interpreta como honeypot (bots rellenaron el campo). */
const HONEYPOT_EMAIL = '+honeypot+'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const subscribe = useSubscribeNewsletter()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // Los bots rellenan el campo oculto: enviamos el marcador que el
    // server descarta silenciosamente.
    if (honeypot.trim() !== '') {
      subscribe.mutate(
        { email: HONEYPOT_EMAIL },
        {
          onSuccess: () => {
            setEmail('')
            setHoneypot('')
          },
        },
      )
      return
    }

    if (!EMAIL_RE.test(email.trim())) {
      toast.error(newsletterContent.invalidEmailMessage)
      return
    }

    subscribe.mutate(
      { email: email.trim() },
      {
        onSuccess: () => {
          setEmail('')
          toast.success(newsletterContent.successMessage)
        },
        onError: () => toast.error(newsletterContent.errorMessage),
      },
    )
  }

  return (
    <section aria-labelledby="newsletter-title" className="border-y">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
            {newsletterContent.eyebrow}
          </p>
          <h2
            id="newsletter-title"
            className="mt-3 text-3xl font-bold tracking-tight uppercase sm:text-4xl"
          >
            {newsletterContent.title}
          </h2>
          <p className="mt-5 text-muted-foreground">
            {newsletterContent.description}
          </p>
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex w-full flex-col gap-3 sm:flex-row"
            noValidate
          >
            <div className="flex-1 text-left">
              <label htmlFor="newsletter-email" className="sr-only">
                {newsletterContent.emailLabel}
              </label>
              <Input
                id="newsletter-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={newsletterContent.emailPlaceholder}
                maxLength={255}
                className="w-full"
              />
            </div>
            {/* Honeypot anti-bots: oculto para personas, visible para bots. */}
            <input
              type="text"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />
            <Button type="submit" disabled={subscribe.isPending}>
              <IconSend aria-hidden="true" />
              {newsletterContent.submitLabel}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
