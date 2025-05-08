import type { ApiResponse } from "@/utils/types/response-template";
import { axiosInstance } from "../instance";
import type { Group } from "./entity";

type PostGroup = Omit<Group, "id">;

export const postGroup = async (data: PostGroup) => {
  const res = (await axiosInstance.post<ApiResponse<unknown>>(`/groups`, data)).data;
  return res;
};
