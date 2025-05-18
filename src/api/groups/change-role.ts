import type { ApiResponse } from "@/utils/types/response-template";
import { axiosInstance } from "../instance";
import type { USER_ROLE } from "./entity";

export const changeRole = async (data: {
  userId: string;
  role: (typeof USER_ROLE)[keyof typeof USER_ROLE];
}) => {
  const res = (
    await axiosInstance.post<ApiResponse<unknown>>(`/groups/change-role`, data)
  ).data;
  return res;
};
