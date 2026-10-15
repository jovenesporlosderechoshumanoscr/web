import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { uploadImageSchema } from '@/server/validation/blog'

const publicUrlBaseSchema = z
  .string()
  .optional()
  .transform((v) => v ?? '/media')

const uploadImage = createServerFn({ method: 'POST' })
  .validator((input: unknown) => {
    const data = input instanceof FormData ? { file: input.get('file') } : input
    return uploadImageSchema.parse(data)
  })
  .handler(async ({ data }) => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    if (
      !session ||
      (session.user.role !== 'admin' && session.user.role !== 'editor')
    ) {
      throw new Error('Unauthorized')
    }

    const { env } = await import('cloudflare:workers')
    const bucket = env.MEDIA

    const extMap: Record<string, string> = {
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/webp': 'webp',
      'image/gif': 'gif',
      'image/avif': 'avif',
    }
    const ext = extMap[data.file.type]
    const key = `blog/${crypto.randomUUID()}.${ext}`

    const buffer = await data.file.arrayBuffer()
    await bucket.put(key, buffer, {
      httpMetadata: { contentType: data.file.type },
    })

    const publicUrlBase = publicUrlBaseSchema.parse(
      (env as { MEDIA_PUBLIC_URL?: string }).MEDIA_PUBLIC_URL,
    )

    return { url: `${publicUrlBase}/${key}`, key }
  })

export const mediaMutations = {
  uploadImage,
}
