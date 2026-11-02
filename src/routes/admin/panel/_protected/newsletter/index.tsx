import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CampaignComposer } from '@/components/newsletter/CampaignComposer'
import {
  useNewsletterCampaigns,
  useNewsletterList,
} from '@/functions/newsletter-client'

export const Route = createFileRoute('/admin/panel/_protected/newsletter/')({
  component: RouteComponent,
})

const pageContent = {
  title: 'Boletín',
  subscribersLabel: 'Suscriptores',
  blacklistedLabel: 'Bloqueados',
  frequencyNote:
    'Brevo omitirá a los contactos que hayan recibido un correo de marketing en los últimos días según el límite de frecuencia configurado en Brevo (Configuración → Campañas → Cadencia de envío).',
  dailyLimitNote:
    'Si la lista supera el límite diario del plan, Brevo pausará el envío y el resto quedará pendiente para reanudar al día siguiente.',
  historyTitle: 'Historial de campañas',
  historyEmpty: 'Sin campañas todavía.',
  historyError: 'No se pudo cargar la información del boletín.',
  listError: 'No se pudo cargar la información del boletín.',
  colName: 'Asunto',
  colStatus: 'Estado',
  colSent: 'Enviados',
  colStats: 'Aperturas / Clics',
  colDate: 'Fecha',
  statusLabels: {
    draft: 'Borrador',
    sent: 'Enviada',
    queued: 'En cola',
    suspended: 'Suspendida',
    in_process: 'En proceso',
    in_review: 'En revisión',
    cancelling: 'Cancelando',
    cancelled: 'Cancelada',
    archive: 'Archivada',
  } as Record<string, string>,
  suspendedHint:
    'Pausada por límite diario: reanúdala desde Brevo cuando tengas créditos.',
}

function formatDateTime(value: string | undefined): string {
  if (!value) return '—'
  return new Date(value).toLocaleString('es', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function RouteComponent() {
  const listQuery = useNewsletterList()
  const campaignsQuery = useNewsletterCampaigns({ limit: 10, offset: 0 })

  const list = listQuery.data
  const campaigns = campaignsQuery.data ?? []

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-semibold">{pageContent.title}</h1>

      {listQuery.isError ? (
        <p className="text-sm text-destructive">{pageContent.listError}</p>
      ) : null}

      {listQuery.isSuccess && list ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{list.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-8 text-sm">
              <div>
                <p className="text-muted-foreground">
                  {pageContent.subscribersLabel}
                </p>
                <p className="text-2xl font-bold">{list.totalSubscribers}</p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  {pageContent.blacklistedLabel}
                </p>
                <p className="text-2xl font-bold">{list.totalBlacklisted}</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              {pageContent.frequencyNote}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {pageContent.dailyLimitNote}
            </p>
          </CardContent>
        </Card>
      ) : null}

      <CampaignComposer subscriberCount={list?.totalSubscribers ?? 0} />

      <Card>
        <CardHeader>
          <CardTitle>{pageContent.historyTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          {campaignsQuery.isPending && (
            <p className="py-6 text-sm">Cargando…</p>
          )}
          {campaignsQuery.isError ? (
            <p className="py-6 text-sm text-destructive">
              {pageContent.historyError}
            </p>
          ) : null}
          {campaignsQuery.isSuccess && campaigns.length === 0 ? (
            <p className="py-6 text-sm text-muted-foreground">
              {pageContent.historyEmpty}
            </p>
          ) : null}
          {campaigns.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="py-2 pr-4 font-medium">
                      {pageContent.colName}
                    </th>
                    <th className="py-2 pr-4 font-medium">
                      {pageContent.colStatus}
                    </th>
                    <th className="py-2 pr-4 font-medium">
                      {pageContent.colSent}
                    </th>
                    <th className="py-2 pr-4 font-medium">
                      {pageContent.colStats}
                    </th>
                    <th className="py-2 font-medium">{pageContent.colDate}</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => {
                    const stats = campaign.statistics?.globalStats
                    return (
                      <tr key={campaign.id} className="border-b last:border-0">
                        <td className="py-2 pr-4">
                          {campaign.subject || campaign.name}
                        </td>
                        <td className="py-2 pr-4">
                          {pageContent.statusLabels[campaign.status] ??
                            campaign.status}
                          {campaign.status === 'suspended' ? (
                            <span className="block text-xs text-muted-foreground">
                              {pageContent.suspendedHint}
                            </span>
                          ) : null}
                        </td>
                        <td className="py-2 pr-4">
                          {stats?.sent ?? '—'}
                          {campaign.statistics?.remaining
                            ? ` (${campaign.statistics.remaining} pendientes)`
                            : ''}
                        </td>
                        <td className="py-2 pr-4">
                          {stats?.uniqueViews ?? '—'} /{' '}
                          {stats?.uniqueClicks ?? '—'}
                        </td>
                        <td className="py-2">
                          {formatDateTime(
                            campaign.sentDate ?? campaign.scheduledAt,
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
