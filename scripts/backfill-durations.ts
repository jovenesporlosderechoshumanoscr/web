/**
 * Rellena `lesson.estimated_minutes` para las lecciones existentes que no
 * tengan un valor (null = cálculo automático).
 *
 * Modos:
 * - Remoto (default): habla con la API REST de D1 (el proyecto usa
 *   drizzle-orm RC, que ya no expone el driver d1-http) con las variables
 *   CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_DATABASE_ID / CLOUDFLARE_D1_TOKEN.
 * - `--local`: actualiza la BD sqlite de desarrollo de wrangler
 *   (.wrangler/state/v3/d1) directamente con node:sqlite.
 *
 * Ejecutar con: pnpm tsx scripts/backfill-durations.ts [--local]
 */
import 'dotenv/config'
import { DatabaseSync } from 'node:sqlite'
import { readdirSync } from 'node:fs'
import { estimateLessonMinutes } from '../src/lib/lesson-duration'
import type { PostBlock } from '../src/server/validation/blog'

type LessonRow = {
  id: string
  title: string
  type: string
  content: string | null
  estimated_minutes: number | null
}

function estimateRow(row: {
  id: string
  type: string
  content: string | null
}, questionCount: number): number {
  const type: 'reading' | 'quiz' = row.type === 'quiz' ? 'quiz' : 'reading'
  // El contenido llega como JSON en texto (modo json en drizzle).
  const content = row.content ? (JSON.parse(row.content) as PostBlock[]) : null
  return estimateLessonMinutes({ type, content, questionCount })
}

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
  if (process.argv.includes('--local')) {
    return mainLocal()
  }
  return mainRemote()
}

/** Backfill sobre la BD sqlite local de wrangler (desarrollo). */
function mainLocal() {
  const dir = '.wrangler/state/v3/d1/miniflare-D1DatabaseObject'
  const files = readdirSync(dir).filter(
    (f) => f.endsWith('.sqlite') && f !== 'metadata.sqlite',
  )

  let updated = 0
  let total = 0

  for (const file of files) {
    const db = new DatabaseSync(`${dir}/${file}`)

    // Solo los archivos que tengan la tabla lesson CON la columna nueva
    // (por si quedan BD viejas de esquemas anteriores).
    const hasColumn = db
      .prepare('PRAGMA table_info(lesson)')
      .all()
      .some((c) => (c as { name: string }).name === 'estimated_minutes')
    if (!hasColumn) {
      db.close()
      continue
    }

    const lessons = db
      .prepare('SELECT id, title, type, content, estimated_minutes FROM lesson')
      .all() as LessonRow[]
    const update = db.prepare(
      'UPDATE lesson SET estimated_minutes = ? WHERE id = ?',
    )

    for (const row of lessons) {
      total += 1
      if (row.estimated_minutes != null) continue

      let questionCount = 0
      if (row.type === 'quiz') {
        const q = db
          .prepare('SELECT count(*) as n FROM quiz_question WHERE lesson_id = ?')
          .get(row.id) as { n: number }
        questionCount = q.n
      }

      const minutes = estimateRow(row, questionCount)
      update.run(minutes, row.id)
      updated += 1
      console.log(`✓ ${row.title} → ${minutes} min`)
    }

    db.close()
  }

  console.log(
    `\nListo (local): ${updated} de ${total} lecciones actualizadas en ${files.length} archivo(s).`,
  )
}

/** Backfill sobre la BD remota de D1 vía API REST. */
async function mainRemote() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const databaseId = process.env.CLOUDFLARE_DATABASE_ID
  const token = process.env.CLOUDFLARE_D1_TOKEN
  if (!accountId || !databaseId || !token) {
    throw new Error(
      'Faltan CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_DATABASE_ID / CLOUDFLARE_D1_TOKEN en .env',
    )
  }
  const creds = { accountId, databaseId, token }

  const lessons = await d1Query<LessonRow>(
    creds,
    'SELECT id, title, type, content, estimated_minutes FROM lesson',
  )

  let updated = 0
  for (const row of lessons) {
    if (row.estimated_minutes != null) continue

    let questionCount = 0
    if (row.type === 'quiz') {
      const questions = await d1Query<{ id: string }>(
        creds,
        'SELECT id FROM quiz_question WHERE lesson_id = ?',
        [row.id],
      )
      questionCount = questions.length
    }

    const minutes = estimateRow(row, questionCount)

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
