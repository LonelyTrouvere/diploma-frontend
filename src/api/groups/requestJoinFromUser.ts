import type { ApiResponse } from "@/utils/types/response-template";
import { axiosInstance } from "../instance";

export const joinRequestFromUser = async (data: string) => {
  const res = (
    await axiosInstance.post<ApiResponse<unknown>>(
      `/groups/request-from-user`,
      { groupId: data }
    )
  ).data;
  return res;
};
