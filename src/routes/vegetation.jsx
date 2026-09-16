import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/vegetation')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/vegetation"!</div>
}
