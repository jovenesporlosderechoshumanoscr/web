import type { useMyCourses } from '@/functions/course-client'

/** Resultado de `getMyCourses` tal como llega al cliente. */
export type MyCoursesResult = NonNullable<
  ReturnType<typeof useMyCourses>['data']
>

/** Ítem de curso del listado "Mis cursos" (con progreso y duración). */
export type CourseListItem = MyCoursesResult['items'][number]
