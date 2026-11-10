import { useState } from 'react'
import { IconCheck, IconRotate, IconX } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useSubmitQuiz } from '@/functions/course-client'
import { cn } from 'cn'

type SubmitResult = {
  attemptId: string
  score: number
  passed: boolean
  passingScore: number
  courseJustCompleted: boolean
}

type QuizViewProps = {
  lessonId: string
  questions: Array<{
    id: string
    text: string
    options: Array<{ id: string; text: string }>
  }>
  lastAttempt: {
    score: number
    passed: boolean
    submittedAt: string | Date
  } | null
  onSubmitResult: (result: SubmitResult) => void
}

/**
 * Quiz para el estudiante. Sin límite de reintentos: puede volver a enviar
 * las respuestas cuantas veces quiera. La corrección la hace el servidor.
 */
export function QuizView({
  lessonId,
  questions,
  lastAttempt,
  onSubmitResult,
}: QuizViewProps) {
  const submitQuiz = useSubmitQuiz()
  // Respuestas actuales: questionId -> optionId.
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<SubmitResult | null>(null)

  function setAnswer(questionId: string, optionId: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    submitQuiz.mutate(
      {
        lessonId,
        answers: Object.entries(answers).map(([questionId, optionId]) => ({
          questionId,
          optionId,
        })),
      },
      {
        onSuccess: (data) => {
          setResult(data)
          onSubmitResult(data)
        },
      },
    )
  }

  function handleRetry() {
    setResult(null)
    setAnswers({})
  }

  // Resultado del último envío en esta sesión.
  if (result) {
    const passed = result.passed
    return (
      <div className="flex w-full max-w-3xl flex-col items-center gap-4 rounded-3xl border bg-card p-8 text-center shadow-sm animate-fade-up">
        <span
          className={cn(
            'flex size-16 items-center justify-center rounded-full',
            passed
              ? 'bg-success/15 text-success'
              : 'bg-destructive/10 text-destructive',
          )}
        >
          {passed ? (
            <IconCheck className="size-8" />
          ) : (
            <IconX className="size-8" />
          )}
        </span>
        <h2 className="font-heading text-2xl font-bold">
          {passed ? '¡Aprobado!' : 'No aprobado'}
        </h2>
        <p className="text-3xl font-bold">{result.score}%</p>
        <p className="text-sm text-muted-foreground">
          Nota mínima para aprobar: {result.passingScore}%
        </p>
        {!passed && (
          <p className="text-sm text-muted-foreground">
            No te preocupes: puedes reintentarlo cuantas veces quieras.
          </p>
        )}
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={handleRetry}>
            <IconRotate />
            Volver a intentar
          </Button>
        </div>
      </div>
    )
  }

  const answeredCount = Object.keys(answers).length
  const previousAttempt = lastAttempt

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-3xl flex-col gap-8"
    >
      {previousAttempt && (
        <div className="rounded-2xl border bg-muted/50 p-3 text-sm text-muted-foreground">
          Último intento:{' '}
          <span className="font-medium">{previousAttempt.score}%</span> (
          {previousAttempt.passed ? 'aprobado' : 'no aprobado'})
        </div>
      )}

      {questions.map((question, qi) => (
        <fieldset key={question.id} className="flex flex-col gap-3">
          <legend className="rounded-2xl border bg-card px-5 py-4 text-base font-semibold shadow-sm">
            <span className="mr-2 text-primary">{qi + 1}.</span>
            {question.text}
          </legend>
          <div className="flex flex-col gap-2.5">
            {question.options.map((option) => {
              const selected = answers[question.id] === option.id
              return (
                <label
                  key={option.id}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-2xl border bg-card p-4 text-sm shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md focus-within:ring-3 focus-within:ring-ring/30',
                    selected && 'border-primary bg-primary/8 font-medium',
                  )}
                >
                  <input
                    type="radio"
                    name={question.id}
                    checked={selected}
                    onChange={() => setAnswer(question.id, option.id)}
                    className="size-4 accent-[var(--primary)]"
                  />
                  <span
                    className={cn(
                      'flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors',
                      selected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'text-muted-foreground',
                    )}
                  >
                    {String.fromCharCode(65 + question.options.indexOf(option))}
                  </span>
                  {option.text}
                </label>
              )
            })}
          </div>
        </fieldset>
      ))}

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          size="lg"
          disabled={submitQuiz.isPending || answeredCount < questions.length}
        >
          {submitQuiz.isPending ? 'Enviando…' : 'Enviar respuestas'}
        </Button>
        <p className="text-sm text-muted-foreground">
          {answeredCount} de {questions.length} respondidas
        </p>
      </div>

      {submitQuiz.isError && (
        <p className="text-sm text-destructive">{submitQuiz.error.message}</p>
      )}
    </form>
  )
}
