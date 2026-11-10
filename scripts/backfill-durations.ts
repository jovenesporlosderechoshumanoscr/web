/**
 * Rellena `lesson.estimated_minutes` para las lecciones existentes que no
 * tengan un valor (null = cálculo automático).
 *
 * Habla directo con la API REST de D1 (el proyecto usa drizzle-orm RC, que
 * ya no expone el driver d1-http) con las variables de entorno
 * CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_DATABASE_ID / CLOUDFLARE_D1_TOKEN.
 *
 * Ejecutar con: pnpm tsx scripts/backfill-durations.ts
 */
import 'dotenv/config'
import { estimateLessonMinutes } from '../src/lib/lesson-duration'
import type { PostBlock } from '../src/server/validation/blog'

type QueryResult<T> = { success: boolean; results: T[]; errors?: unknown[] }

async function d1Query<T>(
  creds: { accountId: string; databaseId: string; token: string },
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${creds.accountId}/d1/database/${creds.databaseId}/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${creds.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
    },
  )
  if (!res.ok) {
    throw new Error(`D1 HTTP ${res.status}: ${await res.text()}`)
  }
  const json: { result: QueryResult<T>[] } = await res.json()
  if (json.result[0]?.errors?.length) {
    throw new Error(`D1 error: ${JSON.stringify(json.result[0].errors)}`)
  }
  return json.result[0]?.results ?? []
}

async function main() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const databaseId = process.env.CLOUDFLARE_DATABASE_ID
  const token = process.env.CLOUDFLARE_D1_TOKEN
  if (!accountId || !databaseId || !token) {
    throw new Error(
      'Faltan CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_DATABASE_ID / CLOUDFLARE_D1_TOKEN en .env',
    )
  }
  const creds = { accountId, databaseId, token }

  const lessons = await d1Query<{
    id: string
    title: string
    type: string
    content: string | null
    estimated_minutes: number | null
  }>(creds, 'SELECT id, title, type, content, estimated_minutes FROM lesson')

  let updated = 0
  for (const row of lessons) {
    if (row.estimated_minutes != null) continue

    const type: 'reading' | 'quiz' = row.type === 'quiz' ? 'quiz' : 'reading'
    let questionCount = 0
    if (type === 'quiz') {
      const questions = await d1Query<{ id: string }>(
        creds,
        'SELECT id FROM quiz_question WHERE lesson_id = ?',
        [row.id],
      )
      questionCount = questions.length
    }

    // El contenido llega como JSON en texto (modo json en drizzle).
    const content = row.content
      ? (JSON.parse(row.content) as PostBlock[])
      : null

    const minutes = estimateLessonMinutes({
      type,
      content,
      questionCount,
    })

    await d1Query(
      creds,
      'UPDATE lesson SET estimated_minutes = ? WHERE id = ?',
      [minutes, row.id],
    )
    updated += 1
    console.log(`✓ ${row.title} → ${minutes} min`)
  }

  console.log(
    `\nListo: ${updated} de ${lessons.length} lecciones actualizadas.`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
