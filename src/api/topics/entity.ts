export interface Topic {
  id: string;
  name: string;
  description?: string;
  created: string;
  groupId: string;
  meetingId?: string;
  recurring?: boolean;
  meetingFirstDate?: string;
}
