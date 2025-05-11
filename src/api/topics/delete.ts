import type { ApiResponse } from "@/utils/types/response-template";
import { axiosInstance } from "../instance";

export const deleteTopic = async (id: string) => {
  const res = (
    await axiosInstance.post<ApiResponse<unknown>>(`/topics/delete`, {
      topicId: id,
    })
  ).data;
  return res;
};
