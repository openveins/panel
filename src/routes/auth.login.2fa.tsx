import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/login/2fa')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/auth/login/2fa"!</div>
}
