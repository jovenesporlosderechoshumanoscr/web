import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  coursePublicQueries,
  courseQueries,
} from '@/server/queries/course-server'
import { courseMutations } from '@/server/mutations/course-server'
import type {
  CreateCourseInput,
  CreateLessonInput,
  CreateModuleInput,
  DeleteCourseInput,
  DeleteLessonInput,
  DeleteModuleInput,
  GenerateCertificateInput,
  MoveInput,
  SaveProgressInput,
  SubmitQuizInput,
  UpdateCourseInput,
  UpdateLessonInput,
  UpdateModuleInput,
} from '@/server/validation/course'

export const COURSES_QUERY_KEY = 'courses'
export const COURSE_QUERY_KEY = 'course'
export const MY_COURSES_QUERY_KEY = 'my-courses'
export const STUDENT_COURSE_KEY = 'student-course'
export const STUDENT_LESSON_KEY = 'student-lesson'
export const EDITOR_LESSON_KEY = 'editor-lesson'
export const SIDEBAR_COURSES_KEY = 'sidebar-courses'

/* ------------------------------- Admin ------------------------------- */

export function useCourses(filters: {
  title?: string
  status?: 'draft' | 'published'
  page: number
  limit: number
}) {
  return useQuery({
    queryKey: [COURSES_QUERY_KEY, filters],
    queryFn: () => courseQueries.getCourses({ data: filters }),
  })
}

export function useCourse(id: string | undefined) {
  return useQuery({
    queryKey: [COURSE_QUERY_KEY, id],
    queryFn: () => courseQueries.getCourseById({ data: { id: id! } }),
    enabled: Boolean(id),
  })
}

export function useEditorLesson(lessonId: string | undefined) {
  return useQuery({
    queryKey: [EDITOR_LESSON_KEY, lessonId],
    queryFn: () =>
      courseQueries.getEditorLesson({ data: { lessonId: lessonId! } }),
    enabled: Boolean(lessonId),
  })
}

export function useCreateCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateCourseInput) =>
      courseMutations.createCourse({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COURSES_QUERY_KEY] })
    },
  })
}

export function useUpdateCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateCourseInput) =>
      courseMutations.updateCourse({ data: input }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [COURSES_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [COURSE_QUERY_KEY, data.id] })
    },
  })
}

export function useDeleteCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: DeleteCourseInput) =>
      courseMutations.deleteCourse({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COURSES_QUERY_KEY] })
    },
  })
}

export function useCreateModule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateModuleInput) =>
      courseMutations.createModule({ data: input }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [COURSE_QUERY_KEY, data.courseId],
      })
    },
  })
}

export function useUpdateModule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateModuleInput) =>
      courseMutations.updateModule({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COURSE_QUERY_KEY] })
    },
  })
}

export function useDeleteModule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: DeleteModuleInput) =>
      courseMutations.deleteModule({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COURSE_QUERY_KEY] })
    },
  })
}

export function useMoveModule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: MoveInput) =>
      courseMutations.moveModule({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COURSE_QUERY_KEY] })
    },
  })
}

export function useCreateLesson() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateLessonInput) =>
      courseMutations.createLesson({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COURSE_QUERY_KEY] })
    },
  })
}

export function useUpdateLesson() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateLessonInput) =>
      courseMutations.updateLesson({ data: input }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [COURSE_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [EDITOR_LESSON_KEY, data.id] })
    },
  })
}

export function useDeleteLesson() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: DeleteLessonInput) =>
      courseMutations.deleteLesson({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COURSE_QUERY_KEY] })
    },
  })
}

export function useMoveLesson() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: MoveInput) =>
      courseMutations.moveLesson({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COURSE_QUERY_KEY] })
    },
  })
}

/* ----------------------------- Estudiantes ----------------------------- */

/** Sidebar de la zona de estudiantes: cursos publicados + lecciones. */
export function useSidebarCourses() {
  return useQuery({
    queryKey: [SIDEBAR_COURSES_KEY],
    queryFn: () => coursePublicQueries.getSidebarCourses(),
  })
}

export function useMyCourses() {
  return useQuery({
    queryKey: [MY_COURSES_QUERY_KEY],
    queryFn: () => courseQueries.getMyCourses(),
  })
}

export function useStudentCourse(slug: string | undefined) {
  return useQuery({
    queryKey: [STUDENT_COURSE_KEY, slug],
    queryFn: () => courseQueries.getStudentCourse({ data: { slug: slug! } }),
    enabled: Boolean(slug),
  })
}

export function useStudentLesson(lessonId: string | undefined) {
  return useQuery({
    queryKey: [STUDENT_LESSON_KEY, lessonId],
    queryFn: () =>
      courseQueries.getStudentLesson({ data: { lessonId: lessonId! } }),
    enabled: Boolean(lessonId),
  })
}

function useInvalidateStudent() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: [MY_COURSES_QUERY_KEY] })
    queryClient.invalidateQueries({ queryKey: [STUDENT_COURSE_KEY] })
    queryClient.invalidateQueries({ queryKey: [STUDENT_LESSON_KEY] })
    queryClient.invalidateQueries({ queryKey: [SIDEBAR_COURSES_KEY] })
  }
}

/**
 * Guarda el progreso de una lección. Devuelve `courseJustCompleted` para
 * disparar el popup de "curso completado".
 */
export function useSaveProgress() {
  const invalidate = useInvalidateStudent()
  return useMutation({
    mutationFn: (input: SaveProgressInput) =>
      courseMutations.saveLessonProgress({ data: input }),
    onSuccess: () => invalidate(),
  })
}

export function useSubmitQuiz() {
  const invalidate = useInvalidateStudent()
  return useMutation({
    mutationFn: (input: SubmitQuizInput) =>
      courseMutations.submitQuiz({ data: input }),
    onSuccess: () => invalidate(),
  })
}

/**
 * Genera y descarga el certificado en PDF de un curso completado.
 * El servidor devuelve el PDF en base64; aquí se decodifica y se dispara
 * la descarga con un enlace temporal.
 */
export function useGenerateCertificate() {
  return useMutation({
    mutationFn: async (input: GenerateCertificateInput) => {
      const { filename, base64 } = await courseMutations.generateCertificate({
        data: input,
      })

      const blob = new Blob(
        [Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))],
        { type: 'application/pdf' },
      )
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)

      return filename
    },
  })
}
