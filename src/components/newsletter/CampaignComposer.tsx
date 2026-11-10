import { useMemo, useState } from 'react'
import { IconEye, IconEyeOff, IconSend } from '@tabler/icons-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useSendNewsletter } from '@/functions/newsletter-client'
import {
  NEWSLETTER_LIMITS,
  renderNewsletterHtml,
} from '@/server/newsletter-template'

const composerContent = {
  title: 'Nueva campaña',
  subjectLabel: 'Asunto',
  subjectPlaceholder: 'Boletín de noviembre',
  previewLabel: 'Pretexto (vista previa en la bandeja)',
  previewPlaceholder: 'Historias, convocatorias y recursos del mes',
  contentLabel: 'Cuerpo del boletín',
  contentPlaceholder: 'Escribe el contenido del boletín…',
  sendAllLabel: 'Enviar a todos',
  previewLabelShort: 'Vista previa',
  hidePreview: 'Ocultar vista previa',
  showPreview: 'Mostrar vista previa',
  confirmSendTitle: 'Enviar boletín',
  successSendMessage:
    'Campaña iniciada. Si se supera el límite diario, Brevo la pausará y podrás reanudarla mañana.',
} as const

export function CampaignComposer({
  subscriberCount,
}: {
  subscriberCount: number
}) {
  const [subject, setSubject] = useState('')
  const [previewText, setPreviewText] = useState('')
  const [content, setContent] = useState('')
  const [showPreview, setShowPreview] = useState(true)
  const [confirmSend, setConfirmSend] = useState(false)

  const sendAll = useSendNewsletter()

  const previewHtml = useMemo(
    () =>
      renderNewsletterHtml({
        content: content || 'Escribe el contenido del boletín…',
        previewText: previewText,
      }),
    [content, previewText],
  )

  const isFormValid =
    subject.trim().length >= 3 &&
    content.trim().length >= 10 &&
    previewText.length <= NEWSLETTER_LIMITS.previewText &&
    subject.length <= NEWSLETTER_LIMITS.subject &&
    content.length <= NEWSLETTER_LIMITS.content

  function handleSendAll() {
    sendAll.mutate(
      {
        subject: subject.trim(),
        previewText: previewText.trim(),
        content: content.trim(),
      },
      {
        onSuccess: () => toast.success(composerContent.successSendMessage),
        onError: () =>
          toast.error('No se pudieron enviar los correos. Inténtalo de nuevo.'),
      },
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{composerContent.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="newsletter-subject">
                {composerContent.subjectLabel}
                <span className="text-xs text-muted-foreground">
                  {' '}
                  ({subject.length}/{NEWSLETTER_LIMITS.subject})
                </span>
              </Label>
              <Input
                id="newsletter-subject"
                value={subject}
                maxLength={NEWSLETTER_LIMITS.subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={composerContent.subjectPlaceholder}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="newsletter-preview">
                {composerContent.previewLabel}
              </Label>
              <Input
                id="newsletter-preview"
                value={previewText}
                maxLength={NEWSLETTER_LIMITS.previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                placeholder={composerContent.previewPlaceholder}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="newsletter-content">
                {composerContent.contentLabel}
                <span className="text-xs text-muted-foreground">
                  {' '}
                  ({content.length}/{NEWSLETTER_LIMITS.content})
                </span>
              </Label>
              <textarea
                id="newsletter-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={composerContent.contentPlaceholder}
                rows={12}
                className="h-64 rounded-2xl border border-transparent bg-input/50 px-3 py-2 text-sm outline-none focus-visible:border-ring"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                disabled={!isFormValid || sendAll.isPending}
                onClick={() => setConfirmSend(true)}
              >
                <IconSend aria-hidden="true" />
                {composerContent.sendAllLabel}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowPreview((v) => !v)}
              >
                {showPreview ? (
                  <IconEyeOff aria-hidden="true" />
                ) : (
                  <IconEye aria-hidden="true" />
                )}
                {showPreview
                  ? composerContent.hidePreview
                  : composerContent.showPreview}
              </Button>
            </div>
          </div>

          {showPreview ? (
            <div className="flex flex-col gap-2">
              <Label>{composerContent.previewLabelShort}</Label>
              <iframe
                title="Vista previa del boletín"
                srcDoc={previewHtml}
                sandbox="allow-same-origin"
                className="h-[520px] w-full rounded-lg border"
              />
            </div>
          ) : null}
        </div>
      </CardContent>

      <ConfirmDialog
        open={confirmSend}
        onOpenChange={setConfirmSend}
        title={composerContent.confirmSendTitle}
        description={`Asunto: ${subject.trim()}. Destinatarios: ${subscriberCount} contactos de la lista del boletín. ¿Quieres continuar?`}
        confirmLabel="Enviar"
        pendingLabel="Enviando…"
        isPending={sendAll.isPending}
        onConfirm={handleSendAll}
        onCancel={() => setConfirmSend(false)}
      />
    </Card>
  )
}
