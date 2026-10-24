import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/teerms-service')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/teerms-service"!</div>
}
