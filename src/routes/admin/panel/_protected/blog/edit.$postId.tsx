import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { PostEditor } from '@/components/blog/PostEditor'
import { usePost, useUpdatePost } from '@/functions/blog-client'
import type { PostBlock } from '@/server/validation/blog'

export const Route = createFileRoute(
  '/admin/panel/_protected/blog/edit/$postId',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { postId } = Route.useParams()
  const navigate = useNavigate()
  const postQuery = usePost(postId)
  const updatePost = useUpdatePost()

  if (postQuery.isPending) {
    return <p className="p-4 text-sm">Cargando página…</p>
  }

  if (postQuery.isError || !postQuery.data) {
    return <p className="p-4 text-sm text-destructive">Página no encontrada.</p>
  }

  const post = postQuery.data

  return (
    <>
      <PostEditor
        mode="edit"
        initialValues={{
          title: post.title,
          slug: post.slug,
          status: post.status,
          blocks: post.blocks as unknown as PostBlock[] | null,
          excerpt: post.excerpt,
          coverImage: post.coverImage,
        }}
        isSubmitting={updatePost.isPending}
        serverError={updatePost.isError ? updatePost.error.message : null}
        onSubmit={(values) => {
          updatePost.mutate(
            { id: postId, ...values },
            {
              onSuccess: () => {
                navigate({ to: '/admin/panel/blog' })
              },
            },
          )
        }}
        onCancel={() => navigate({ to: '/admin/panel/blog' })}
      />
    </>
  )
}
