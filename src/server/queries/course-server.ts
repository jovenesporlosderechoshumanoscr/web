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
      },
    }
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

    // Anterior/siguiente en el orden del curso.
    const siblings = await db
      .select({ id: lesson.id })
      .from(lesson)
      .where(eq(lesson.moduleId, item.moduleId))
      .orderBy(asc(lesson.position))
    const index = siblings.findIndex((l) => l.id === item.id)

    return {
      id: item.id,
      title: item.title,
      type: item.type,
      passingScore: item.passingScore,
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
      nextLessonId: index < siblings.length - 1 ? siblings[index + 1].id : null,
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

  const totalsByCourse = new Map(totals.map((t) => [t.courseId, t.value]))
  const progressByCourse = new Map(progress.map((p) => [p.courseId, p]))

  return {
    items: items.map((c) => {
      const total = totalsByCourse.get(c.id) ?? 0
      const p = progressByCourse.get(c.id)
      return {
        ...c,
        totalLessons: total,
        completedLessons: p?.completed ?? 0,
        lastActivityAt: p?.lastActivity ?? null,
        completedAt: p?.lastCompleted ?? null,
        completed: total > 0 && (p?.completed ?? 0) === total,
      }
    }),
  }
})

export const courseQueries = {
  getCourses,
  getCourseById,
  getEditorLesson,
  getStudentCourse,
  getStudentLesson,
  getMyCourses,
}

/** Queries de navegación del sidebar: títulos/ids de cursos publicados. */
const getSidebarCourses = createServerFn({ method: 'GET' }).handler(
  async () => {
    await ensureSession()

    const items = await db
      .select({ id: course.id, slug: course.slug, title: course.title })
      .from(course)
      .where(eq(course.status, 'published'))
      .orderBy(desc(course.publishedAt))

    const courseIds = items.map((c) => c.id)
    if (courseIds.length === 0) return { courses: [] }

    const modules = await db
      .select({
        id: courseModule.id,
        courseId: courseModule.courseId,
        title: courseModule.title,
      })
      .from(courseModule)
      .where(inArray(courseModule.courseId, courseIds))
      .orderBy(asc(courseModule.position))

    const moduleIds = modules.map((m) => m.id)
    const lessons =
      moduleIds.length > 0
        ? await db
            .select({
              id: lesson.id,
              moduleId: lesson.moduleId,
              title: lesson.title,
            })
            .from(lesson)
            .where(inArray(lesson.moduleId, moduleIds))
            .orderBy(asc(lesson.position))
        : []

    return {
      courses: items.map((c) => ({
        ...c,
        modules: modules
          .filter((m) => m.courseId === c.id)
          .map((m) => ({
            ...m,
            lessons: lessons.filter((l) => l.moduleId === m.id),
          })),
      })),
    }
  },
)

export const coursePublicQueries = {
  getSidebarCourses,
}
