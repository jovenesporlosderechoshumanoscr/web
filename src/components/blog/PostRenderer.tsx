import { youtubeEmbedUrl } from '@/lib/youtube'
import type { PostBlock } from '@/server/validation/blog'

/** Render de un bloque individual, igual que se ve en la página publicada. */
export function BlockView({ block }: { block: PostBlock }) {
  switch (block.type) {
    case 'heading':
      return block.level === 'h2' ? (
        <h2 className="text-2xl font-bold tracking-tight break-words">
          {block.text}
        </h2>
      ) : (
        <h3 className="text-xl font-semibold tracking-tight break-words">
          {block.text}
        </h3>
      )
    case 'paragraph':
      return (
        <p className="leading-relaxed break-words text-muted-foreground">
          {block.text}
        </p>
      )
    case 'image':
      return (
        <figure className="flex flex-col gap-2">
          <img
            src={block.url}
            alt={block.alt}
            className="w-full rounded-lg border object-cover"
          />
          {block.alt && (
            <figcaption className="text-center text-sm text-muted-foreground">
              {block.alt}
            </figcaption>
          )}
        </figure>
      )
    case 'video':
      return (
        <div className="aspect-video w-full overflow-hidden rounded-lg border">
          <iframe
            src={youtubeEmbedUrl(block.url)}
            title="Video"
            className="size-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )
  }
}

export function PostRenderer({ blocks }: { blocks: PostBlock[] }) {
  return (
    <div className="mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-6">
      {blocks.map((block, index) => (
        <BlockView key={index} block={block} />
      ))}
    </div>
  )
}
