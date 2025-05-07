import type { ApiResponse } from "@/utils/types/response-template";
import { axiosInstance } from "../instance";
import type { User } from "./entity";

export const getUser = async () => {
  const res = (await axiosInstance.get<ApiResponse<User>>(`/users`)).data;
  return res;
};
