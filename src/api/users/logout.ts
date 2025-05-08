import type { ApiResponse } from "@/utils/types/response-template";
import { axiosInstance } from "../instance";

export const logout = async () => {
  const res = (await axiosInstance.post<ApiResponse<unknown>>(`/users/logout`))
    .data;
  return res;
};
