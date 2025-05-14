import "./Layout.css";
import { Link, useNavigate, type ReactNode } from "@tanstack/react-router";
import NavDiv from "./styled/NavDiv";
import { useEffect } from "react";
import { useCurrentUser } from "@/utils/context/user-context";
import { logout } from "@/api/users/logout";
import type { Route } from "@/utils/types/route";

export default function AppLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { currentUser, fetchCurrentUser, setCurrentUser } = useCurrentUser();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const ROUTES_GUEST: Route[] = [
    {
      name: "Login",
      href: "/login",
    },
    {
      name: "Sign up",
      href: "/signup",
    },
  ];

  const ROUTES_USER: Route[] = [
    {
      name: "Groups",
      href: "/groups",
    },
    {
      name: "Log out",
      href: "/logout",
      action: async () => {
        const res = await logout();
        if (res.success) {
          setCurrentUser(null);
          navigate({ to: "/" });
        }
      },
    },
  ];

  const ROUTES_GROUP: Route[] = [
    {
      name: "Groups",
      href: "/groups",
    },
    {
      name: "Main",
      href: `/groups/${currentUser?.groups?.id}`,
    },
    {
      name: "Chat",
      href: `/groups/${currentUser?.groups?.id}/chat`,
    },
    {
      name: "Calendar",
      href: `/groups/${currentUser?.groups?.id}/calendar`,
    },
    {
      name: "Settings",
      href: `/groups/${currentUser?.groups?.id}/settings`,
    },
    {
      name: "Log out",
      href: "/logout",
      action: async () => {
        const res = await logout();
        if (res.success) {
          setCurrentUser(null);
          navigate({ to: "/" });
        }
      },
    },
  ];
  const routes = currentUser?.groups
    ? ROUTES_GROUP
    : currentUser
      ? ROUTES_USER
      : ROUTES_GUEST;

  return (
    <div id="app__layout" className="flex">
      <nav
        id="app__navigation"
        className="w-48 h-screen fixed shadow-2xl flex flex-col bg-fuchsia-50"
      >
        {routes.map((route, index) => {
          if (route.action) {
            return (
              <NavDiv key={route.name}>
                <div
                  className="w-[100%] h-[100%] flex justify-center content-center"
                  onClick={route.action}
                >
                  <span className="action-span">{route.name}</span>
                </div>
              </NavDiv>
            );
          } else {
            return (
              <Link to={route.href} key={route.name}>
                <NavDiv key={index}>{route.name}</NavDiv>
              </Link>
            );
          }
        })}
      </nav>
      <div className="w-48"></div>
      <div id="app__content" className="h-fit w-[100%]">
        {children}
      </div>
    </div>
  );
}
