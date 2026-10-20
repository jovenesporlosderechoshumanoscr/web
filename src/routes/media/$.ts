import { env } from 'cloudflare:workers'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/media/$')({
  server: {
    handlers: {
      GET: async ({ params }: { params: { _splat: string } }) => {
        const key = decodeURIComponent(params._splat)
        if (!key.startsWith('blog/')) {
          return new Response('Not found', { status: 404 })
        }

        const object = await env.MEDIA.get(key)
        if (!object) {
          return new Response('Not found', { status: 404 })
        }

        return new Response(object.body, {
          headers: {
            'Content-Type':
              object.httpMetadata?.contentType ?? 'application/octet-stream',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        })
      },
    },
  },
})
