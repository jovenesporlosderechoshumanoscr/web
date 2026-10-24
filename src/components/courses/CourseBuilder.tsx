import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  IconArrowLeft,
  IconArrowUp,
  IconArrowDown,
  IconClipboardCheck,
  IconBook,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react'
import { BlockCanvas } from '@/components/blog/BlockCanvas'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useCreateLesson,
  useCreateModule,
  useCourse,
  useDeleteLesson,
  useDeleteModule,
  useEditorLesson,
  useMoveLesson,
  useMoveModule,
  useUpdateLesson,
  useUpdateModule,
} from '@/functions/course-client'
import type { LessonType } from '@/server/validation/course'
import type { PostBlock } from '@/server/validation/blog'

const LESSON_TYPE_META: Record<
  LessonType,
  { label: string; Icon: typeof IconBook }
> = {
  reading: { label: 'Lectura', Icon: IconBook },
  quiz: { label: 'Quiz', Icon: IconClipboardCheck },
}

/**
 * Editor del curso: árbol de módulos y lecciones a la izquierda, editor de
 * la lección seleccionada (bloques de lectura o preguntas de quiz) a la
 * derecha. El reordenamiento es por pasos (subir/bajar), igual que los
 * bloques del blog.
 */
export function CourseBuilder({ courseId }: { courseId: string }) {
  const courseQuery = useCourse(courseId)
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null)

  const course = courseQuery.data

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/panel/courses"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <IconArrowLeft className="size-4" />
            Cursos
          </Link>
          <h1 className="text-xl font-semibold">
            {course ? course.title : 'Cargando…'}
          </h1>
        </div>
        {course && (
          <Link
            to="/admin/panel/courses/edit/$courseId"
            params={{ courseId }}
            className="text-sm text-muted-foreground underline hover:text-foreground"
          >
            Editar datos del curso
          </Link>
        )}
      </div>

      {courseQuery.isError && (
        <p className="text-sm text-destructive">Error al cargar el curso.</p>
      )}

      <div className="grid flex-1 gap-4 lg:grid-cols-[minmax(280px,360px)_1fr]">
        {/* Columna izquierda: árbol módulos → lecciones */}
        <div className="flex min-w-0 flex-col gap-3">
          {courseQuery.isPending && (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          )}
          {course?.modules.map((module, index) => (
            <ModuleCard
              key={module.id}
              module={module}
              isFirst={index === 0}
              isLast={index === course.modules.length - 1}
              selectedLessonId={selectedLessonId}
              onSelectLesson={setSelectedLessonId}
            />
          ))}
          <AddModuleButton courseId={courseId} />
        </div>

        {/* Columna derecha: editor de la lección seleccionada */}
        <div className="min-w-0">
          {selectedLessonId ? (
            <LessonEditorPanel lessonId={selectedLessonId} />
          ) : (
            <div className="flex h-full min-h-48 items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 p-6 text-sm text-muted-foreground">
              Selecciona una lección para editarla
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------ Módulo ------------------------------ */

type ModuleLike = {
  id: string
  title: string
  courseId: string
  lessons: Array<{ id: string; title: string; type: 'reading' | 'quiz' }>
}

function ModuleCard({
  module,
  isFirst,
  isLast,
  selectedLessonId,
  onSelectLesson,
}: {
  module: ModuleLike
  isFirst: boolean
  isLast: boolean
  selectedLessonId: string | null
  onSelectLesson: (id: string) => void
}) {
  const updateModule = useUpdateModule()
  const deleteModule = useDeleteModule()
  const moveModule = useMoveModule()

  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(module.title)

  useEffect(() => {
    setTitle(module.title)
  }, [module.title])

  function handleDelete() {
    if (
      !window.confirm(
        `¿Eliminar el módulo "${module.title}" y TODAS sus lecciones?`,
      )
    )
      return
    deleteModule.mutate({ id: module.id })
  }

  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center gap-1 border-b px-2 py-1.5">
        {editing ? (
          <form
            className="flex flex-1 items-center gap-1"
            onSubmit={(e) => {
              e.preventDefault()
              updateModule.mutate(
                { id: module.id, title: title.trim() },
                { onSuccess: () => setEditing(false) },
              )
            }}
          >
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-7"
              autoFocus
            />
            <Button type="submit" size="sm" variant="ghost">
              Guardar
            </Button>
          </form>
        ) : (
          <>
            <button
              type="button"
              className="flex-1 truncate px-1 text-left text-sm font-semibold"
              onClick={() => setEditing(true)}
              title="Renombrar módulo"
            >
              {module.title}
            </button>
            <Button
              size="icon-xs"
              variant="ghost"
              aria-label="Subir módulo"
              disabled={isFirst || moveModule.isPending}
              onClick={() =>
                moveModule.mutate({ id: module.id, direction: -1 })
              }
            >
              <IconArrowUp />
            </Button>
            <Button
              size="icon-xs"
              variant="ghost"
              aria-label="Bajar módulo"
              disabled={isLast || moveModule.isPending}
              onClick={() => moveModule.mutate({ id: module.id, direction: 1 })}
            >
              <IconArrowDown />
            </Button>
            <Button
              size="icon-xs"
              variant="ghost"
              aria-label="Eliminar módulo"
              className="text-destructive hover:text-destructive"
              onClick={handleDelete}
            >
              <IconTrash />
            </Button>
          </>
        )}
      </div>

      <div className="flex flex-col py-1">
        {module.lessons.map((lesson, lessonIndex) => (
          <LessonRow
            key={lesson.id}
            lesson={lesson}
            isFirst={lessonIndex === 0}
            isLast={lessonIndex === module.lessons.length - 1}
            selected={selectedLessonId === lesson.id}
            onSelect={() => onSelectLesson(lesson.id)}
            onDeleted={() => onSelectLesson('')}
          />
        ))}
        <AddLessonButton moduleId={module.id} />
      </div>
    </div>
  )
}

/* ------------------------- Botones de creación ------------------------- */

function AddModuleButton({ courseId }: { courseId: string }) {
  const createModule = useCreateModule()
  const [title, setTitle] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    createModule.mutate(
      { courseId, title: title.trim() },
      { onSuccess: () => setTitle('') },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nuevo módulo…"
        className="h-8"
      />
      <Button
        type="submit"
        size="sm"
        variant="outline"
        disabled={!title.trim()}
      >
        <IconPlus />
        Añadir
      </Button>
    </form>
  )
}

function AddLessonButton({ moduleId }: { moduleId: string }) {
  const createLesson = useCreateLesson()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="w-fit text-muted-foreground"
          >
            <IconPlus />
            Añadir lección
          </Button>
        }
      >
        Añadir
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem
          onClick={() =>
            createLesson.mutate({
              moduleId,
              title: 'Nueva lectura',
              type: 'reading',
            })
          }
        >
          <IconBook />
          Lectura
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            createLesson.mutate({ moduleId, title: 'Nuevo quiz', type: 'quiz' })
          }
        >
          <IconClipboardCheck />
          Quiz
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* --------------------- Panel del editor de lección --------------------- */

