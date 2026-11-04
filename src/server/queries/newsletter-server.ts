import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth'
import type { BrevoCampaign, BrevoListInfo } from '@/server/brevo'
import {
  BrevoError,
  fetchListInfo,
  fetchRecentCampaigns,
  withDevGuard,
} from '@/server/brevo'
import { getCampaignsSchema } from '@/server/validation/newsletter'

/**
 * Solo lectura del boletín. Los datos viven en Brevo; aquí solo se
 * consultan para mostrarlos en el panel admin.
 *
 * En dev, `withDevGuard` devuelve datos simulados sin llamar a la API.
 */
async function ensureAdmin() {
  const headers = getRequestHeaders()
  const session = await auth.api.getSession({ headers })
  if (!session || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }
  return session
}

const getListInfo = createServerFn({ method: 'GET' }).handler(async () => {
  await ensureAdmin()

  return withDevGuard<BrevoListInfo>(
    { action: 'getListInfo' },
    // Simulado en dev: se ve la estructura sin llamar a Brevo.
    () => ({
      id: Number(process.env.BREVO_LIST_ID ?? 0),
      name: 'Boletín JPDH (simulado)',
      totalSubscribers: 0,
      totalBlacklisted: 0,
    }),
    async (config) => fetchListInfo(config, config.listId),
  ).catch((error) => {
    // Lista no configurada todavía (404): estado benigno para el panel.
    if (error instanceof BrevoError && error.status === 404) {
      return {
        id: Number(process.env.BREVO_LIST_ID ?? 0),
        name: 'Boletín JPDH',
        totalSubscribers: 0,
        totalBlacklisted: 0,
      }
    }
    throw error
  })
})

const getRecentCampaigns = createServerFn({ method: 'GET' })
  .validator(getCampaignsSchema)
  .handler(async ({ data }) => {
    await ensureAdmin()

    return withDevGuard<BrevoCampaign[]>(
      { action: 'getRecentCampaigns', ...data },
      // Simulado en dev.
      () => [],
      async (config) => fetchRecentCampaigns(config),
    )
  })

export const newsletterQueries = {
  getListInfo,
  getRecentCampaigns,
}
