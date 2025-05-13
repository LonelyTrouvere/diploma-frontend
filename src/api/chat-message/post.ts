import type { ApiResponse } from "@/utils/types/response-template";
import { axiosInstance } from "../instance";
import type { ChatMessage } from "./entity";

type PostChatMessage = Omit<ChatMessage, "id" | "userId" | "timestamp" | 'groupId' | 'seen' | 'name'>;

export const postMessage = async (data: PostChatMessage) => {
  const res = (
    await axiosInstance.post<ApiResponse<{ id: string }>>(`/chat`, data)
  ).data;
  return res;
};
