import AppLayout from "@/components/Layout";
import { CurrentUserProvider } from "@/utils/context/user-context";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <CurrentUserProvider>
        <AppLayout>
          <Outlet />
        </AppLayout>
      </CurrentUserProvider>
      <TanStackRouterDevtools />
    </>
  ),
});
