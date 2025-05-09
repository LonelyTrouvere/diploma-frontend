import type { ApiResponse } from "@/utils/types/response-template";
import { axiosInstance } from "../instance";
import type { Topic } from "./entity";

type PostTopic = Omit<Topic, "id" | "created" | "groupId">;

export const postTopic = async (data: PostTopic) => {
  const res = (
    await axiosInstance.post<ApiResponse<{ id: string }>>(`/topics`, data)
  ).data;
  return res;
};
