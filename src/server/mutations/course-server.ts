import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { and, asc, eq, inArray, sql } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/server/db'
import {
  course,
  courseModule,
  lesson,
  lessonProgress,
  quizAttempt,
  quizAttemptAnswer,
  quizOption,
  quizQuestion,
} from '@/server/db/schema'
import {
  createCourseSchema,
  createLessonSchema,
  createModuleSchema,
  deleteCourseSchema,
  deleteLessonSchema,
  deleteModuleSchema,
  moveSchema,
  saveProgressSchema,
  submitQuizSchema,
  updateCourseSchema,
  updateLessonSchema,
  updateModuleSchema,
} from '@/server/validation/course'

async function ensureEditor() {
  const headers = getRequestHeaders()
  const session = await auth.api.getSession({ headers })
  if (
    !session ||
    (session.user.role !== 'admin' && session.user.role !== 'editor')
  ) {
    throw new Error('Unauthorized')
  }
  return session
}

async function ensureSession() {
  const headers = getRequestHeaders()
  const session = await auth.api.getSession({ headers })
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session
}

/**
 * Calcula el estado de completitud del curso para el usuario y lo compara
 * con el estado previo, para saber si JUSTO se completó el curso (con lo
 * que la UI muestra el popup de celebración una sola vez).
 */
async function courseCompletionState(
  courseId: string,
  userId: string,
): Promise<{
  totalLessons: number
  completedLessons: number
  completed: boolean
}> {
  const totals = await db
    .select({ id: lesson.id })
    .from(lesson)
    .innerJoin(courseModule, eq(lesson.moduleId, courseModule.id))
    .where(eq(courseModule.courseId, courseId))

  const lessonIds = totals.map((l) => l.id)
  const completedRows =
    lessonIds.length > 0
      ? await db
          .select({ lessonId: lessonProgress.lessonId })
          .from(lessonProgress)
          .where(
            and(
              eq(lessonProgress.userId, userId),
              eq(lessonProgress.status, 'completed'),
              inArray(lessonProgress.lessonId, lessonIds),
            ),
          )
      : []

  return {
    totalLessons: lessonIds.length,
    completedLessons: completedRows.length,
    completed:
      lessonIds.length > 0 && completedRows.length === lessonIds.length,
  }
}

/* ------------------------------- Cursos ------------------------------- */

const createCourse = createServerFn({ method: 'POST' })
  .validator(createCourseSchema)
  .handler(async ({ data }) => {
    const session = await ensureEditor()

    const [item] = await db
      .insert(course)
      .values({
        id: crypto.randomUUID(),
        title: data.title,
        slug: data.slug,
        status: data.status,
        description: data.description,
        coverImage: data.coverImage,
        authorId: session.user.id,
        publishedAt: data.status === 'published' ? new Date() : null,
      })
      .returning()

    return item
  })

const updateCourse = createServerFn({ method: 'POST' })
  .validator(updateCourseSchema)
  .handler(async ({ data }) => {
    await ensureEditor()

    const { id, ...fields } = data
    const updateData: Record<string, unknown> = {}
    if (fields.title !== undefined) updateData.title = fields.title
    if (fields.slug !== undefined) updateData.slug = fields.slug
    if (fields.description !== undefined)
      updateData.description = fields.description
    if (fields.coverImage !== undefined)
      updateData.coverImage = fields.coverImage
    if (fields.status !== undefined) {
      updateData.status = fields.status
      updateData.publishedAt =
        fields.status === 'published'
          ? sql`COALESCE((SELECT published_at FROM course WHERE id = ${id}), unixepoch('subsecond') * 1000)`
          : null
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error('Sin cambios para guardar')
    }

    const [item] = await db
      .update(course)
      .set(updateData)
      .where(eq(course.id, id))
      .returning()

    return item
  })

const deleteCourse = createServerFn({ method: 'POST' })
  .validator(deleteCourseSchema)
  .handler(async ({ data }) => {
    await ensureEditor()

    await db.delete(course).where(eq(course.id, data.id))
    return { id: data.id }
  })

/* ------------------------------- Módulos ------------------------------- */

