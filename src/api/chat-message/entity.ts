export interface ChatMessage {
  id: number;
  message: string;
  timestamp: string;
  userId: string;
  groupId: string;
  receiverId: string;
  seen: boolean;
  name: string;
}
