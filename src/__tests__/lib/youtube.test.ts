import { describe, expect, test } from 'vitest'
import { youtubeEmbedUrl } from '@/lib/youtube'

describe('youtubeEmbedUrl', () => {
  test('watch?v=ID se convierte a embed', () => {
    expect(youtubeEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
    )
  })

  test('youtu.be/ID se convierte a embed', () => {
    expect(youtubeEmbedUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
    )
  })

  test('embed/ se conserva como embed', () => {
    expect(youtubeEmbedUrl('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe(
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
    )
  })

  test('watch con parámetros extra toma el id correcto', () => {
    expect(
      youtubeEmbedUrl('https://www.youtube.com/watch?v=abc123&t=30s'),
    ).toBe('https://www.youtube.com/embed/abc123')
  })

  test('URL sin id de video conocida se devuelve sin cambios', () => {
    expect(youtubeEmbedUrl('https://www.youtube.com/')).toBe(
      'https://www.youtube.com/',
    )
  })

  test('URL de otro proveedor (Vimeo) se devuelve sin cambios', () => {
    expect(youtubeEmbedUrl('https://vimeo.com/123456')).toBe(
      'https://vimeo.com/123456',
    )
  })
})
