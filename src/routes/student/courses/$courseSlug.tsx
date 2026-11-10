import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import { LessonsSidebar } from '@/components/student/LessonsSidebar'
import { UserMenu } from '@/components/student/UserMenu'
import { ReadingProgress } from '@/components/student/ReadingProgress'
import ThemeToggle from '@/components/ThemeToggle'
import { Skeleton } from '@/components/ui/skeleton'
import { useStudentCourse } from '@/functions/course-client'
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import {
  Link,
  Outlet,
  createFileRoute,
  useRouteContext,
  useParams,
} from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/student/courses/$courseSlug')({
  component: CourseLayout,
})

/**
 * Layout B (dentro de un curso): sidebar de lecciones + topbar compacta.
 * Es el único lugar donde aparece el sidebar.
 */
function CourseLayout() {
  const { courseSlug } = useParams({ from: '/student/courses/$courseSlug' })
  const { user } = useRouteContext({ from: '/student' })
  const courseQuery = useStudentCourse(courseSlug)
  const course = courseQuery.data

  if (courseQuery.isPending) {
    return <CourseLayoutSkeleton />
  }

  if (courseQuery.isError || !course) {
    return (
      <div className="p-8">
        <p className="text-sm text-destructive">Curso no encontrado.</p>
        <Link to="/student" className="mt-2 block text-sm underline">
          Volver al inicio
        </Link>
      </div>
    )
  }

  return (
    <SidebarProvider style={{ ['--sidebar-width' as string]: '19rem' }}>
      <LessonsSidebar
        course={{
          slug: course.slug,
          title: course.title,
          modules: course.modules,
          summary: course.summary,
        }}
      />
      <SidebarInset>
        <CourseTopbar course={course} user={user} />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}

/** Flat del orden de lecciones para breadcrumb y anterior/siguiente. */
function useCourseNavigation(
  course: NonNullable<ReturnType<typeof useStudentCourse>['data']>,
) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion -- strict:false no puede inferir el param del route hijo
  const { lessonId } = useParams({ strict: false }) as { lessonId?: string }

  const flat = course.modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleTitle: m.title })),
  )
  const index = flat.findIndex((l) => l.id === lessonId)
  const current = index >= 0 ? flat[index] : null

  return {
    current,
    prev: index > 0 ? flat[index - 1] : null,
    next: index >= 0 && index < flat.length - 1 ? flat[index + 1] : null,
  }
}

function CourseTopbar({
  course,
  user,
}: {
  course: NonNullable<ReturnType<typeof useStudentCourse>['data']>
  user: { name: string; email: string }
}) {
  const { toggleSidebar } = useSidebar()
  const { current, prev, next } = useCourseNavigation(course)

  // Atajo de teclado para colapsar el sidebar (Ctrl/Cmd + B).
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault()
        toggleSidebar()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [toggleSidebar])
  const lessonLink = (
    lesson: (typeof course)['modules'][number]['lessons'][number],
    direction: 'prev' | 'next',
  ) => (
    <Link
      to="/student/courses/$courseSlug/lesson/$lessonId"
      params={{ courseSlug: course.slug, lessonId: lesson.id }}
      className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
      aria-label={`${direction === 'prev' ? 'Lección anterior' : 'Lección siguiente'}: ${lesson.title}`}
    >
      {direction === 'prev' && <IconArrowLeft className="size-4" />}
      <span className="hidden max-w-40 truncate lg:block">{lesson.title}</span>
      {direction === 'next' && <IconArrowRight className="size-4" />}
    </Link>
  )

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border/80 bg-background/85 px-3 backdrop-blur sm:px-4">
      <SidebarTrigger aria-label="Mostrar u ocultar las lecciones" />
      <ReadingProgress />

      {/* Breadcrumb: Curso · Módulo */}
      <nav aria-label="Ruta de la lección" className="min-w-0 flex-1">
        <ol className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
          <li className="min-w-0 truncate">
            <Link
              to="/student"
              className="hover:text-foreground hover:underline"
            >
              Mis cursos
            </Link>
          </li>
          <li aria-hidden="true">·</li>
          <li className="min-w-0 truncate font-medium text-foreground">
            {course.title}
            {current && (
              <>
                {' '}
                <span aria-hidden="true">·</span>{' '}
                <span className="text-muted-foreground">
                  {current.moduleTitle}
                </span>
              </>
            )}
          </li>
        </ol>
      </nav>

      <div className="flex items-center gap-1">
        {prev ? lessonLink(prev, 'prev') : <span className="w-8" />}
        {next ? lessonLink(next, 'next') : <span className="w-8" />}
        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>
        <UserMenu user={user} />
      </div>
    </header>
  )
}

function CourseLayoutSkeleton() {
  return (
    <div className="flex min-h-svh">
      <div className="hidden w-72 shrink-0 flex-col gap-4 border-r p-4 md:flex">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-16 w-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
      <div className="flex-1 p-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="mx-auto mt-8 h-96 w-full max-w-3xl" />
      </div>
    </div>
  )
}
