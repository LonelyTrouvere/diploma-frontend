import type { ApiResponse } from "@/utils/types/response-template";
import { axiosInstance } from "../instance";
import type { Event } from "./entity";

type EventTopic = Omit<Event, "id" | "groupId">;

export const postEvent = async (data: EventTopic) => {
  const res = (
    await axiosInstance.post<ApiResponse<{ id: string }>>(`/events`, data)
  ).data;
  return res;
};
