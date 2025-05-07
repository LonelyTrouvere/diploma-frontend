import type { ApiResponse } from "@/utils/types/response-template";
import { axiosInstance } from "../instance";
import type { Group } from "./entity";

export const getGroups = async () => {
  const res = (await axiosInstance.get<ApiResponse<Group[]>>(`/groups`)).data;
  return res.data as Group[];
};