const createModule = createServerFn({ method: 'POST' })
  .validator(createModuleSchema)
  .handler(async ({ data }) => {
    await ensureEditor()

    // position al final si no se indica.
    const [{ value: current }] = await db
      .select({ value: sql<number>`count(*)` })
      .from(courseModule)
      .where(eq(courseModule.courseId, data.courseId))

    const [item] = await db
      .insert(courseModule)
      .values({
        id: crypto.randomUUID(),
        courseId: data.courseId,
        title: data.title,
        position: data.position ?? current,
      })
      .returning()

    return item
  })

const updateModule = createServerFn({ method: 'POST' })
  .validator(updateModuleSchema)
  .handler(async ({ data }) => {
    await ensureEditor()

    const { id, ...fields } = data
    const [item] = await db
      .update(courseModule)
      .set(fields)
      .where(eq(courseModule.id, id))
      .returning()

    return item
  })

const deleteModule = createServerFn({ method: 'POST' })
  .validator(deleteModuleSchema)
  .handler(async ({ data }) => {
    await ensureEditor()

    await db.delete(courseModule).where(eq(courseModule.id, data.id))
    return { id: data.id }
  })

/** Mueve un módulo una posición (swap con su vecino dentro del curso). */
const moveModule = createServerFn({ method: 'POST' })
  .validator(moveSchema)
  .handler(async ({ data }) => {
    await ensureEditor()

    const current = (
      await db.select().from(courseModule).where(eq(courseModule.id, data.id))
    ).at(0)
    if (!current) throw new Error('Módulo no encontrado')

    const siblings = await db
      .select()
      .from(courseModule)
      .where(eq(courseModule.courseId, current.courseId))
      .orderBy(asc(courseModule.position))
    const index = siblings.findIndex((m) => m.id === data.id)
    const target = siblings.at(index + data.direction)
    if (!target) return { ok: true }

    await db
      .update(courseModule)
      .set({ position: target.position })
      .where(eq(courseModule.id, current.id))
    await db
      .update(courseModule)
      .set({ position: current.position })
      .where(eq(courseModule.id, target.id))

    return { ok: true }
  })

/* ------------------------------ Lecciones ------------------------------ */

const createLesson = createServerFn({ method: 'POST' })
  .validator(createLessonSchema)
  .handler(async ({ data }) => {
    await ensureEditor()

    const [{ value: current }] = await db
      .select({ value: sql<number>`count(*)` })
      .from(lesson)
      .where(eq(lesson.moduleId, data.moduleId))

    const [item] = await db
      .insert(lesson)
      .values({
        id: crypto.randomUUID(),
        moduleId: data.moduleId,
        title: data.title,
        type: data.type,
        position: data.position ?? current,
        content: data.type === 'reading' ? [] : null,
      })
      .returning()

    return item
  })

/**
 * Actualiza una lección. Para quizzes, `questions` reemplaza TODAS las
 * preguntas y opciones (borrado y re-inserción en una transacción implícita
 * por batch de SQLite).
 */
const updateLesson = createServerFn({ method: 'POST' })
  .validator(updateLessonSchema)
  .handler(async ({ data }) => {
    await ensureEditor()

    const { id, ...fields } = data
    const existing = (
      await db.select().from(lesson).where(eq(lesson.id, id))
    ).at(0)
    if (!existing) throw new Error('Lección no encontrada')

    const updateData: Record<string, unknown> = {}
    if (fields.title !== undefined) updateData.title = fields.title
    if (fields.passingScore !== undefined)
      updateData.passingScore = fields.passingScore
    if (fields.content !== undefined) {
      if (existing.type !== 'reading') {
        throw new Error('Solo las lecciones de lectura tienen contenido')
      }
      updateData.content = fields.content
    }

    if (Object.keys(updateData).length > 0) {
      await db.update(lesson).set(updateData).where(eq(lesson.id, id))
    }

    if (fields.questions !== undefined) {
      if (existing.type !== 'quiz') {
        throw new Error('Solo las lecciones de quiz tienen preguntas')
      }
      // Reemplazo completo: borrar y re-insertar.
      await db.delete(quizQuestion).where(eq(quizQuestion.lessonId, id))
      if (fields.questions.length > 0) {
        const optionRows: Array<typeof quizOption.$inferInsert> = []
        for (const [qIndex, q] of fields.questions.entries()) {
          const questionId = crypto.randomUUID()
          await db.insert(quizQuestion).values({
            id: questionId,
            lessonId: id,
            text: q.text,
            position: qIndex,
          })
          for (const o of q.options) {
            optionRows.push({
              id: crypto.randomUUID(),
              questionId,
              text: o.text,
              isCorrect: o.isCorrect,
            })
          }
        }
        await db.insert(quizOption).values(optionRows)
      }
    }

    const [item] = await db.select().from(lesson).where(eq(lesson.id, id))
    return item
  })

