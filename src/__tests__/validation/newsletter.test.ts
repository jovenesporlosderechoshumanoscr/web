import { describe, expect, test } from 'vitest'
import {
  getCampaignsSchema,
  sendCampaignSchema,
  subscribeSchema,
} from '@/server/validation/newsletter'

describe('subscribeSchema', () => {
  test('acepta emails válidos y hace trim', () => {
    expect(
      subscribeSchema.parse({ email: '  persona@ejemplo.com  ' }).email,
    ).toBe('persona@ejemplo.com')
  })

  test('rechaza emails inválidos y demasiado largos', () => {
    expect(subscribeSchema.safeParse({ email: 'no-es-email' }).success).toBe(
      false,
    )
    expect(
      subscribeSchema.safeParse({ email: `${'a'.repeat(250)}@x.com` }).success,
    ).toBe(false)
  })
})

describe('sendCampaignSchema', () => {
  const base = {
    subject: 'Boletín de noviembre',
    previewText: 'Novedades del mes',
    content: 'Este es el cuerpo del boletín con más de diez caracteres.',
  }

  test('acepta una campaña válida', () => {
    expect(sendCampaignSchema.safeParse(base).success).toBe(true)
  })

  test('asunto demasiado corto o demasiado largo se rechaza', () => {
    expect(
      sendCampaignSchema.safeParse({ ...base, subject: 'ab' }).success,
    ).toBe(false)
    expect(
      sendCampaignSchema.safeParse({ ...base, subject: 'a'.repeat(151) })
        .success,
    ).toBe(false)
  })

  test('cuerpo demasiado corto o demasiado largo se rechaza', () => {
    expect(
      sendCampaignSchema.safeParse({ ...base, content: 'corta' }).success,
    ).toBe(false)
    expect(
      sendCampaignSchema.safeParse({ ...base, content: 'a'.repeat(20_001) })
        .success,
    ).toBe(false)
  })

  test('previewText admite vacío pero no más de 150 caracteres', () => {
    expect(
      sendCampaignSchema.safeParse({ ...base, previewText: '' }).success,
    ).toBe(true)
    expect(
      sendCampaignSchema.safeParse({ ...base, previewText: 'a'.repeat(151) })
        .success,
    ).toBe(false)
  })
})

describe('getCampaignsSchema', () => {
  test('defaults: limit 10, offset 0', () => {
    expect(getCampaignsSchema.parse({})).toEqual({ limit: 10, offset: 0 })
  })

  test('limit máximo 50 y offset no negativo', () => {
    expect(getCampaignsSchema.safeParse({ limit: 51 }).success).toBe(false)
    expect(getCampaignsSchema.safeParse({ offset: -1 }).success).toBe(false)
    expect(
      getCampaignsSchema.safeParse({ limit: 50, offset: 10 }).success,
    ).toBe(true)
  })
})
