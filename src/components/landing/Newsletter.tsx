import { useState } from 'react'
import type { FormEvent } from 'react'
import { IconCheck, IconSend } from '@tabler/icons-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const newsletterContent = {
  title: 'Boletín informativo',
  text: 'Recibe historias, convocatorias y recursos una vez al mes. Sin spam.',
  emailLabel: 'Correo electrónico',
  emailPlaceholder: 'tu@correo.org',
  submitLabel: 'Suscribirme',
  successMessage: '¡Gracias por suscribirte! Revisa tu correo.',
  privacyNote: 'Respetamos tu privacidad. Puedes darte de baja en cualquier momento.',
} as const

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [subscribed, setSubscribed] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = email.trim()
    if (!EMAIL_RE.test(value)) {
      setError('Ingresa un correo electrónico válido.')
      setSubscribed(false)
      return
    }
    setError(null)
    setSubscribed(true)
    toast.success(newsletterContent.successMessage)
  }

  return (
    <section
      aria-labelledby="newsletter-title"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2
          id="newsletter-title"
          className="text-2xl font-bold tracking-tight uppercase sm:text-3xl"
        >
          {newsletterContent.title}
        </h2>
        <p className="mt-3 text-muted-foreground">{newsletterContent.text}</p>
        <form onSubmit={handleSubmit} noValidate className="mt-8 text-left">
          <Label htmlFor="newsletter-email">
            {newsletterContent.emailLabel}
          </Label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Input
              id="newsletter-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder={newsletterContent.emailPlaceholder}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={error ? true : undefined}
              aria-describedby={
                error ? 'newsletter-error' : 'newsletter-privacy'
              }
              className="flex-1"
            />
            <Button type="submit">
              {newsletterContent.submitLabel}
              <IconSend aria-hidden="true" />
            </Button>
          </div>
          {error ? (
            <p id="newsletter-error" role="alert" className="mt-2 text-sm">
              {error}
            </p>
          ) : null}
          {subscribed && !error ? (
            <p role="status" className="mt-2 flex items-center gap-1.5 text-sm">
              <IconCheck aria-hidden="true" className="size-4" />
              {newsletterContent.successMessage}
            </p>
          ) : null}
        </form>
        <p id="newsletter-privacy" className="mt-4 text-xs text-muted-foreground">
          {newsletterContent.privacyNote}
        </p>
      </div>
    </section>
  )
}