const deleteLesson = createServerFn({ method: 'POST' })
  .validator(deleteLessonSchema)
  .handler(async ({ data }) => {
    await ensureEditor()

    await db.delete(lesson).where(eq(lesson.id, data.id))
    return { id: data.id }
  })

/** Mueve una lección una posición (swap dentro de su módulo). */
const moveLesson = createServerFn({ method: 'POST' })
  .validator(moveSchema)
  .handler(async ({ data }) => {
    await ensureEditor()

    const current = (
      await db.select().from(lesson).where(eq(lesson.id, data.id))
    ).at(0)
    if (!current) throw new Error('Lección no encontrada')

    const siblings = await db
      .select()
      .from(lesson)
      .where(eq(lesson.moduleId, current.moduleId))
      .orderBy(asc(lesson.position))
    const index = siblings.findIndex((l) => l.id === data.id)
    const target = siblings.at(index + data.direction)
    if (!target) return { ok: true }

    await db
      .update(lesson)
      .set({ position: target.position })
      .where(eq(lesson.id, current.id))
    await db
      .update(lesson)
      .set({ position: current.position })
      .where(eq(lesson.id, target.id))

    return { ok: true }
  })

/* ------------------------- Progreso del estudiante ------------------------- */

/**
 * Guarda el progreso de una lección. Se usa con status "completed" cuando el
 * estudiante llega al final de una lectura (auto-detectado en la UI) o con
 * "in_progress" al empezar. Devuelve `courseJustCompleted` para el popup.
 */
const saveLessonProgress = createServerFn({ method: 'POST' })
  .validator(saveProgressSchema)
  .handler(async ({ data }) => {
    const session = await ensureSession()

    const existing = (
      await db
        .select()
        .from(lessonProgress)
        .where(
          and(
            eq(lessonProgress.userId, session.user.id),
            eq(lessonProgress.lessonId, data.lessonId),
          ),
        )
    ).at(0)

    // Ya completada: nada que cambiar (idempotente).
    if (existing?.status === 'completed') {
      return { courseJustCompleted: false, status: 'completed' as const }
    }

    if (existing) {
      await db
        .update(lessonProgress)
        .set({
          status: data.status,
          lastAccessedAt: new Date(),
          ...(data.status === 'completed' ? { completedAt: new Date() } : {}),
        })
        .where(eq(lessonProgress.id, existing.id))
    } else {
      await db.insert(lessonProgress).values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        lessonId: data.lessonId,
        status: data.status,
        ...(data.status === 'completed' ? { completedAt: new Date() } : {}),
      })
    }

    // ¿Se completó el curso justo ahora?
    const item = (
      await db
        .select({ courseId: courseModule.courseId })
        .from(lesson)
        .innerJoin(courseModule, eq(lesson.moduleId, courseModule.id))
        .where(eq(lesson.id, data.lessonId))
    ).at(0)

    if (!item) {
      return { courseJustCompleted: false, status: data.status }
    }

    const state = await courseCompletionState(item.courseId, session.user.id)
    // La lección ya quedó registrada (el early return de arriba evita que se
    // repita el popup si ya estaba completada).
    const courseJustCompleted =
      data.status === 'completed' &&
      state.totalLessons > 0 &&
      state.completedLessons === state.totalLessons

    return { courseJustCompleted, status: data.status }
  })

/**
 * Envía un quiz. Sin límite de reintentos: cada envío crea un intento nuevo.
 * La corrección ocurre SIEMPRE en el servidor (el cliente envía solo las
 * opciones elegidas). Si aprueba, marca la lección como completada.
 */
