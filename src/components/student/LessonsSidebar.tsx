import { useEffect, useMemo, useRef, useState } from 'react'
import { Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar'
import { ProgressRing } from '@/components/student/ProgressRing'
import { formatMinutes } from '@/lib/lesson-duration'
import {
  IconBook,
  IconCheck,
  IconChevronRight,
  IconCircle,
  IconClipboardCheck,
  IconLock,
  IconPlayerPlay,
} from '@tabler/icons-react'
import { Link, useParams } from '@tanstack/react-router'
import { cn } from 'cn'

type SidebarLesson = {
  id: string
  title: string
  type: 'reading' | 'quiz'
  estimatedMinutes: number | null
  progressStatus: 'in_progress' | 'completed' | null
}

type SidebarModule = {
  id: string
  title: string
  lessons: SidebarLesson[]
}

export type SidebarCourse = {
  slug: string
  title: string
  modules: SidebarModule[]
  summary: {
    totalLessons: number
    completedLessons: number
    totalMinutes: number
  }
}

type LessonStatus = 'completed' | 'in-progress' | 'quiz-pending' | 'pending'

function lessonStatus(lesson: SidebarLesson): LessonStatus {
  if (lesson.progressStatus === 'completed') return 'completed'
  if (lesson.type === 'quiz') return 'quiz-pending'
  if (lesson.progressStatus === 'in_progress') return 'in-progress'
  return 'pending'
}

const TYPE_ICONS = {
  reading: IconBook,
  quiz: IconClipboardCheck,
} as const

/**
 * Sidebar de lecciones del curso (estilo player): logo, nombre del curso,
 * progreso global, secciones colapsables con duración y lecciones con
 * estado (completada / en progreso / quiz pendiente de aprobar).
 */
export function LessonsSidebar({ course }: { course: SidebarCourse }) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion -- strict:false no puede inferir el param del route hijo
  const { lessonId } = useParams({ strict: false }) as { lessonId?: string }
  const storageKey = `jpdh-course-sections-${course.slug}`

  // Módulos abiertos: persistidos; por defecto, el de la lección activa.
  const initialOpen = useMemo(() => {
    try {
      const stored = window.localStorage.getItem(storageKey)
      if (stored) return JSON.parse(stored) as string[]
    } catch {
      // localStorage no disponible: se usa el default.
    }
    const activeModule = course.modules.find((m) =>
      m.lessons.some((l) => l.id === lessonId),
    )
    return activeModule
      ? [activeModule.id]
      : course.modules.slice(0, 1).map((m) => m.id)
  }, [course.modules, lessonId, storageKey])

  const [openModules, setOpenModules] = useState<string[]>(initialOpen)

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(openModules))
    } catch {
      // Sin persistencia disponible.
    }
  }, [openModules, storageKey])

  // El módulo de la lección activa siempre visible.
  useEffect(() => {
    if (!lessonId) return
    const activeModule = course.modules.find((m) =>
      m.lessons.some((l) => l.id === lessonId),
    )
    if (activeModule && !openModules.includes(activeModule.id)) {
      setOpenModules((prev) => [...prev, activeModule.id])
    }
    // Solo al cambiar de lección.
  }, [lessonId])

  // Autoscroll al ítem activo.
  const activeRef = useRef<HTMLAnchorElement | null>(null)
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest' })
  }, [lessonId])

  const pct =
    course.summary.totalLessons > 0
      ? Math.round(
          (course.summary.completedLessons / course.summary.totalLessons) * 100,
        )
      : 0

  return (
    <Sidebar>
      <SidebarHeader className="gap-3 border-b border-sidebar-border p-4">
        <Link
          to="/student"
          aria-label="Volver al inicio de la zona de estudiantes"
          className="flex w-fit items-center gap-2 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
        >
          <img
            src="/logojpdh.webp"
            alt="JPDH Costa Rica"
            className="h-16 w-auto"
          />
        </Link>
        <div className="flex items-center gap-3">
          <ProgressRing value={pct} size={52} strokeWidth={5}>
            <span className="text-xs font-bold">{pct}%</span>
          </ProgressRing>
          <div className="min-w-0">
            <p className="truncate font-heading text-sm font-bold leading-tight">
              {course.title}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {course.summary.completedLessons}/{course.summary.totalLessons}{' '}
              lecciones
            </p>
            {course.summary.totalMinutes > 0 && (
              <p className="text-xs text-muted-foreground">
                ≈ {formatMinutes(course.summary.totalMinutes)}
              </p>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2" data-testid="lessons-sidebar-content">
        <nav
          aria-label={`Lecciones de ${course.title}`}
          className="flex flex-col gap-1"
        >
          {course.modules.map((module) => {
            const completed = module.lessons.filter(
              (l) => l.progressStatus === 'completed',
            ).length
            const minutes = module.lessons.reduce(
              (sum, l) => sum + (l.estimatedMinutes ?? 0),
              0,
            )
            const isOpen = openModules.includes(module.id)

            return (
              <div key={module.id}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() =>
                    setOpenModules((prev) =>
                      prev.includes(module.id)
                        ? prev.filter((id) => id !== module.id)
                        : [...prev, module.id],
                    )
                  }
                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors hover:bg-sidebar-accent focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
                >
                  <IconChevronRight
                    className={cn(
                      'size-4 shrink-0 text-muted-foreground transition-transform duration-200',
                      isOpen && 'rotate-90',
                    )}
                    aria-hidden="true"
                  />
                  <span className="flex-1 truncate">{module.title}</span>
                  <span className="shrink-0 text-xs font-medium text-muted-foreground">
                    {completed}/{module.lessons.length}
                    {minutes > 0 && <> · {formatMinutes(minutes)}</>}
                  </span>
                </button>

                {isOpen && (
                  <ul className="mt-0.5 mb-1 flex flex-col gap-0.5 pl-3">
                    {module.lessons.map((lesson) => {
                      const TypeIcon = TYPE_ICONS[lesson.type]
                      const status = lessonStatus(lesson)
                      const isActive = lesson.id === lessonId

                      return (
                        <li key={lesson.id}>
                          <Link
                            ref={isActive ? activeRef : undefined}
                            to="/student/courses/$courseSlug/lesson/$lessonId"
                            params={{
                              courseSlug: course.slug,
                              lessonId: lesson.id,
                            }}
                            aria-current={isActive ? 'page' : undefined}
                            title={
                              lesson.type === 'quiz' &&
                              status === 'quiz-pending'
                                ? 'Aprueba el quiz para completar esta lección'
                                : undefined
                            }
                            className={cn(
                              'group/lesson flex items-center gap-2.5 rounded-lg border-l-2 px-2.5 py-2 text-sm transition-colors focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none',
                              isActive
                                ? 'border-l-4 border-primary bg-primary/10 font-semibold text-foreground'
                                : 'border-transparent hover:bg-sidebar-accent',
                            )}
                          >
                            <TypeIcon
                              className={cn(
                                'size-4 shrink-0',
                                status === 'completed'
                                  ? 'text-success'
                                  : isActive
                                    ? 'text-primary'
                                    : 'text-muted-foreground',
                              )}
                              aria-hidden="true"
                            />
                            <span
                              className={cn(
                                'min-w-0 flex-1 truncate',
                                status === 'completed' &&
                                  'line-through decoration-success/50',
                              )}
                            >
                              {lesson.title}
                            </span>
                            {lesson.estimatedMinutes != null && (
                              <span className="shrink-0 text-[11px] text-muted-foreground">
                                {formatMinutes(lesson.estimatedMinutes)}
                              </span>
                            )}
                            <StatusIcon status={status} />
                          </Link>
                        </li>
                      )
                    })}
                    {module.lessons.length === 0 && (
                      <li className="px-2.5 py-1.5 text-xs text-muted-foreground">
                        Sin lecciones
                      </li>
                    )}
                  </ul>
                )}
              </div>
            )
          })}
          {course.modules.length === 0 && (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              Este curso aún no tiene contenido.
            </p>
          )}
        </nav>
      </SidebarContent>
    </Sidebar>
  )
}

function StatusIcon({ status }: { status: LessonStatus }) {
  switch (status) {
    case 'completed':
      return (
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success text-success-foreground">
          <IconCheck className="size-3" aria-label="Completada" />
        </span>
      )
    case 'in-progress':
      return (
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/15">
          <IconPlayerPlay
            className="size-2.5 text-primary"
            aria-label="En progreso"
          />
        </span>
      )
    case 'quiz-pending':
      return (
        <IconLock
          className="size-3.5 shrink-0 text-muted-foreground"
          aria-label="Quiz pendiente de aprobar"
        />
      )
    default:
      return (
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-border">
          <IconCircle
            className="size-2 text-muted-foreground"
            aria-label="Pendiente"
          />
        </span>
      )
  }
}
