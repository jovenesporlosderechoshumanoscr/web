import { z } from 'zod'

/**
 * Boletín informativo. Los suscriptores NO se guardan en D1:
 * Brevo es la única fuente de verdad.
 */
export const subscribeSchema = z.object({
  email: z.string().trim().email('Email inválido').max(255),
})

export type SubscribeInput = z.infer<typeof subscribeSchema>

export const sendCampaignSchema = z.object({
  subject: z.string().trim().min(3, 'El asunto es muy corto').max(150),
  previewText: z.string().trim().max(150),
  content: z.string().trim().min(10, 'El cuerpo es muy corto').max(20_000),
})

export type SendCampaignInput = z.infer<typeof sendCampaignSchema>

export const getCampaignsSchema = z.object({
  limit: z.number().int().min(1).max(50).default(10),
  offset: z.number().int().min(0).default(0),
})

export type GetCampaignsInput = z.infer<typeof getCampaignsSchema>
