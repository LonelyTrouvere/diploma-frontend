import type { Event } from "../events/entity";

export interface Topic {
  id: string;
  name: string;
  description?: string;
  created: string;
  groupId: string;
  meetingId?: string;
  events: Event[];
}
