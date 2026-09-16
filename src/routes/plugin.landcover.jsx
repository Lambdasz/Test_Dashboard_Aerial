import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/plugin/landcover')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/plugin/landcover"!</div>
}
