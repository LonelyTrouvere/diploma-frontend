import type { ApiResponse } from "@/utils/types/response-template";
import { axiosInstance } from "../instance";

export const declineRequest = async (data: {userId: string, groupId: string}) => {
  const res = (await axiosInstance.post<ApiResponse<unknown>>(`/groups/decline`, data)).data;
  return res;
};
