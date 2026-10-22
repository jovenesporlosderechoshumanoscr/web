import { z } from 'zod'
import { postBlocksSchema, slugSchema } from './blog'

export const COURSE_STATUSES = ['draft', 'published'] as const
export type CourseStatus = (typeof COURSE_STATUSES)[number]

export const LESSON_TYPES = ['reading', 'quiz'] as const
export type LessonType = (typeof LESSON_TYPES)[number]

export const courseStatusSchema = z.enum(COURSE_STATUSES)
export const lessonTypeSchema = z.enum(LESSON_TYPES)

/* ------------------------------- Cursos ------------------------------- */

/** Filtros de búsqueda + paginación para el listado admin. */
export const getCoursesSchema = z.object({
  title: z.string().trim().min(1).max(150).optional(),
  status: courseStatusSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
})
export type GetCoursesInput = z.infer<typeof getCoursesSchema>

export const getCourseByIdSchema = z.object({ id: z.string().min(1) })
export type GetCourseByIdInput = z.infer<typeof getCourseByIdSchema>

export const getCourseBySlugSchema = z.object({
  slug: z.string().min(1).max(100),
})
export type GetCourseBySlugInput = z.infer<typeof getCourseBySlugSchema>

export const createCourseSchema = z.object({
  title: z.string().trim().min(1, 'El título es requerido').max(200),
  slug: slugSchema,
  status: courseStatusSchema.default('draft'),
  description: z
    .string()
    .trim()
    .max(2000)
    .nullish()
    .transform((v) => v ?? null),
  coverImage: z
    .string()
    .trim()
    .max(2000)
    .nullish()
    .transform((v) => v ?? null),
})
export type CreateCourseInput = z.infer<typeof createCourseSchema>

export const updateCourseSchema = createCourseSchema
  .partial()
  .extend({ id: z.string().min(1) })
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>

export const deleteCourseSchema = z.object({ id: z.string().min(1) })
export type DeleteCourseInput = z.infer<typeof deleteCourseSchema>

/* ------------------------------- Módulos ------------------------------- */

export const createModuleSchema = z.object({
  courseId: z.string().min(1),
  title: z.string().trim().min(1, 'El título del módulo es requerido').max(200),
  position: z.coerce.number().int().min(0).optional(),
})
export type CreateModuleInput = z.infer<typeof createModuleSchema>

export const updateModuleSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1).max(200).optional(),
})
export type UpdateModuleInput = z.infer<typeof updateModuleSchema>

export const deleteModuleSchema = z.object({ id: z.string().min(1) })
export type DeleteModuleInput = z.infer<typeof deleteModuleSchema>

/** Reordenamiento por pasos (subir/bajar), igual que los bloques del blog. */
export const moveSchema = z.object({
  id: z.string().min(1),
  direction: z.union([z.literal(-1), z.literal(1)]),
})
export type MoveInput = z.infer<typeof moveSchema>

/* ------------------------------- Lecciones ------------------------------- */

export const createLessonSchema = z.object({
  moduleId: z.string().min(1),
  title: z
    .string()
    .trim()
    .min(1, 'El título de la lección es requerido')
    .max(200),
  type: lessonTypeSchema.default('reading'),
  position: z.coerce.number().int().min(0).optional(),
})
export type CreateLessonInput = z.infer<typeof createLessonSchema>

export const quizOptionSchema = z.object({
  text: z.string().trim().min(1, 'El texto de la opción es requerido').max(500),
  isCorrect: z.boolean().default(false),
})
export type QuizOptionInput = z.infer<typeof quizOptionSchema>

export const quizQuestionSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, 'El texto de la pregunta es requerido')
    .max(1000),
  options: z
    .array(quizOptionSchema)
    .min(2, 'La pregunta necesita al menos 2 opciones')
    .max(6),
})
export type QuizQuestionInput = z.infer<typeof quizQuestionSchema>

/** El quiz completo se reemplaza al guardar (simplifica el editor). */
const quizQuestionsSchema = z
  .array(quizQuestionSchema)
  .max(50)
  .refine(
    (questions) => questions.every((q) => q.options.some((o) => o.isCorrect)),
    'Cada pregunta necesita al menos una opción correcta',
  )

export const updateLessonSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().trim().min(1).max(200).optional(),
    /** Solo para lecciones de lectura. */
    content: postBlocksSchema.optional(),
    /** Solo para lecciones de quiz: reemplaza todas las preguntas. */
    questions: quizQuestionsSchema.optional(),
    passingScore: z.coerce.number().int().min(0).max(100).optional(),
  })
  .refine((data) => Object.keys(data).length > 1, {
    message: 'Sin cambios para guardar',
  })
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>

export const deleteLessonSchema = z.object({ id: z.string().min(1) })
export type DeleteLessonInput = z.infer<typeof deleteLessonSchema>

/* ------------------------- Progreso del estudiante ------------------------- */

export const saveProgressSchema = z.object({
  lessonId: z.string().min(1),
  status: z.enum(['in_progress', 'completed']),
})
export type SaveProgressInput = z.infer<typeof saveProgressSchema>

export const getStudentLessonSchema = z.object({
  lessonId: z.string().min(1),
})
export type GetStudentLessonInput = z.infer<typeof getStudentLessonSchema>

export const getEditorLessonSchema = z.object({
  lessonId: z.string().min(1),
})
export type GetEditorLessonInput = z.infer<typeof getEditorLessonSchema>

export const submitQuizSchema = z.object({
  lessonId: z.string().min(1),
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1),
        optionId: z.string().min(1),
      }),
    )
    .min(1, 'Responde al menos una pregunta'),
})
export type SubmitQuizInput = z.infer<typeof submitQuizSchema>
