import type { ApiResponse } from "@/utils/types/response-template";
import { axiosInstance } from "../instance";

export const login = async (data: {email: string, password: string}) => {
  const res = (await axiosInstance.post<ApiResponse<{ token: string }>>(`/users/login`, data)).data;
  return res;
};
