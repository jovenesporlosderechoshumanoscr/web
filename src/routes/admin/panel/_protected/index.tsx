import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/panel/_protected/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/panel/_protected/"!</div>
}
