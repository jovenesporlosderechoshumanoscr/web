import { youtubeEmbedUrl } from '@/lib/youtube'
import type { BlockSpacing, PostBlock } from '@/server/validation/blog'

/** Clase Tailwind del margen inferior según el espaciado configurado. */
export const SPACING_CLASS: Record<BlockSpacing, string> = {
  none: 'mb-0',
  sm: 'mb-2',
  md: 'mb-6',
  lg: 'mb-10',
  xl: 'mb-16',
}

/** Margen inferior de un bloque; `md` es el valor por defecto. */
export function spacingClass(spacing?: BlockSpacing): string {
  return SPACING_CLASS[spacing ?? 'md']
}

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
    <div className="mx-auto flex w-full min-w-0 max-w-3xl flex-col">
      {blocks.map((block, index) => (
        <div
          key={index}
          className={
            index < blocks.length - 1 ? spacingClass(block.spacing) : undefined
          }
        >
          <BlockView block={block} />
        </div>
      ))}
    </div>
  )
}
