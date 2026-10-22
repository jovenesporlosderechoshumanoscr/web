import { Outlet, createFileRoute } from '@tanstack/react-router'

/**
 * Layout de curso: el índice vive en `$courseSlug/index.tsx` y las lecciones
 * en `$courseSlug/lesson.$lessonId.tsx`. Sin el <Outlet /> la ruta hija de
 * lección nunca se monta (página en blanco).
 */
export const Route = createFileRoute('/student/courses/$courseSlug')({
  component: () => <Outlet />,
})
