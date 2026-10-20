import { useRef, useState } from 'react'
import {
  IconAlignLeft,
  IconArrowDown,
  IconArrowUp,
  IconHeading,
  IconPhoto,
  IconPlayerPlay,
  IconPlus,
  IconTrash,
  IconUpload,
  IconX,
} from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from 'cn'
import { useUploadImage } from '@/functions/blog-client'
import { youtubeEmbedUrl } from '@/lib/youtube'
import { IMAGE_ACCEPT } from '@/server/validation/blog'
import type { PostBlock } from '@/server/validation/blog'

const BLOCK_TYPES = ['heading', 'paragraph', 'image', 'video'] as const

const TYPE_META: Record<
  PostBlock['type'],
  { label: string; Icon: typeof IconHeading }
> = {
  heading: { label: 'Título', Icon: IconHeading },
  paragraph: { label: 'Párrafo', Icon: IconAlignLeft },
  image: { label: 'Imagen', Icon: IconPhoto },
  video: { label: 'Video', Icon: IconPlayerPlay },
}

function newBlock(type: PostBlock['type']): PostBlock {
  switch (type) {
    case 'heading':
      return { type: 'heading', text: '', level: 'h2' }
    case 'paragraph':
      return { type: 'paragraph', text: '' }
    case 'image':
      return { type: 'image', url: '', alt: '' }
    case 'video':
      return { type: 'video', url: '' }
  }
}

type BlockCanvasProps = {
  blocks: PostBlock[]
  onChange: (blocks: PostBlock[]) => void
}

/**
 * Preview editable de la página: los bloques se ven como en la página
 * publicada y se editan inline, con contorno azul al seleccionar y
 * zonas "+" para insertar nuevos bloques.
 */
export function BlockCanvas({ blocks, onChange }: BlockCanvasProps) {
  const [selected, setSelected] = useState<number | null>(null)

  function update(index: number, next: PostBlock) {
    onChange(blocks.map((b, i) => (i === index ? next : b)))
  }

  function remove(index: number) {
    onChange(blocks.filter((_, i) => i !== index))
    setSelected((prev) => {
      if (prev === null) return prev
      if (prev === index)
        return blocks.length <= 1 ? null : Math.min(index, blocks.length - 2)
      return prev > index ? prev - 1 : prev
    })
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= blocks.length) return
    const next = [...blocks]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
    setSelected(target)
  }

  function insert(index: number, type: PostBlock['type']) {
    const next = [...blocks]
    next.splice(index, 0, newBlock(type))
    onChange(next)
    setSelected(index)
  }

  function renderInsertZone(index: number) {
    return (
      <InsertZone
        key={`insert-${index}`}
        onInsert={(type) => insert(index, type)}
      />
    )
  }

  if (blocks.length === 0) {
    return <AddFirstBlock onInsert={(type) => insert(0, type)} />
  }

  return (
    <div className="flex flex-col gap-1">
      {blocks.map((block, index) => (
        <div key={index} className="flex flex-col gap-1">
          {renderInsertZone(index)}
          <BlockWrapper
            block={block}
            index={index}
            total={blocks.length}
            selected={selected === index}
            onSelect={() => setSelected(index)}
            onUpdate={(next) => update(index, next)}
            onMove={(direction) => move(index, direction)}
            onRemove={() => remove(index)}
          />
        </div>
      ))}
      {renderInsertZone(blocks.length)}
    </div>
  )
}

/* ------------------------------ Zona "+" ------------------------------ */

