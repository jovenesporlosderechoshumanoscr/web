import { describe, expect, test } from 'vitest'
import {
  IMAGE_ACCEPT,
  IMAGE_MIME_TYPES,
  postBlockSchema,
  postBlocksSchema,
  slugSchema,
  slugify,
  uploadImageSchema,
} from '@/server/validation/blog'

describe('slugify', () => {
  test('convierte a minúsculas y reemplaza espacios por guiones', () => {
    expect(slugify('Hola Mundo')).toBe('hola-mundo')
  })

  test('quita acentos (NFD)', () => {
    expect(slugify('Derechos Humanos en América')).toBe(
      'derechos-humanos-en-america',
    )
    expect(slugify('¿Qué son los derechos?')).toBe('que-son-los-derechos')
  })

  test('elimina signos y símbolos', () => {
    expect(slugify('¡Hola, mundo!')).toBe('hola-mundo')
  })

  test('colapsa guiones repetidos y recorta extremos', () => {
    expect(slugify('  hola   --  mundo  ')).toBe('hola-mundo')
  })

  test('limita el resultado a 100 caracteres', () => {
    const slug = slugify('a'.repeat(300))
    expect(slug).toHaveLength(100)
  })

  test('cadenas sin caracteres válidos quedan vacías', () => {
    expect(slugify('???')).toBe('')
  })
})

describe('slugSchema', () => {
  test('acepta slugs válidos', () => {
    for (const slug of ['hola', 'hola-mundo', 'articulo-1-de-ley-10030']) {
      expect(slugSchema.safeParse(slug).success).toBe(true)
    }
  })

  test('rechaza vacío, mayúsculas, espacios y guiones al inicio/final', () => {
    expect(slugSchema.safeParse('').success).toBe(false)
    expect(slugSchema.safeParse('Hola').success).toBe(false)
    expect(slugSchema.safeParse('hola mundo').success).toBe(false)
    expect(slugSchema.safeParse('-hola').success).toBe(false)
    expect(slugSchema.safeParse('hola-').success).toBe(false)
    expect(slugSchema.safeParse('hola--mundo').success).toBe(false)
  })

  test('rechaza slugs demasiado largos', () => {
    expect(slugSchema.safeParse('a'.repeat(101)).success).toBe(false)
  })
})

describe('postBlockSchema', () => {
  test('heading usa h2 y spacing md por defecto', () => {
    const result = postBlockSchema.parse({ type: 'heading', text: 'Título' })
    expect(result).toEqual({
      type: 'heading',
      text: 'Título',
      level: 'h2',
      spacing: 'md',
    })
  })

  test('heading permite h3 y niveles inválidos se rechazan', () => {
    expect(
      postBlockSchema.safeParse({ type: 'heading', text: 'T', level: 'h4' })
        .success,
    ).toBe(false)
  })

  test('párrafo vacío o solo espacios se rechaza', () => {
    expect(
      postBlockSchema.safeParse({ type: 'paragraph', text: '' }).success,
    ).toBe(false)
    expect(
      postBlockSchema.safeParse({ type: 'paragraph', text: '   ' }).success,
    ).toBe(false)
  })

  test('párrafo hace trim del texto', () => {
    const result = postBlockSchema.parse({
      type: 'paragraph',
      text: '  hola  ',
    })
    expect(result).toMatchObject({ text: 'hola' })
  })

  test('imagen permite alt vacío por defecto', () => {
    const result = postBlockSchema.parse({ type: 'image', url: '/media/x.png' })
    expect(result).toMatchObject({
      url: '/media/x.png',
      alt: '',
      spacing: 'md',
    })
  })

  test('video acepta los formatos de YouTube', () => {
    for (const url of [
      'https://www.youtube.com/watch?v=abc123',
      'https://youtube.com/watch?v=abc123',
      'https://youtu.be/abc123',
      'https://www.youtube.com/embed/abc123',
    ]) {
      expect(postBlockSchema.safeParse({ type: 'video', url }).success).toBe(
        true,
      )
    }
  })

  test('video rechaza URLs que no sean de YouTube https', () => {
    for (const url of [
      'https://vimeo.com/123456',
      'http://www.youtube.com/watch?v=abc123',
      'https://youtube.com/watch',
      'javascript:alert(1)',
      'https://malicioso.com/watch?v=abc123',
    ]) {
      expect(postBlockSchema.safeParse({ type: 'video', url }).success).toBe(
        false,
      )
    }
  })

  test('spacing válido y rechazo de valores desconocidos', () => {
    expect(
      postBlockSchema.safeParse({ type: 'paragraph', text: 'x', spacing: 'lg' })
        .success,
    ).toBe(true)
    expect(
      postBlockSchema.safeParse({
        type: 'paragraph',
        text: 'x',
        spacing: 'xxl',
      }).success,
    ).toBe(false)
  })
})

describe('postBlocksSchema', () => {
  test('rechaza un array vacío: la página necesita al menos un bloque', () => {
    const result = postBlocksSchema.safeParse([])
    expect(result.success).toBe(false)
  })

  test('acepta una lista de bloques válidos', () => {
    const result = postBlocksSchema.safeParse([
      { type: 'heading', text: 'Título' },
      { type: 'paragraph', text: 'Contenido' },
    ])
    expect(result.success).toBe(true)
  })
})

describe('uploadImageSchema', () => {
  function file(type: string, size: number): File {
    return new File([new ArrayBuffer(size)], 'imagen', { type })
  }

  test('acepta los MIME types de imagen declarados', () => {
    for (const type of IMAGE_MIME_TYPES) {
      expect(
        uploadImageSchema.safeParse({ file: file(type, 100) }).success,
      ).toBe(true)
    }
  })

  test('accept del input file coincide con los MIME types', () => {
    expect(IMAGE_ACCEPT).toBe(IMAGE_MIME_TYPES.join(','))
  })

  test('rechaza un archivo vacío', () => {
    expect(
      uploadImageSchema.safeParse({ file: file('image/png', 0) }).success,
    ).toBe(false)
  })

  test('rechaza archivos mayores a 5MB', () => {
    expect(
      uploadImageSchema.safeParse({
        file: file('image/png', 5 * 1024 * 1024 + 1),
      }).success,
    ).toBe(false)
  })

  test('rechaza SVG por riesgo XSS', () => {
    expect(
      uploadImageSchema.safeParse({ file: file('image/svg+xml', 10) }).success,
    ).toBe(false)
  })

  test('rechaza tipos que no son imagen', () => {
    expect(
      uploadImageSchema.safeParse({ file: file('application/pdf', 10) })
        .success,
    ).toBe(false)
  })
})
