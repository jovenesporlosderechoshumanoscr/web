import { describe, expect, test } from 'vitest'
import type { PostBlock } from '@/server/validation/blog'
import {
  estimateLessonMinutes,
  formatEstimated,
  formatMinutes,
} from '@/lib/lesson-duration'

/** Construye un bloque de párrafo con la cantidad de palabras indicada. */
function parrafo(words: number): PostBlock {
  return { type: 'paragraph', text: Array(words).fill('x').join(' ') }
}

describe('estimateLessonMinutes', () => {
  test('contenido vacío: mínimo 2 minutos', () => {
    expect(estimateLessonMinutes({ type: 'reading', content: [] })).toBe(2)
    expect(estimateLessonMinutes({ type: 'reading', content: null })).toBe(2)
    expect(estimateLessonMinutes({ type: 'reading' })).toBe(2)
  })

  test('el mínimo de 2 minutos gana sobre la lectura corta', () => {
    expect(
      estimateLessonMinutes({ type: 'reading', content: [parrafo(199)] }),
    ).toBe(2)
    expect(
      estimateLessonMinutes({ type: 'reading', content: [parrafo(200)] }),
    ).toBe(2)
  })

  test('401 palabras → 3 minutos (redondeo hacia arriba)', () => {
    expect(
      estimateLessonMinutes({ type: 'reading', content: [parrafo(401)] }),
    ).toBe(3)
  })

  test('las imágenes suman 1 min por cada 3', () => {
    const imagenes = (n: number): PostBlock[] =>
      Array.from({ length: n }, () => ({
        type: 'image',
        url: '/media/x.png',
        alt: '',
      }))
    // Con pocas imágenes el mínimo de 2 minutos enmascara el cálculo,
    // así que se combina con una lectura de 3 min para ver la diferencia.
    const lectura3min: PostBlock[] = [parrafo(600)]
    expect(
      estimateLessonMinutes({
        type: 'reading',
        content: [...lectura3min, ...imagenes(2)],
      }),
    ).toBe(4)
    expect(
      estimateLessonMinutes({
        type: 'reading',
        content: [...lectura3min, ...imagenes(3)],
      }),
    ).toBe(4)
    expect(
      estimateLessonMinutes({
        type: 'reading',
        content: [...lectura3min, ...imagenes(4)],
      }),
    ).toBe(5)
    expect(
      estimateLessonMinutes({
        type: 'reading',
        content: [...lectura3min, ...imagenes(6)],
      }),
    ).toBe(5)
  })

  test('cada video suma 5 minutos', () => {
    const video = (url: string): PostBlock => ({ type: 'video', url })
    expect(
      estimateLessonMinutes({
        type: 'reading',
        content: [video('https://youtu.be/x')],
      }),
    ).toBe(5)
    expect(
      estimateLessonMinutes({
        type: 'reading',
        content: [video('https://youtu.be/x'), video('https://youtu.be/y')],
      }),
    ).toBe(10)
  })

  test('heading y párrafo cuentan palabras; image/video no', () => {
    const content: PostBlock[] = [
      { type: 'heading', text: 'un dos tres', level: 'h2' },
      parrafo(197),
      { type: 'image', url: '/media/x.png', alt: '' },
    ]
    // 200 palabras → 1 min de lectura + 0 de imágenes → mínimo 2.
    expect(estimateLessonMinutes({ type: 'reading', content })).toBe(2)
  })

  test('quiz: 2 min base + 1 min por pregunta, con mínimo de 3', () => {
    expect(estimateLessonMinutes({ type: 'quiz' })).toBe(3)
    expect(estimateLessonMinutes({ type: 'quiz', questionCount: 0 })).toBe(3)
    expect(estimateLessonMinutes({ type: 'quiz', questionCount: 1 })).toBe(3)
    expect(estimateLessonMinutes({ type: 'quiz', questionCount: 2 })).toBe(4)
    expect(estimateLessonMinutes({ type: 'quiz', questionCount: 5 })).toBe(7)
  })
})

describe('formatMinutes', () => {
  test('null y undefined devuelven cadena vacía', () => {
    expect(formatMinutes(null)).toBe('')
    expect(formatMinutes(undefined)).toBe('')
  })

  test('menos de 60 minutos', () => {
    expect(formatMinutes(0)).toBe('0 min')
    expect(formatMinutes(1)).toBe('1 min')
    expect(formatMinutes(59)).toBe('59 min')
  })

  test('horas exactas sin resto', () => {
    expect(formatMinutes(60)).toBe('1 h')
    expect(formatMinutes(120)).toBe('2 h')
  })

  test('horas con resto', () => {
    expect(formatMinutes(61)).toBe('1 h 1 min')
    expect(formatMinutes(80)).toBe('1 h 20 min')
  })
})

describe('formatEstimated', () => {
  test('agrega el prefijo ≈ cuando hay duración', () => {
    expect(formatEstimated(25)).toBe('≈ 25 min')
    expect(formatEstimated(60)).toBe('≈ 1 h')
  })

  test('devuelve vacío sin duración', () => {
    expect(formatEstimated(null)).toBe('')
    expect(formatEstimated(undefined)).toBe('')
  })
})
