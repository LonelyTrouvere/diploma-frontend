import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/groups/$id/$topicId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/groups/$id/$topicId"!</div>
}
