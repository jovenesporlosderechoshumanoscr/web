import { useState } from 'react'
import { IconCheck, IconRotate, IconX } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useSubmitQuiz } from '@/functions/course-client'

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
      <div className="flex w-full max-w-3xl flex-col items-center gap-4 rounded-2xl border p-8 text-center">
        <span
          className={`flex size-16 items-center justify-center rounded-full text-4xl ${
            passed
              ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-400/20'
              : 'bg-red-100 text-red-600 dark:bg-red-400/20'
          }`}
        >
          {passed ? (
            <IconCheck className="size-8" />
          ) : (
            <IconX className="size-8" />
          )}
        </span>
        <h2 className="text-2xl font-bold">
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
      className="flex w-full max-w-3xl flex-col gap-6"
    >
      {previousAttempt && (
        <div className="rounded-xl border bg-muted/40 p-3 text-sm text-muted-foreground">
          Último intento:{' '}
          <span className="font-medium">{previousAttempt.score}%</span> (
          {previousAttempt.passed ? 'aprobado' : 'no aprobado'})
        </div>
      )}

      {questions.map((question, qi) => (
        <fieldset key={question.id} className="flex flex-col gap-3">
          <legend className="text-base font-semibold">
            {qi + 1}. {question.text}
          </legend>
          <div className="flex flex-col gap-2">
            {question.options.map((option) => (
              <label
                key={option.id}
                className="flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm transition-colors hover:bg-accent has-[:checked]:border-ring has-[:checked]:bg-accent"
              >
                <input
                  type="radio"
                  name={question.id}
                  checked={answers[question.id] === option.id}
                  onChange={() => setAnswer(question.id, option.id)}
                  className="size-4"
                />
                {option.text}
              </label>
            ))}
          </div>
        </fieldset>
      ))}

      <div className="flex items-center gap-3">
        <Button
          type="submit"
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
