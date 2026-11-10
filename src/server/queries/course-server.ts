import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { and, asc, count, desc, eq, inArray, sql } from 'drizzle-orm'
import type { SQL } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/server/db'
import {
  course,
  courseModule,
  lesson,
  lessonProgress,
  quizAttempt,
  quizOption,
  quizQuestion,
} from '@/server/db/schema'
import {
  getCourseByIdSchema,
  getCourseBySlugSchema,
  getCoursesSchema,
  getEditorLessonSchema,
  getStudentLessonSchema,
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

/** Cualquier usuario autenticado (admin, editor o student). */
async function ensureSession() {
  const headers = getRequestHeaders()
  const session = await auth.api.getSession({ headers })
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session
}

/* ------------------------------ Admin / editor ------------------------------ */

const getCourses = createServerFn({ method: 'GET' })
  .validator(getCoursesSchema)
  .handler(async ({ data }) => {
    await ensureEditor()

    const { title, status, page, limit } = data
    const offset = (page - 1) * limit

    const filters: SQL[] = []
    if (title) {
      filters.push(sql`lower(${course.title}) like lower(${'%' + title + '%'})`)
    }
    if (status) {
      filters.push(eq(course.status, status))
    }
    const where = filters.length > 0 ? and(...filters) : undefined

    const [{ value: total }] = await db
      .select({ value: count() })
      .from(course)
      .where(where)

    const items = await db
      .select()
      .from(course)
      .where(where)
      .orderBy(desc(course.updatedAt))
      .limit(limit)
      .offset(offset)

    const totalPages = total === 0 ? 1 : Math.ceil(total / limit)

    return { items, total, page, limit, totalPages }
  })

/** Curso completo con su árbol de módulos y lecciones (para el editor). */
const getCourseById = createServerFn({ method: 'GET' })
  .validator(getCourseByIdSchema)
  .handler(async ({ data }) => {
    await ensureEditor()

    const rows = await db.select().from(course).where(eq(course.id, data.id))
    const item = rows.at(0)
    if (!item) return null

    const modules = await db
      .select()
      .from(courseModule)
      .where(eq(courseModule.courseId, data.id))
      .orderBy(asc(courseModule.position))

    const moduleIds = modules.map((m) => m.id)
    const lessons =
      moduleIds.length > 0
        ? await db
            .select()
            .from(lesson)
            .where(inArray(lesson.moduleId, moduleIds))
            .orderBy(asc(lesson.position))
        : []

    return {
      ...item,
      modules: modules.map((m) => ({
        ...m,
        lessons: lessons.filter((l) => l.moduleId === m.id),
      })),
    }
  })

/** Lección completa (con `isCorrect`) para el editor de quiz. */
const getEditorLesson = createServerFn({ method: 'GET' })
  .validator(getEditorLessonSchema)
  .handler(async ({ data }) => {
    await ensureEditor()

    const item = (
      await db.select().from(lesson).where(eq(lesson.id, data.lessonId))
    ).at(0)
    if (!item) return null

    const questions = await db
      .select()
      .from(quizQuestion)
      .where(eq(quizQuestion.lessonId, item.id))
      .orderBy(asc(quizQuestion.position))

    const questionIds = questions.map((q) => q.id)
    const options =
      questionIds.length > 0
        ? await db
            .select()
            .from(quizOption)
            .where(inArray(quizOption.questionId, questionIds))
            .orderBy(asc(quizOption.id))
        : []

    return {
      ...item,
      questions: questions.map((q) => ({
        ...q,
        options: options.filter((o) => o.questionId === q.id),
      })),
    }
  })

/* ----------------------------- Estudiantes ----------------------------- */

type LessonTreeNode = {
  id: string
  moduleId: string
  title: string
  type: 'reading' | 'quiz'
  position: number
  estimatedMinutes: number | null
}

/**
 * Lección donde continuar: la última visitada sin completar (por
 * lastAccessedAt) o, si no hay ninguna en progreso, la primera sin
 * completar; si todo está completado, la última lección.
 */
function pickContinueLesson(
  lessons: Array<{ id: string }>,
  progressByLesson: Map<string, { status: string; lastAccessedAt: Date }>,
): string | null {
  if (lessons.length === 0) return null

  const inProgress = lessons
    .filter((l) => progressByLesson.get(l.id)?.status === 'in_progress')
    .sort(
      (a, b) =>
        (progressByLesson.get(b.id)?.lastAccessedAt.getTime() ?? 0) -
        (progressByLesson.get(a.id)?.lastAccessedAt.getTime() ?? 0),
    )
  if (inProgress[0]) return inProgress[0].id

  const firstPending = lessons.find(
    (l) => progressByLesson.get(l.id)?.status !== 'completed',
  )
  if (firstPending) return firstPending.id

  return lessons[lessons.length - 1].id
}

/**
 * Curso publicado por slug con su árbol de módulos/lecciones y el progreso
 * del usuario autenticado (checklist + resumen de completitud).
 */
const getStudentCourse = createServerFn({ method: 'GET' })
  .validator(getCourseBySlugSchema)
  .handler(async ({ data }) => {
    const session = await ensureSession()

    const item = (
      await db
        .select()
        .from(course)
        .where(and(eq(course.slug, data.slug), eq(course.status, 'published')))
    ).at(0)
    if (!item) return null

    const modules = await db
      .select()
      .from(courseModule)
      .where(eq(courseModule.courseId, item.id))
      .orderBy(asc(courseModule.position))

    const moduleIds = modules.map((m) => m.id)
    const lessons: LessonTreeNode[] =
      moduleIds.length > 0
        ? await db
            .select({
              id: lesson.id,
              moduleId: lesson.moduleId,
              title: lesson.title,
              type: lesson.type,
              position: lesson.position,
              estimatedMinutes: lesson.estimatedMinutes,
            })
            .from(lesson)
            .where(inArray(lesson.moduleId, moduleIds))
            .orderBy(asc(lesson.position))
        : []

    const lessonIds = lessons.map((l) => l.id)
    const progressRows =
      lessonIds.length > 0
        ? await db
            .select()
            .from(lessonProgress)
            .where(
              and(
                eq(lessonProgress.userId, session.user.id),
                inArray(lessonProgress.lessonId, lessonIds),
              ),
            )
        : []

    const progressByLesson = new Map(progressRows.map((p) => [p.lessonId, p]))
    const completedLessons = progressRows.filter(
      (p) => p.status === 'completed',
    ).length
    const totalMinutes = lessons.reduce(
      (sum, l) => sum + (l.estimatedMinutes ?? 0),
      0,
    )
    const continueLessonId = pickContinueLesson(lessons, progressByLesson)

    return {
      ...item,
      modules: modules.map((m) => ({
        ...m,
        lessons: lessons
          .filter((l) => l.moduleId === m.id)
          .map((l) => ({
            ...l,
            progressStatus: progressByLesson.get(l.id)?.status ?? null,
            completedAt: progressByLesson.get(l.id)?.completedAt ?? null,
          })),
      })),
      summary: {
        totalLessons: lessons.length,
        completedLessons,
        completed: lessons.length > 0 && completedLessons === lessons.length,
        totalMinutes,
        continueLessonId,
      },
    }
  })

/** Lección donde continuar dentro de un curso (para el redirect de la raíz). */
const getCourseContinuePoint = createServerFn({ method: 'GET' })
  .validator(getCourseBySlugSchema)
  .handler(async ({ data }) => {
    const session = await ensureSession()

    const item = (
      await db
        .select({ id: course.id, slug: course.slug })
        .from(course)
        .where(and(eq(course.slug, data.slug), eq(course.status, 'published')))
    ).at(0)
    if (!item) return null

    const lessons = await db
      .select({ id: lesson.id })
      .from(lesson)
      .innerJoin(courseModule, eq(lesson.moduleId, courseModule.id))
      .where(eq(courseModule.courseId, item.id))
      .orderBy(asc(courseModule.position), asc(lesson.position))

    const progressRows =
      lessons.length > 0
        ? await db
            .select({
              lessonId: lessonProgress.lessonId,
              status: lessonProgress.status,
              lastAccessedAt: lessonProgress.lastAccessedAt,
            })
            .from(lessonProgress)
            .where(
              and(
                eq(lessonProgress.userId, session.user.id),
                inArray(
                  lessonProgress.lessonId,
                  lessons.map((l) => l.id),
                ),
              ),
            )
        : []

    const progressByLesson = new Map(progressRows.map((p) => [p.lessonId, p]))
    const lessonId = pickContinueLesson(lessons, progressByLesson)

    return lessonId ? { courseSlug: item.slug, lessonId } : null
  })

/**
 * Lección para el estudiante: contenido de lectura (sin claves correctas)
 * o preguntas de quiz sin marcar la respuesta válida, más progreso propio,
 * último intento y lecciones anterior/siguiente.
 */
const getStudentLesson = createServerFn({ method: 'GET' })
  .validator(getStudentLessonSchema)
  .handler(async ({ data }) => {
    const session = await ensureSession()

    const item = (
      await db.select().from(lesson).where(eq(lesson.id, data.lessonId))
    ).at(0)
    if (!item) return null

    const mod = (
      await db
        .select()
        .from(courseModule)
        .where(eq(courseModule.id, item.moduleId))
    ).at(0)
    if (!mod) return null

    const itemCourse = (
      await db.select().from(course).where(eq(course.id, mod.courseId))
    ).at(0)
    if (!itemCourse) return null

    // Los estudiantes solo ven lecciones de cursos publicados.
    if (
      itemCourse.status !== 'published' &&
      session.user.role !== 'admin' &&
      session.user.role !== 'editor'
    ) {
      throw new Error('Not found')
    }

    // Lectura: bloques. Quiz: preguntas SIN isCorrect.
    const questions =
      item.type === 'quiz'
        ? await db
            .select()
            .from(quizQuestion)
            .where(eq(quizQuestion.lessonId, item.id))
            .orderBy(asc(quizQuestion.position))
        : []

    const questionIds = questions.map((q) => q.id)
    const options =
      questionIds.length > 0
        ? await db
            .select({
              id: quizOption.id,
              questionId: quizOption.questionId,
              text: quizOption.text,
            })
            .from(quizOption)
            .where(inArray(quizOption.questionId, questionIds))
            .orderBy(asc(quizOption.id))
        : []

    // Progreso propio de la lección.
    const progress = (
      await db
        .select()
        .from(lessonProgress)
        .where(
          and(
            eq(lessonProgress.userId, session.user.id),
            eq(lessonProgress.lessonId, item.id),
          ),
        )
    ).at(0)

    // Último intento del quiz (para mostrar el resultado al volver).
    const lastAttempt = (
      await db
        .select({
          id: quizAttempt.id,
          score: quizAttempt.score,
          passed: quizAttempt.passed,
          submittedAt: quizAttempt.submittedAt,
        })
        .from(quizAttempt)
        .where(
          and(
            eq(quizAttempt.userId, session.user.id),
            eq(quizAttempt.lessonId, item.id),
          ),
        )
        .orderBy(desc(quizAttempt.submittedAt))
        .limit(1)
    ).at(0)

    // Anterior/siguiente en el orden del curso (con título para la navegación).
    const siblings = await db
      .select({ id: lesson.id, title: lesson.title })
      .from(lesson)
      .where(eq(lesson.moduleId, item.moduleId))
      .orderBy(asc(lesson.position))
    const index = siblings.findIndex((l) => l.id === item.id)

    return {
      id: item.id,
      title: item.title,
      type: item.type,
      passingScore: item.passingScore,
      estimatedMinutes: item.estimatedMinutes,
      content: item.type === 'reading' ? item.content : null,
      course: {
        id: itemCourse.id,
        slug: itemCourse.slug,
        title: itemCourse.title,
      },
      module: { id: mod.id, title: mod.title },
      progress: progress ?? null,
      lastAttempt: lastAttempt ?? null,
      prevLessonId: index > 0 ? siblings[index - 1].id : null,
      prevLessonTitle: index > 0 ? siblings[index - 1].title : null,
      nextLessonId: index < siblings.length - 1 ? siblings[index + 1].id : null,
      nextLessonTitle:
        index < siblings.length - 1 ? siblings[index + 1].title : null,
      questions: questions.map((q) => ({
        id: q.id,
        text: q.text,
        options: options.filter((o) => o.questionId === q.id),
      })),
    }
  })

/** Catálogo "Mis cursos": publicados + progreso agregado del usuario. */
const getMyCourses = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await ensureSession()

  const items = await db
    .select()
    .from(course)
    .where(eq(course.status, 'published'))
    .orderBy(desc(course.publishedAt))

  const courseIds = items.map((c) => c.id)
  if (courseIds.length === 0) return { items: [] }

  // Total de lecciones por curso.
  const totals = await db
    .select({ courseId: courseModule.courseId, value: count() })
    .from(lesson)
    .innerJoin(courseModule, eq(lesson.moduleId, courseModule.id))
    .where(inArray(courseModule.courseId, courseIds))
    .groupBy(courseModule.courseId)

  // Progreso del usuario (lecciones completadas y última actividad).
  const progress = await db
    .select({
      courseId: courseModule.courseId,
      completed: count(),
      lastActivity: sql<number>`max(${lessonProgress.lastAccessedAt})`,
      lastCompleted: sql<number | null>`max(${lessonProgress.completedAt})`,
    })
    .from(lessonProgress)
    .innerJoin(lesson, eq(lessonProgress.lessonId, lesson.id))
    .innerJoin(courseModule, eq(lesson.moduleId, courseModule.id))
    .where(
      and(
        eq(lessonProgress.userId, session.user.id),
        eq(lessonProgress.status, 'completed'),
        inArray(courseModule.courseId, courseIds),
      ),
    )
    .groupBy(courseModule.courseId)

  // Duración total por curso y lección donde continuar (la última visitada
  // sin completar, o la primera sin completar).
  const lessons = await db
    .select({
      id: lesson.id,
      courseId: courseModule.courseId,
      title: lesson.title,
      estimatedMinutes: lesson.estimatedMinutes,
    })
    .from(lesson)
    .innerJoin(courseModule, eq(lesson.moduleId, courseModule.id))
    .where(inArray(courseModule.courseId, courseIds))
    .orderBy(asc(courseModule.position), asc(lesson.position))

  const allProgress = await db
    .select({
      lessonId: lessonProgress.lessonId,
      status: lessonProgress.status,
      lastAccessedAt: lessonProgress.lastAccessedAt,
    })
    .from(lessonProgress)
    .where(
      and(
        eq(lessonProgress.userId, session.user.id),
        inArray(
          lessonProgress.lessonId,
          lessons.map((l) => l.id),
        ),
      ),
    )

  const progressByLesson = new Map(allProgress.map((p) => [p.lessonId, p]))
  const lessonsByCourse = new Map<string, typeof lessons>()
  for (const l of lessons) {
    const list = lessonsByCourse.get(l.courseId) ?? []
    list.push(l)
    lessonsByCourse.set(l.courseId, list)
  }

  const totalsByCourse = new Map(totals.map((t) => [t.courseId, t.value]))
  const progressByCourse = new Map(progress.map((p) => [p.courseId, p]))

  return {
    items: items.map((c) => {
      const total = totalsByCourse.get(c.id) ?? 0
      const p = progressByCourse.get(c.id)
      const courseLessons = lessonsByCourse.get(c.id) ?? []
      const continueLessonId = pickContinueLesson(
        courseLessons,
        progressByLesson,
      )
      const continueLesson = continueLessonId
        ? (courseLessons.find((l) => l.id === continueLessonId) ?? null)
        : null
      return {
        ...c,
        totalLessons: total,
        completedLessons: p?.completed ?? 0,
        lastActivityAt: p?.lastActivity ?? null,
        completedAt: p?.lastCompleted ?? null,
        completed: total > 0 && (p?.completed ?? 0) === total,
        totalMinutes: courseLessons.reduce(
          (sum, l) => sum + (l.estimatedMinutes ?? 0),
          0,
        ),
        continueLesson: continueLesson
          ? { id: continueLesson.id, title: continueLesson.title }
          : null,
      }
    }),
  }
})

export const courseQueries = {
  getCourses,
  getCourseById,
  getEditorLesson,
  getStudentCourse,
  getCourseContinuePoint,
  getStudentLesson,
  getMyCourses,
}
