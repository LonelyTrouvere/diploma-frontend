import { useCurrentUser } from '@/utils/context/user-context';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/groups/$id/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  const { currentUser } = useCurrentUser();

  return <div>settings { currentUser?.groups?.name }</div>
}
