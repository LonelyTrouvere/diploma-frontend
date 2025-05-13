import type { ApiResponse } from "@/utils/types/response-template";
import { axiosInstance } from "../instance";
import type { ChatMessage } from "./entity";

export const getMessages = async (receiverId: string) => {
  const res = (
    await axiosInstance.get<ApiResponse<ChatMessage[]>>(`/chat/messages?receiverId=${receiverId}`)
  ).data;
  return res;
};
