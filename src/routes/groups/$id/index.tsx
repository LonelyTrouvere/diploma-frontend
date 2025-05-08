import { useCurrentUser } from '@/utils/context/user-context';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/groups/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { currentUser } = useCurrentUser();

  return <div>{ currentUser?.groups?.name }</div>
}