function InsertZone({
  onInsert,
}: {
  onInsert: (type: PostBlock['type']) => void
}) {
  return (
    <div className="group/insert relative flex h-7 items-center justify-center">
      <span className="pointer-events-none absolute inset-x-8 top-1/2 border-t-2 border-dashed border-blue-500/0 transition-colors group-hover/insert:border-blue-500/60" />
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              aria-label="Añadir bloque"
              className="z-10 flex size-6 items-center justify-center rounded-full border-2 border-blue-500 bg-background text-blue-500 opacity-0 shadow-sm transition-opacity hover:bg-blue-500 hover:text-white group-hover/insert:opacity-100 focus-visible:opacity-100 aria-expanded:opacity-100 aria-expanded:bg-blue-500 aria-expanded:text-white"
            />
          }
        >
          <IconPlus className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          {BLOCK_TYPES.map((type) => {
            const { label, Icon } = TYPE_META[type]
            return (
              <DropdownMenuItem key={type} onClick={() => onInsert(type)}>
                <Icon />
                {label}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function AddFirstBlock({
  onInsert,
}: {
  onInsert: (type: PostBlock['type']) => void
}) {
  return (
    <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-blue-500/60 bg-blue-500/5 p-10">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className="flex flex-col items-center gap-2 rounded-2xl p-4 text-blue-600 outline-none transition-colors hover:bg-blue-500/10"
            >
              <span className="flex size-12 items-center justify-center rounded-full border-2 border-blue-500 bg-background">
                <IconPlus className="size-6" />
              </span>
              <span className="text-sm font-medium">Añadir bloque</span>
            </button>
          }
        />
        <DropdownMenuContent align="center">
          {BLOCK_TYPES.map((type) => {
            const { label, Icon } = TYPE_META[type]
            return (
              <DropdownMenuItem key={type} onClick={() => onInsert(type)}>
                <Icon />
                {label}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

/* --------------------------- Bloque editable --------------------------- */

type BlockWrapperProps = {
  block: PostBlock
  index: number
  total: number
  selected: boolean
  onSelect: () => void
  onUpdate: (next: PostBlock) => void
  onMove: (direction: -1 | 1) => void
  onRemove: () => void
}

function BlockWrapper({
  block,
  index,
  total,
  selected,
  onSelect,
  onUpdate,
  onMove,
  onRemove,
}: BlockWrapperProps) {
  const { label } = TYPE_META[block.type]

  return (
    <div
      onClick={onSelect}
      className={cn(
        'group/block relative cursor-pointer rounded-xl transition-all',
        selected
          ? 'ring-2 ring-blue-500'
          : 'ring-1 ring-transparent hover:ring-blue-400/60',
      )}
    >
      <div className="rounded-xl px-3 py-2 sm:px-4 sm:py-3">
        <BlockFields block={block} onUpdate={onUpdate} selected={selected} />
      </div>

      <div
        className={cn(
          'absolute -top-3 right-2 z-10 items-center gap-0.5 rounded-full border bg-popover py-0.5 pr-1 pl-2 shadow-sm',
          selected ? 'flex' : 'hidden group-hover/block:flex',
        )}
      >
        <span className="mr-1 hidden text-xs text-muted-foreground sm:inline">
          {label}
        </span>
        {block.type === 'heading' && (
          <Button
            type="button"
            size="xs"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              onUpdate({
                ...block,
                level: block.level === 'h2' ? 'h3' : 'h2',
              })
            }}
          >
            {block.level.toUpperCase()}
          </Button>
        )}
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          aria-label="Subir bloque"
          disabled={index === 0}
          onClick={(e) => {
            e.stopPropagation()
            onMove(-1)
          }}
        >
          <IconArrowUp />
        </Button>
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          aria-label="Bajar bloque"
          disabled={index === total - 1}
          onClick={(e) => {
            e.stopPropagation()
            onMove(1)
          }}
        >
          <IconArrowDown />
        </Button>
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          aria-label="Eliminar bloque"
          className="text-destructive hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
        >
          <IconTrash />
        </Button>
      </div>
    </div>
  )
}

/* ------------------- Campos inline según tipo de bloque ------------------- */

function BlockFields({
  block,
  onUpdate,
  selected,
}: {
  block: PostBlock
  onUpdate: (next: PostBlock) => void
  selected: boolean
}) {
  switch (block.type) {
    case 'heading':
      return block.level === 'h2' ? (
        <input
          value={block.text}
          onChange={(e) => onUpdate({ ...block, text: e.target.value })}
          placeholder="Título de la sección"
          className="w-full bg-transparent text-2xl font-bold tracking-tight outline-none placeholder:text-muted-foreground/40"
        />
      ) : (
        <input
          value={block.text}
          onChange={(e) => onUpdate({ ...block, text: e.target.value })}
          placeholder="Subtítulo de la sección"
          className="w-full bg-transparent text-xl font-semibold tracking-tight outline-none placeholder:text-muted-foreground/40"
        />
      )
    case 'paragraph':
      return (
        <textarea
          value={block.text}
          onChange={(e) => onUpdate({ ...block, text: e.target.value })}
          placeholder="Contenido del párrafo…"
          rows={1}
          className="w-full resize-none field-sizing-content bg-transparent leading-relaxed text-muted-foreground outline-none placeholder:text-muted-foreground/40"
        />
      )
    case 'image':
      return (
        <ImageBlock block={block} onUpdate={onUpdate} selected={selected} />
      )
    case 'video':
      return (
        <div className="flex flex-col gap-2">
          {block.url ? (
            <div className="aspect-video w-full overflow-hidden rounded-lg border">
              <iframe
                src={youtubeEmbedUrl(block.url)}
                title="Vista previa del video"
                className="size-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/40 text-muted-foreground">
              <IconPlayerPlay className="size-8" />
            </div>
          )}
          {selected && (
            <Input
              value={block.url}
              onChange={(e) => onUpdate({ ...block, url: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=…"
            />
          )}
        </div>
      )
  }
}

function ImageBlock({
  block,
  onUpdate,
  selected,
}: {
  block: Extract<PostBlock, { type: 'image' }>
  onUpdate: (next: PostBlock) => void
  selected: boolean
}) {
  const uploadImage = useUploadImage()
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    uploadImage.mutate(file, {
      onSuccess: (result) => onUpdate({ ...block, url: result.url }),
      onError: () =>
        alert(uploadImage.error?.message ?? 'Error al subir imagen'),
    })
    e.target.value = ''
  }

  return (
    <div className="flex flex-col gap-2">
      {block.url ? (
        <img
          src={block.url}
          alt={block.alt}
          className="w-full rounded-lg border object-cover"
        />
      ) : (
        <button
          type="button"
          className="flex aspect-video w-full items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/40 text-muted-foreground transition-colors hover:border-blue-500/60 hover:text-blue-500"
          onClick={(e) => {
            e.stopPropagation()
            fileInputRef.current?.click()
          }}
        >
          <IconPhoto className="size-8" />
        </button>
      )}
      {selected && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept={IMAGE_ACCEPT}
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={uploadImage.isPending}
              onClick={(e) => {
                e.stopPropagation()
                fileInputRef.current?.click()
              }}
            >
              <IconUpload />
              {uploadImage.isPending ? 'Subiendo…' : 'Reemplazar'}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={uploadImage.isPending}
              onClick={(e) => {
                e.stopPropagation()
                onUpdate({ ...block, url: '', alt: '' })
              }}
            >
              <IconX />
              Quitar
            </Button>
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs">Texto alternativo</Label>
            <Input
              value={block.alt}
              onChange={(e) => onUpdate({ ...block, alt: e.target.value })}
              placeholder="Descripción de la imagen"
            />
          </div>
        </>
      )}
    </div>
  )
}
