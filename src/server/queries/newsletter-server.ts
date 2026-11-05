import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth'
import {
  fetchListInfo,
  fetchRecentCampaigns,
  isMissingBrevoList,
} from '@/server/brevo'
import { getCampaignsSchema } from '@/server/validation/newsletter'

/**
 * Solo lectura del boletín. Los datos viven en Brevo; aquí solo se
 * consultan para mostrarlos en el panel admin.
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

  return fetchListInfo().catch((error) => {
    // Lista no configurada todavía o inexistente: estado benigno para el panel.
    if (isMissingBrevoList(error)) {
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
  .handler(async () => {
    await ensureAdmin()

    return fetchRecentCampaigns()
  })

export const newsletterQueries = {
  getListInfo,
  getRecentCampaigns,
}
