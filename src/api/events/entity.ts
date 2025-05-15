export const EventTypeEnum = Object.freeze({
    meeting: 'meeting',
    deadline: 'deadline'
})

export type EventTypeEnum = typeof EventTypeEnum[keyof typeof EventTypeEnum]

export interface Event {
    id: number
    description?: string
    groupId: string
    recurring?: boolean
    topicId: string
    recurringRule?: number
    date: string
    type: EventTypeEnum
}