const submitQuiz = createServerFn({ method: 'POST' })
  .validator(submitQuizSchema)
  .handler(async ({ data }) => {
    const session = await ensureSession()

    const item = (
      await db.select().from(lesson).where(eq(lesson.id, data.lessonId))
    ).at(0)
    if (!item || item.type !== 'quiz') {
      throw new Error('Lección de quiz no encontrada')
    }

    // Clave de respuestas correctas.
    const questions = await db
      .select()
      .from(quizQuestion)
      .where(eq(quizQuestion.lessonId, item.id))
    const questionIds = questions.map((q) => q.id)

    const correctRows =
      questionIds.length > 0
        ? await db
            .select({ questionId: quizOption.questionId, id: quizOption.id })
            .from(quizOption)
            .where(
              and(
                inArray(quizOption.questionId, questionIds),
                eq(quizOption.isCorrect, true),
              ),
            )
        : []

    const correctByQuestion = new Map(
      correctRows.map((r) => [r.questionId, r.id]),
    )

    // Las preguntas deben pertenecer a esta lección.
    const validQuestionIds = new Set(questionIds)

    const attemptId = crypto.randomUUID()
    const answers = data.answers
      .filter((a) => validQuestionIds.has(a.questionId))
      .map((a) => ({
        questionId: a.questionId,
        selectedOptionId: a.optionId,
        isCorrect: correctByQuestion.get(a.questionId) === a.optionId,
      }))

    if (answers.length === 0) {
      throw new Error('Respuestas inválidas')
    }

    const correctCount = answers.filter((a) => a.isCorrect).length
    const score = Math.round((correctCount / questions.length) * 100)
    const passed = score >= item.passingScore

    await db.insert(quizAttempt).values({
      id: attemptId,
      userId: session.user.id,
      lessonId: item.id,
      score,
      passed,
    })

    await db.insert(quizAttemptAnswer).values(
      answers.map((a) => ({
        id: crypto.randomUUID(),
        attemptId,
        questionId: a.questionId,
        selectedOptionId: a.selectedOptionId,
        isCorrect: a.isCorrect,
      })),
    )

    // Si aprobó, marca la lección completada y calcula si el curso se acaba
    // de terminar (para el popup).
    let courseJustCompleted = false
    if (passed) {
      await saveLessonProgressInternal(session.user.id, item.id, 'completed')
      const mod = (
        await db
          .select({ courseId: courseModule.courseId })
          .from(courseModule)
          .where(eq(courseModule.id, item.moduleId))
      ).at(0)
      if (mod) {
        const state = await courseCompletionState(mod.courseId, session.user.id)
        courseJustCompleted = state.completed
      }
    }

    return {
      attemptId,
      score,
      passed,
      passingScore: item.passingScore,
      courseJustCompleted,
    }
  })

/** Upsert interno de progreso (compartido por progreso manual y quiz). */
async function saveLessonProgressInternal(
  userId: string,
  lessonId: string,
  status: 'in_progress' | 'completed',
) {
  const existing = (
    await db
      .select()
      .from(lessonProgress)
      .where(
        and(
          eq(lessonProgress.userId, userId),
          eq(lessonProgress.lessonId, lessonId),
        ),
      )
  ).at(0)

  if (existing?.status === 'completed') return

  if (existing) {
    await db
      .update(lessonProgress)
      .set({
        status,
        lastAccessedAt: new Date(),
        ...(status === 'completed' ? { completedAt: new Date() } : {}),
      })
      .where(eq(lessonProgress.id, existing.id))
  } else {
    await db.insert(lessonProgress).values({
      id: crypto.randomUUID(),
      userId,
      lessonId,
      status,
      ...(status === 'completed' ? { completedAt: new Date() } : {}),
    })
  }
}

export const courseMutations = {
  createCourse,
  updateCourse,
  deleteCourse,
  createModule,
  updateModule,
  deleteModule,
  moveModule,
  createLesson,
  updateLesson,
  deleteLesson,
  moveLesson,
  saveLessonProgress,
  submitQuiz,
}