function LessonEditorPanel({ lessonId }: { lessonId: string }) {
  const lessonQuery = useEditorLesson(lessonId)
  const lesson = lessonQuery.data

  if (lessonQuery.isPending) {
    return <Skeleton className="h-64" />
  }
  if (!lesson) {
    return (
      <p className="py-6 text-sm text-destructive">Lección no encontrada.</p>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-4">
      {lesson.type === 'reading' ? (
        <ReadingEditor
          key={lesson.id}
          lessonId={lesson.id}
          initialTitle={lesson.title}
          initialContent={lesson.content ?? []}
        />
      ) : (
        <QuizEditor key={lesson.id} lesson={lesson} />
      )}
    </div>
  )
}

type ReadingEditorProps = {
  lessonId: string
  initialTitle: string
  initialContent: PostBlock[]
}

function ReadingEditor({
  lessonId,
  initialTitle,
  initialContent,
}: ReadingEditorProps) {
  const updateLesson = useUpdateLesson()
  const [title, setTitle] = useState(initialTitle)
  const [blocks, setBlocks] = useState<PostBlock[]>(initialContent)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setTitle(initialTitle)
    setBlocks(initialContent)
  }, [lessonId])

  function handleSave() {
    setSaved(false)
    updateLesson.mutate(
      { id: lessonId, title: title.trim(), content: blocks },
      { onSuccess: () => setSaved(true) },
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-9 max-w-md text-base font-semibold"
          placeholder="Título de la lección"
        />
        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-sm text-muted-foreground">Guardado</span>
          )}
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={updateLesson.isPending}
          >
            {updateLesson.isPending ? 'Guardando…' : 'Guardar lectura'}
          </Button>
        </div>
      </div>

      <BlockCanvas blocks={blocks} onChange={setBlocks} />

      {updateLesson.isError && (
        <p className="text-sm text-destructive">{updateLesson.error.message}</p>
      )}
    </div>
  )
}

/* ------------------------------ Editor de quiz ------------------------------ */

