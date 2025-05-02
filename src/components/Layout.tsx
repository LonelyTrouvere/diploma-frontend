import './Layout.css'
import { Link, type ReactNode } from "@tanstack/react-router";

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
        {
            ROUTES.map((route, index) => <Link to={route.href}><div key={index} className='border-b-2 text-center py-3 hover:bg-blue-200'>{route.name}</div></Link>)
        }
      </nav>
      <div className='w-48'></div>
      <div id="app__content" className="h-fit px-12 py-10">{children}</div>
    </div>
  );
}
