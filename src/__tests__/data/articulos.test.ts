import { describe, expect, test } from 'vitest'
import { REFLEXION, articulos } from '@/data/articulos'
import { courseModules } from '@/lib/course'

describe('articulos (quiz de la DUDH)', () => {
  test('cada artículo tiene id único', () => {
    const ids = articulos.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('cada artículo tiene al menos 2 opciones', () => {
    for (const articulo of articulos) {
      expect(articulo.opciones.length).toBeGreaterThanOrEqual(2)
    }
  })

  test('el índice de la respuesta correcta está dentro del rango', () => {
    for (const articulo of articulos) {
      expect(articulo.correcta).toBeGreaterThanOrEqual(0)
      expect(articulo.correcta).toBeLessThan(articulo.opciones.length)
    }
  })

  test('todos los artículos tienen texto, pregunta y explicación', () => {
    for (const articulo of articulos) {
      expect(articulo.titulo.trim()).not.toBe('')
      expect(articulo.texto.trim()).not.toBe('')
      expect(articulo.pregunta.trim()).not.toBe('')
      expect(articulo.explicacion.trim()).not.toBe('')
    }
  })

  test('la constante de reflexión está definida', () => {
    expect(REFLEXION.trim()).not.toBe('')
  })
})

describe('courseModules (mock del sidebar)', () => {
  test('ids de módulo únicos y no vacíos', () => {
    const ids = courseModules.map((m) => m.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) {
      expect(id.trim()).not.toBe('')
    }
  })

  test('ningún módulo queda sin lecciones', () => {
    for (const modulo of courseModules) {
      expect(modulo.items.length).toBeGreaterThan(0)
    }
  })

  test('ids de lecciones únicos en todo el curso', () => {
    const ids = courseModules.flatMap((m) => m.items.map((i) => i.id))
    expect(new Set(ids).size).toBe(ids.length)
  })
})
