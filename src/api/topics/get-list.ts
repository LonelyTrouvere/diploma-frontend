import type { ApiResponse } from "@/utils/types/response-template";
import { axiosInstance } from "../instance";
import type { Topic } from "./entity";

export const getTopics = async () => {
  const res = (await axiosInstance.get<ApiResponse<Topic[]>>(`/topics/list`)).data;
  return res;
};