type QuestionDraft = {
  text: string
  options: Array<{ text: string; isCorrect: boolean }>
}

function emptyQuestion(): QuestionDraft {
  return {
    text: '',
    options: [
      { text: '', isCorrect: true },
      { text: '', isCorrect: false },
    ],
  }
}

function QuizEditor({
  lesson,
}: {
  lesson: {
    id: string
    title: string
    passingScore: number
    questions: Array<{
      id: string
      text: string
      options: Array<{ id: string; text: string; isCorrect: boolean }>
    }>
  }
}) {
  const updateLesson = useUpdateLesson()
  const [title, setTitle] = useState(lesson.title)
  const [passingScore, setPassingScore] = useState(String(lesson.passingScore))
  const [questions, setQuestions] = useState<QuestionDraft[]>(
    lesson.questions.map((q) => ({
      text: q.text,
      options: q.options.map((o) => ({ text: o.text, isCorrect: o.isCorrect })),
    })),
  )
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setTitle(lesson.title)
    setPassingScore(String(lesson.passingScore))
    setQuestions(
      lesson.questions.map((q) => ({
        text: q.text,
        options: q.options.map((o) => ({
          text: o.text,
          isCorrect: o.isCorrect,
        })),
      })),
    )
  }, [lesson.id])

  function updateQuestion(index: number, next: QuestionDraft) {
    setQuestions((prev) => prev.map((q, i) => (i === index ? next : q)))
  }

  function handleSave() {
    setSaved(false)
    setError(null)

    if (!title.trim()) {
      setError('El título es requerido')
      return
    }
    const score = Number(passingScore)
    if (Number.isNaN(score) || score < 0 || score > 100) {
      setError('La nota mínima debe estar entre 0 y 100')
      return
    }
    for (const [qi, q] of questions.entries()) {
      if (!q.text.trim()) {
        setError(`La pregunta ${qi + 1} necesita texto`)
        return
      }
      if (q.options.length < 2) {
        setError(`La pregunta ${qi + 1} necesita al menos 2 opciones`)
        return
      }
      if (q.options.some((o) => !o.text.trim())) {
        setError(`La pregunta ${qi + 1} tiene opciones vacías`)
        return
      }
      if (!q.options.some((o) => o.isCorrect)) {
        setError(`La pregunta ${qi + 1} necesita una opción correcta`)
        return
      }
    }

    updateLesson.mutate(
      {
        id: lesson.id,
        title: title.trim(),
        passingScore: score,
        questions: questions.map((q) => ({
          text: q.text.trim(),
          options: q.options.map((o) => ({
            text: o.text.trim(),
            isCorrect: o.isCorrect,
          })),
        })),
      },
      {
        onSuccess: () => setSaved(true),
        onError: () =>
          setError(updateLesson.error?.message ?? 'Error al guardar'),
      },
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-9 max-w-md text-base font-semibold"
          placeholder="Título de la lección"
        />
        <div className="flex items-end gap-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor="passingScore" className="text-xs">
              Nota mínima (%)
            </Label>
            <Input
              id="passingScore"
              type="number"
              min={0}
              max={100}
              value={passingScore}
              onChange={(e) => setPassingScore(e.target.value)}
              className="h-9 w-24"
            />
          </div>
          {saved && (
            <span className="pb-2 text-sm text-muted-foreground">Guardado</span>
          )}
          <Button
            type="button"
            className="mb-0.5"
            onClick={handleSave}
            disabled={updateLesson.isPending}
          >
            {updateLesson.isPending ? 'Guardando…' : 'Guardar quiz'}
          </Button>
        </div>
      </div>

      {questions.map((question, qi) => (
        <div key={qi} className="flex flex-col gap-3 rounded-xl border p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Pregunta {qi + 1}</span>
            <div className="flex-1" />
            <Button
              type="button"
              size="icon-xs"
              variant="ghost"
              aria-label="Subir pregunta"
              disabled={qi === 0}
              onClick={() => {
                const next = [...questions]
                ;[next[qi - 1], next[qi]] = [next[qi], next[qi - 1]]
                setQuestions(next)
              }}
            >
              <IconArrowUp />
            </Button>
            <Button
              type="button"
              size="icon-xs"
              variant="ghost"
              aria-label="Bajar pregunta"
              disabled={qi === questions.length - 1}
              onClick={() => {
                const next = [...questions]
                ;[next[qi], next[qi + 1]] = [next[qi + 1], next[qi]]
                setQuestions(next)
              }}
            >
              <IconArrowDown />
            </Button>
            <Button
              type="button"
              size="icon-xs"
              variant="ghost"
              aria-label="Eliminar pregunta"
              className="text-destructive hover:text-destructive"
              onClick={() =>
                setQuestions((prev) => prev.filter((_, i) => i !== qi))
              }
            >
              <IconTrash />
            </Button>
          </div>

          <Input
            value={question.text}
            onChange={(e) =>
              updateQuestion(qi, { ...question, text: e.target.value })
            }
            placeholder="Texto de la pregunta"
          />

          <div className="flex flex-col gap-2">
            {question.options.map((option, oi) => (
              <div key={oi} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`correct-${qi}`}
                  checked={option.isCorrect}
                  onChange={() =>
                    updateQuestion(qi, {
                      ...question,
                      options: question.options.map((o, i) => ({
                        ...o,
                        isCorrect: i === oi,
                      })),
                    })
                  }
                  aria-label={`Marcar opción ${oi + 1} como correcta`}
                  className="size-4"
                />
                <Input
                  value={option.text}
                  onChange={(e) =>
                    updateQuestion(qi, {
                      ...question,
                      options: question.options.map((o, i) =>
                        i === oi ? { ...o, text: e.target.value } : o,
                      ),
                    })
                  }
                  placeholder={`Opción ${oi + 1}`}
                  className="h-8"
                />
                <Button
                  type="button"
                  size="icon-xs"
                  variant="ghost"
                  aria-label="Eliminar opción"
                  className="text-destructive hover:text-destructive"
                  disabled={question.options.length <= 2}
                  onClick={() =>
                    updateQuestion(qi, {
                      ...question,
                      options: question.options.filter((_, i) => i !== oi),
                    })
                  }
                >
                  <IconTrash />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="w-fit"
              disabled={question.options.length >= 6}
              onClick={() =>
                updateQuestion(qi, {
                  ...question,
                  options: [
                    ...question.options,
                    { text: '', isCorrect: false },
                  ],
                })
              }
            >
              <IconPlus />
              Opción
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-fit"
        onClick={() => setQuestions((prev) => [...prev, emptyQuestion()])}
      >
        <IconPlus />
        Añadir pregunta
      </Button>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

function LessonRow({
  lesson,
  isFirst,
  isLast,
  selected,
  onSelect,
  onDeleted,
}: {
  lesson: { id: string; title: string; type: 'reading' | 'quiz' }
  isFirst: boolean
  isLast: boolean
  selected: boolean
  onSelect: () => void
  onDeleted: () => void
}) {
  const deleteLesson = useDeleteLesson()
  const moveLesson = useMoveLesson()
  const { Icon } = LESSON_TYPE_META[lesson.type]

  function handleDelete() {
    if (!window.confirm(`¿Eliminar la lección "${lesson.title}"?`)) return
    deleteLesson.mutate(
      { id: lesson.id },
      { onSuccess: selected ? onDeleted : undefined },
    )
  }

  return (
    <div className="group/lesson flex items-center gap-1 px-2 py-0.5">
      <button
        type="button"
        onClick={onSelect}
        className={`flex min-w-0 flex-1 items-center gap-1.5 rounded-lg px-1.5 py-1 text-left text-sm hover:bg-accent ${
          selected ? 'bg-accent' : ''
        }`}
      >
        <Icon className="size-4 shrink-0 text-muted-foreground" />
        <span className="truncate">{lesson.title}</span>
      </button>
      <Button
        size="icon-xs"
        variant="ghost"
        aria-label="Subir lección"
        className={selected ? '' : 'opacity-0 group-hover/lesson:opacity-100'}
        disabled={isFirst || moveLesson.isPending}
        onClick={() => moveLesson.mutate({ id: lesson.id, direction: -1 })}
      >
        <IconArrowUp />
      </Button>
      <Button
        size="icon-xs"
        variant="ghost"
        aria-label="Bajar lección"
        className={selected ? '' : 'opacity-0 group-hover/lesson:opacity-100'}
        disabled={isLast || moveLesson.isPending}
        onClick={() => moveLesson.mutate({ id: lesson.id, direction: 1 })}
      >
        <IconArrowDown />
      </Button>
      <Button
        size="icon-xs"
        variant="ghost"
        aria-label="Eliminar lección"
        className={`text-destructive hover:text-destructive ${
          selected ? '' : 'opacity-0 group-hover/lesson:opacity-100'
        }`}
        disabled={deleteLesson.isPending}
        onClick={handleDelete}
      >
        <IconTrash />
      </Button>
    </div>
  )
}
