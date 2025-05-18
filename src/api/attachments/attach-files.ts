import type { ApiResponse } from "@/utils/types/response-template";
import { axiosInstance } from "../instance";
import type { Attachment } from "./entity";

export const attachFiles = async (data: Attachment[]) => {
  const res = (
    await axiosInstance.post<ApiResponse<string[]>>(`/uploads/attach`, data)
  ).data;
  return res;
};
