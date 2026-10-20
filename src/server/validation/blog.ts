import { z } from 'zod'

export const POST_STATUSES = ['draft', 'published'] as const
export type PostStatus = (typeof POST_STATUSES)[number]

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 100)

export const slugSchema = z
  .string()
  .trim()
  .min(1, 'El slug es requerido')
  .max(100)
  .regex(slugRegex, 'Slug inválido (solo minúsculas, números y guiones)')

export const postStatusSchema = z.enum(POST_STATUSES)

export type PostBlock =
  | { type: 'heading'; text: string; level: 'h2' | 'h3' }
  | { type: 'paragraph'; text: string }
  | { type: 'image'; url: string; alt: string }
  | { type: 'video'; url: string }

export const postBlockSchema: z.ZodType<PostBlock> = z.discriminatedUnion(
  'type',
  [
    z.object({
      type: z.literal('heading'),
      text: z
        .string()
        .trim()
        .min(1, 'El título del bloque es requerido')
        .max(200),
      level: z.enum(['h2', 'h3']).default('h2'),
    }),
    z.object({
      type: z.literal('paragraph'),
      text: z.string().trim().min(1, 'El párrafo es requerido').max(5000),
    }),
    z.object({
      type: z.literal('image'),
      url: z.string().trim().min(1, 'La imagen es requerida').max(2000),
      alt: z.string().trim().max(300).default(''),
    }),
    z.object({
      type: z.literal('video'),
      url: z
        .string()
        .trim()
        .min(1, 'La URL del video es requerida')
        .max(2000)
        .refine(
          (url) =>
            /^(https:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+|https:\/\/(www\.)?youtu\.be\/[\w-]+|https:\/\/(www\.)?youtube\.com\/embed\/[\w-]+)/i.test(
              url,
            ),
          'URL de YouTube inválida',
        ),
    }),
  ],
)

export const postBlocksSchema = z
  .array(postBlockSchema)
  .min(1, 'La página debe tener al menos un bloque')

/** Filtros de búsqueda + paginación para el listado admin. */
export const getPostsSchema = z.object({
  title: z.string().trim().min(1).max(150).optional(),
  status: postStatusSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
})

export type GetPostsInput = z.infer<typeof getPostsSchema>

export const getPostByIdSchema = z.object({ id: z.string().min(1) })
export type GetPostByIdInput = z.infer<typeof getPostByIdSchema>

export const getPostBySlugSchema = z.object({
  slug: z.string().min(1).max(100),
})
export type GetPostBySlugInput = z.infer<typeof getPostBySlugSchema>

/** Listado público: solo publicados. */
export const getPublicPostsSchema = getPostsSchema

export const createPostSchema = z.object({
  title: z.string().trim().min(1, 'El título es requerido').max(200),
  slug: slugSchema,
  status: postStatusSchema.default('draft'),
  blocks: postBlocksSchema,
  excerpt: z
    .string()
    .trim()
    .max(300)
    .nullish()
    .transform((v) => v ?? null),
  coverImage: z
    .string()
    .trim()
    .max(2000)
    .nullish()
    .transform((v) => v ?? null),
})

export type CreatePostInput = z.infer<typeof createPostSchema>

export const updatePostSchema = createPostSchema
  .partial()
  .extend({ id: z.string().min(1) })

export type UpdatePostInput = z.infer<typeof updatePostSchema>

export const deletePostSchema = z.object({ id: z.string().min(1) })
export type DeletePostInput = z.infer<typeof deletePostSchema>

/** Tipos de imagen aceptados para subida a R2 (sin SVG/XML por riesgo XSS). */
export const IMAGE_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
  'image/avif',
] as const

/** Valor para el atributo accept de inputs de archivo. */
export const IMAGE_ACCEPT = IMAGE_MIME_TYPES.join(',')

/** Subida de imagen a R2. */
export const uploadImageSchema = z.object({
  file: z
    .instanceof(File)
    .refine((f) => f.size > 0, 'El archivo está vacío')
    .refine((f) => f.size <= 5 * 1024 * 1024, 'Máximo 5MB')
    .refine(
      (f) => (IMAGE_MIME_TYPES as readonly string[]).includes(f.type),
      'Formato inválido (png, jpeg, webp, gif, avif)',
    ),
})

export type UploadImageInput = z.infer<typeof uploadImageSchema>
