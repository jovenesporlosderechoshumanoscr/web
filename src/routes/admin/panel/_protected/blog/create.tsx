import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { PostEditor } from '@/components/blog/PostEditor'
import { useCreatePost } from '@/functions/blog-client'

export const Route = createFileRoute('/admin/panel/_protected/blog/create')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const createPost = useCreatePost()

  return (
    <>
      <PostEditor
        mode="create"
        isSubmitting={createPost.isPending}
        serverError={createPost.isError ? createPost.error.message : null}
        onSubmit={(values) => {
          createPost.mutate(values, {
            onSuccess: () => {
              navigate({ to: '/admin/panel/blog' })
            },
          })
        }}
        onCancel={() => navigate({ to: '/admin/panel/blog' })}
      />
    </>
  )
}
