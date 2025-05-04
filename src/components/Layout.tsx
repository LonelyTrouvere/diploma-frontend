import { SignedOut, SignInButton, SignOutButton, SignUpButton } from '@clerk/clerk-react';
import './Layout.css'
import { Link, type ReactNode } from "@tanstack/react-router";
import NavDiv from './styled/NavDiv';

const ROUTES = [
    {
        name: 'Sign in',
        href: '/signin',
    },
    {
        name: 'Sign up',
        href: '/signup'
    }
]

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div id="app__layout" className="flex">
      <nav id="app__navigation" className="w-48 h-screen fixed shadow-2xl flex flex-col bg-blue-50">
      <SignedOut>
        <NavDiv><SignInButton forceRedirectUrl='/groups'/></NavDiv>
        <NavDiv><SignUpButton forceRedirectUrl='/groups'/></NavDiv>
      </SignedOut>
        {
            ROUTES.map((route, index) => <Link to={route.href}><NavDiv key={index}>{route.name}</NavDiv></Link>)
        }
        <NavDiv><SignOutButton /></NavDiv>
      </nav>
      <div className='w-48'></div>
      <div id="app__content" className="h-fit w-[100%] px-12 py-10">{children}</div>
    </div>
  );
}
