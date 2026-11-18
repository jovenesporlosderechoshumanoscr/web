import { describe, expect, test } from 'vitest'
import {
  createLessonSchema,
  createModuleSchema,
  getCoursesSchema,
  moveSchema,
  submitQuizSchema,
  updateLessonSchema,
} from '@/server/validation/course'

describe('getCoursesSchema', () => {
  test('aplica defaults de paginación', () => {
    expect(getCoursesSchema.parse({})).toMatchObject({ page: 1, limit: 10 })
  })

  test('convierte page/limit de string a número (querystring)', () => {
    expect(getCoursesSchema.parse({ page: '2', limit: '20' })).toMatchObject({
      page: 2,
      limit: 20,
    })
  })

  test('rechaza paginación inválida', () => {
    expect(getCoursesSchema.safeParse({ page: 0 }).success).toBe(false)
    expect(getCoursesSchema.safeParse({ limit: 101 }).success).toBe(false)
    expect(getCoursesSchema.safeParse({ status: 'archivado' }).success).toBe(
      false,
    )
  })
})

describe('createModuleSchema', () => {
  test('position es opcional y acepta 0', () => {
    expect(
      createModuleSchema.parse({ courseId: 'c1', title: 'M' }),
    ).not.toHaveProperty('position')
    expect(
      createModuleSchema.parse({ courseId: 'c1', title: 'M', position: 0 }),
    ).toMatchObject({ position: 0 })
  })

  test('rechaza título vacío y position negativa', () => {
    expect(
      createModuleSchema.safeParse({ courseId: 'c1', title: '  ' }).success,
    ).toBe(false)
    expect(
      createModuleSchema.safeParse({ courseId: 'c1', title: 'M', position: -1 })
        .success,
    ).toBe(false)
  })
})

describe('createLessonSchema', () => {
  test('type por defecto es reading', () => {
    expect(
      createLessonSchema.parse({ moduleId: 'm1', title: 'L' }),
    ).toMatchObject({ type: 'reading' })
  })

  test('acepta quiz y rechaza tipos desconocidos', () => {
    expect(
      createLessonSchema.parse({ moduleId: 'm1', title: 'L', type: 'quiz' })
        .type,
    ).toBe('quiz')
    expect(
      createLessonSchema.safeParse({
        moduleId: 'm1',
        title: 'L',
        type: 'video',
      }).success,
    ).toBe(false)
  })
})

describe('moveSchema', () => {
  test('solo acepta -1 y 1', () => {
    expect(moveSchema.safeParse({ id: 'x', direction: -1 }).success).toBe(true)
    expect(moveSchema.safeParse({ id: 'x', direction: 1 }).success).toBe(true)
  })

  test('rechaza otras direcciones', () => {
    expect(moveSchema.safeParse({ id: 'x', direction: 0 }).success).toBe(false)
    expect(moveSchema.safeParse({ id: 'x', direction: 2 }).success).toBe(false)
    expect(moveSchema.safeParse({ id: 'x', direction: 'up' }).success).toBe(
      false,
    )
  })
})

describe('updateLessonSchema', () => {
  test('solo id: "sin cambios para guardar"', () => {
    expect(updateLessonSchema.safeParse({ id: 'l1' }).success).toBe(false)
  })

  test('con algún campo además del id es válido', () => {
    expect(
      updateLessonSchema.safeParse({ id: 'l1', title: 'Nueva' }).success,
    ).toBe(true)
  })

  test('estimatedMinutes null significa "modo automático"', () => {
    const result = updateLessonSchema.safeParse({
      id: 'l1',
      estimatedMinutes: null,
    })
    expect(result.success).toBe(true)
  })

  test('estimatedMinutes fuera de rango se rechaza', () => {
    expect(
      updateLessonSchema.safeParse({ id: 'l1', estimatedMinutes: 0 }).success,
    ).toBe(false)
    expect(
      updateLessonSchema.safeParse({ id: 'l1', estimatedMinutes: 601 }).success,
    ).toBe(false)
  })

  test('passingScore fuera de 0-100 se rechaza', () => {
    expect(
      updateLessonSchema.safeParse({ id: 'l1', passingScore: -1 }).success,
    ).toBe(false)
    expect(
      updateLessonSchema.safeParse({ id: 'l1', passingScore: 101 }).success,
    ).toBe(false)
    expect(
      updateLessonSchema.safeParse({ id: 'l1', passingScore: 100 }).success,
    ).toBe(true)
  })

  test('cada pregunta necesita al menos una opción correcta', () => {
    const base = {
      id: 'l1',
      questions: [
        {
          text: '¿2+2?',
          options: [
            { text: '3', isCorrect: false },
            { text: '4', isCorrect: true },
          ],
        },
      ],
    }
    expect(updateLessonSchema.safeParse(base).success).toBe(true)

    const sinCorrecta = {
      id: 'l1',
      questions: [
        {
          text: '¿2+2?',
          options: [
            { text: '3', isCorrect: false },
            { text: '5', isCorrect: false },
          ],
        },
      ],
    }
    expect(updateLessonSchema.safeParse(sinCorrecta).success).toBe(false)
  })

  test('cada pregunta necesita entre 2 y 6 opciones', () => {
    const una = {
      id: 'l1',
      questions: [{ text: 'P', options: [{ text: 'A', isCorrect: true }] }],
    }
    expect(updateLessonSchema.safeParse(una).success).toBe(false)

    const siete = {
      id: 'l1',
      questions: [
        {
          text: 'P',
          options: Array.from({ length: 7 }, (_, i) => ({
            text: `O${i}`,
            isCorrect: i === 0,
          })),
        },
      ],
    }
    expect(updateLessonSchema.safeParse(siete).success).toBe(false)
  })

  test('rechaza más de 50 preguntas', () => {
    const preguntas = Array.from({ length: 51 }, (_, i) => ({
      text: `P${i}`,
      options: [
        { text: 'A', isCorrect: true },
        { text: 'B', isCorrect: false },
      ],
    }))
    expect(
      updateLessonSchema.safeParse({ id: 'l1', questions: preguntas }).success,
    ).toBe(false)
  })

  test('las opciones correctas se normalizan (default false)', () => {
    const result = updateLessonSchema.parse({
      id: 'l1',
      questions: [
        {
          text: 'P',
          options: [{ text: 'A', isCorrect: true }, { text: 'B' }],
        },
      ],
    })
    expect(result.questions?.[0].options[1]).toEqual({
      text: 'B',
      isCorrect: false,
    })
  })
})

describe('submitQuizSchema', () => {
  test('rechaza envíos sin respuestas', () => {
    expect(
      submitQuizSchema.safeParse({ lessonId: 'l1', answers: [] }).success,
    ).toBe(false)
  })

  test('acepta respuestas con questionId y optionId', () => {
    const result = submitQuizSchema.safeParse({
      lessonId: 'l1',
      answers: [{ questionId: 'q1', optionId: 'o1' }],
    })
    expect(result.success).toBe(true)
  })

  test('rechaza ids vacíos', () => {
    expect(
      submitQuizSchema.safeParse({
        lessonId: '',
        answers: [{ questionId: 'q', optionId: 'o' }],
      }).success,
    ).toBe(false)
  })
})
