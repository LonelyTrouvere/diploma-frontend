import type { MouseEventHandler } from "react"

export interface Route {
    name: string
    href: string
    action?: MouseEventHandler<HTMLDivElement>
}