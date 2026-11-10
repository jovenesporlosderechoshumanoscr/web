import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { newsletterQueries } from '@/server/queries/newsletter-server'
import { newsletterMutations } from '@/server/mutations/newsletter-server'
import type {
  GetCampaignsInput,
  SendCampaignInput,
  SubscribeInput,
} from '@/server/validation/newsletter'

export const NEWSLETTER_LIST_KEY = 'newsletter'
export const NEWSLETTER_CAMPAIGNS_KEY = 'newsletter-campaigns'

/** Info de la lista de suscriptores (panel admin). */
export function useNewsletterList() {
  return useQuery({
    queryKey: [NEWSLETTER_LIST_KEY],
    queryFn: () => newsletterQueries.getListInfo(),
  })
}

/** Historial de campañas recientes (panel admin). */
export function useNewsletterCampaigns(filters: GetCampaignsInput) {
  return useQuery({
    queryKey: [NEWSLETTER_CAMPAIGNS_KEY, filters],
    queryFn: () => newsletterQueries.getRecentCampaigns({ data: filters }),
  })
}

/** Suscripción pública desde la landing. */
export function useSubscribeNewsletter() {
  return useMutation({
    mutationFn: (input: SubscribeInput) =>
      newsletterMutations.subscribe({ data: input }),
  })
}

/** Envío real a toda la lista del boletín. */
export function useSendNewsletter() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: SendCampaignInput) =>
      newsletterMutations.sendCampaign({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NEWSLETTER_CAMPAIGNS_KEY] })
    },
  })
}
