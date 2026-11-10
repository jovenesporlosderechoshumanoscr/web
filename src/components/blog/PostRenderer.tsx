import { useState } from 'react'
import { youtubeEmbedUrl } from '@/lib/youtube'
import type { BlockSpacing, PostBlock } from '@/server/validation/blog'
import { Lightbox } from '@/components/student/Lightbox'

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

/** Estilo del render: blog público o lección (columna de lectura). */
export type BlockVariant = 'default' | 'lesson'

/** Imagen con caption y lightbox (solo se usa en lecciones). */
function LessonImageView({
  block,
}: {
  block: Extract<PostBlock, { type: 'image' }>
}) {
  const [zoomed, setZoomed] = useState(false)

  return (
    <figure className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setZoomed(true)}
        aria-label={
          block.alt ? `Ampliar imagen: ${block.alt}` : 'Ampliar imagen'
        }
        className="cursor-zoom-in overflow-hidden rounded-2xl border border-border bg-muted shadow-sm transition-shadow hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
      >
        <img
          src={block.url}
          alt={block.alt}
          loading="lazy"
          className="w-full object-cover"
        />
      </button>
      {block.alt && (
        <figcaption className="text-center text-sm text-muted-foreground">
          {block.alt}
        </figcaption>
      )}
      {zoomed && (
        <Lightbox
          src={block.url}
          alt={block.alt}
          onClose={() => setZoomed(false)}
        />
      )}
    </figure>
  )
}

/** Render de un bloque individual, igual que se ve en la página publicada. */
export function BlockView({
  block,
  variant = 'default',
}: {
  block: PostBlock
  variant?: BlockVariant
}) {
  if (variant === 'lesson' && block.type === 'image') {
    return <LessonImageView block={block} />
  }

  switch (block.type) {
    case 'heading':
      return block.level === 'h2' ? (
        <h2
          className={
            variant === 'lesson'
              ? 'mt-2 flex items-center gap-3 text-2xl font-bold tracking-tight break-words before:bg-primary before:inline-block before:h-5 before:w-1.5 before:rounded-full before:content-[""]'
              : 'text-2xl font-bold tracking-tight break-words'
          }
        >
          {block.text}
        </h2>
      ) : (
        <h3 className="text-xl font-semibold tracking-tight break-words">
          {block.text}
        </h3>
      )
    case 'paragraph':
      return (
        <p
          className={
            variant === 'lesson'
              ? 'text-[17px] leading-8 break-words text-foreground'
              : 'leading-relaxed break-words text-muted-foreground'
          }
        >
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
        <div
          className={
            variant === 'lesson'
              ? 'relative mx-0 aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black shadow-md sm:mx-[-2rem] lg:mx-[-3rem]'
              : 'aspect-video w-full overflow-hidden rounded-lg border'
          }
        >
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

export function PostRenderer({
  blocks,
  variant = 'default',
}: {
  blocks: PostBlock[]
  variant?: BlockVariant
}) {
  return (
    <div className="mx-auto flex w-full min-w-0 max-w-3xl flex-col">
      {blocks.map((block, index) => (
        <div
          key={index}
          className={
            index < blocks.length - 1 ? spacingClass(block.spacing) : undefined
          }
        >
          <BlockView block={block} variant={variant} />
        </div>
      ))}
    </div>
  )
}
