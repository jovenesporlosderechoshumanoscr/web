import { afterEach, describe, expect, test, vi } from 'vitest'
import {
  NEWSLETTER_LIMITS,
  renderNewsletterHtml,
  validateNewsletterInput,
} from '@/server/newsletter-template'

afterEach(() => {
  vi.useRealTimers()
})

describe('validateNewsletterInput', () => {
  test('acepta contenido y preview válidos', () => {
    expect(
      validateNewsletterInput({
        content: 'Hola a todos',
        previewText: 'Resumen',
      }),
    ).toBeNull()
  })

  test('rechaza cuerpo vacío o solo espacios', () => {
    expect(
      validateNewsletterInput({ content: '   ', previewText: '' }),
    ).toMatch(/vacío/)
  })

  test('rechaza cuerpo que supera el máximo', () => {
    const content = 'a'.repeat(NEWSLETTER_LIMITS.content + 1)
    expect(validateNewsletterInput({ content, previewText: '' })).toMatch(
      /máximo/,
    )
  })

  test('rechaza previewText que supera el máximo', () => {
    const previewText = 'a'.repeat(NEWSLETTER_LIMITS.previewText + 1)
    expect(
      validateNewsletterInput({
        content: 'contenido largo suficiente',
        previewText,
      }),
    ).toMatch(/pretexto/)
  })
})

describe('renderNewsletterHtml', () => {
  test('escapa HTML malicioso en el contenido (sin script ejecutable)', () => {
    const html = renderNewsletterHtml({
      content: '<script>alert(1)</script>',
      previewText: '',
    })
    expect(html).toContain('&lt;script&gt;')
    expect(html).not.toContain('<script>')
  })

  test('escapa &, comillas y apóstrofes', () => {
    const html = renderNewsletterHtml({
      content: 'Tom & Jerry "y" l\'audio',
      previewText: '',
    })
    expect(html).toContain('Tom &amp; Jerry &quot;y&quot; l&#39;audio')
  })

  test('el previewText del preheader también se escapa', () => {
    const html = renderNewsletterHtml({
      content: 'cuerpo',
      previewText: '<b>negrita</b>',
    })
    expect(html).toContain('&lt;b&gt;negrita&lt;/b&gt;')
  })

  test('separa párrafos por línea en blanco', () => {
    const html = renderNewsletterHtml({
      content: 'Primero\n\nSegundo',
      previewText: '',
    })
    expect(html).toContain('<p>Primero</p>')
    expect(html).toContain('<p>Segundo</p>')
  })

  test('los saltos simples dentro de un párrafo se vuelven <br />', () => {
    const html = renderNewsletterHtml({
      content: 'línea 1\nlínea 2',
      previewText: '',
    })
    expect(html).toContain('línea 1<br />línea 2')
  })

  test('conserva el marcador de baja {{ unsubscribe }}', () => {
    const html = renderNewsletterHtml({ content: 'cuerpo', previewText: '' })
    expect(html).toContain('{{ unsubscribe }}')
  })

  test('incluye el año actual en el pie (determinista con reloj simulado)', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2031-07-15T12:00:00.000Z'))
    const html = renderNewsletterHtml({ content: 'cuerpo', previewText: '' })
    expect(html).toContain('© 2031')
  })

  test('incluye los límites declarados en NEWSLETTER_LIMITS', () => {
    expect(NEWSLETTER_LIMITS).toMatchObject({
      subject: 150,
      content: 20_000,
      previewText: 150,
    })
  })

  test('el cuerpo queda dentro del contenedor de 600px típico de email', () => {
    const html = renderNewsletterHtml({ content: 'cuerpo', previewText: '' })
    expect(html).toContain('max-width:600px')
  })

  test('no inserta el contenido sin escapar en atributos href', () => {
    const html = renderNewsletterHtml({
      content: 'mira <a href="https://malicioso.com">esto</a>',
      previewText: '',
    })
    expect(html).not.toContain('href="https://malicioso.com"')
  })
})
