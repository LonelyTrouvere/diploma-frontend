import "./Layout.css";
import { Link, type ReactNode } from "@tanstack/react-router";
import NavDiv from "./styled/NavDiv";
import { useEffect } from "react";
import { useCurrentUser } from "@/utils/context/user-context";

const ROUTES_GUEST = [
  {
    name: "Login",
    href: "/login",
  },
  {
    name: "Sign up",
    href: "/signup",
  },
];

const ROUTES_USER = [
  {
    name: "Groups",
    href: "/groups",
  },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const { currentUser, fetchCurrentUser } = useCurrentUser();

  useEffect(() => {
    fetchCurrentUser();
  }, []);
  const routes = currentUser ? ROUTES_USER : ROUTES_GUEST;

  return (
    <div id="app__layout" className="flex">
      <nav
        id="app__navigation"
        className="w-48 h-screen fixed shadow-2xl flex flex-col bg-fuchsia-50"
      >
        {routes.map((route, index) => (
          <Link to={route.href}>
            <NavDiv key={index}>{route.name}</NavDiv>
          </Link>
        ))}
      </nav>
      <div className="w-48"></div>
      <div id="app__content" className="h-fit w-[100%] px-12 py-10">
        {children}
      </div>
    </div>
  );
}
