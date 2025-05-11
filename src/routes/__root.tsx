import AppLayout from "@/components/Layout";
import StreamIOClientProvider from "@/utils/context/stream-provider";
import { CurrentUserProvider } from "@/utils/context/user-context";
import { ThemeProvider } from "@emotion/react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import theme from "../theme";

export const Route = createRootRoute({
  component: () => (
    <>
      <CurrentUserProvider>
        <StreamIOClientProvider>
          <ThemeProvider theme={theme}>
            <AppLayout>
              <Outlet />
            </AppLayout>
          </ThemeProvider>
        </StreamIOClientProvider>
      </CurrentUserProvider>
      <TanStackRouterDevtools />
    </>
  ),
});
