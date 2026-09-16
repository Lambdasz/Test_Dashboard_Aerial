import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/plugin/trees')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/plugin/trees"!</div>
}
