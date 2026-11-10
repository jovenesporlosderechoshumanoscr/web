import type { PostBlock } from '@/server/validation/blog'

/**
 * Estimación de duración de una lección en minutos.
 *
 * - Lectura: ~200 palabras/min, +1 min por cada 3 imágenes y +5 min por
 *   video incrustado (duración desconocida sin API externa).
 * - Quiz: 2 min base + 1 min por pregunta.
 *
 * El valor guardado en `lesson.estimatedMinutes` (override manual) siempre
 * gana sobre este cálculo.
 */
export function estimateLessonMinutes(input: {
  type: 'reading' | 'quiz'
  content?: PostBlock[] | null
  questionCount?: number
}): number {
  if (input.type === 'quiz') {
    return Math.max(3, 2 + (input.questionCount ?? 0))
  }

  const blocks = input.content ?? []
  const words = blocks
    .filter((b) => b.type === 'paragraph' || b.type === 'heading')
    .map((b) => b.text.trim().split(/\s+/).filter(Boolean).length)
    .reduce((sum, n) => sum + n, 0)
  const readingMinutes = Math.ceil(words / 200)
  const imageMinutes = Math.ceil(
    blocks.filter((b) => b.type === 'image').length / 3,
  )
  const videoMinutes = blocks.filter((b) => b.type === 'video').length * 5

  // Mínimo 2 min: toda lección lleva al menos un poco de tiempo.
  return Math.max(2, readingMinutes + imageMinutes + videoMinutes)
}

/** "25 min", "1 h 20 min" (sin el sufijo de aproximación). */
export function formatMinutes(minutes: number | null | undefined): string {
  if (minutes == null) return ''
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`
}

/** "≈ 25 min" para mostrar junto a duraciones estimadas. */
export function formatEstimated(minutes: number | null | undefined): string {
  const formatted = formatMinutes(minutes)
  return formatted ? `≈ ${formatted}` : ''
}
