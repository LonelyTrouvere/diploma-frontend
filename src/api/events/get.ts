import type { ApiResponse } from "@/utils/types/response-template";
import { axiosInstance } from "../instance";
import type { Event } from "./entity";

type GetEvents = Partial<{
  topicId: string;
  before: string;
  after: string;
}>;

export const getEvents = async (data: GetEvents) => {
  const querystring = [
    data.topicId ? `topicId=${data.topicId}` : "",
    data.before ? `before=${data.before}` : "",
    data.after ? `after=${data.after}` : "",
  ]
    .filter((q) => q)
    .join("&");
  const res = (
    await axiosInstance.get<ApiResponse<Event[]>>(`/events?${querystring}`)
  ).data;
  return res;
};
