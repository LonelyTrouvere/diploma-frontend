import type { ApiResponse } from "@/utils/types/response-template";
import { axiosInstance } from "../instance";
import type { Attachment } from "./entity";

type GetAttachments = {
  topicId: string;
};

export const getAttachments = async (data: GetAttachments) => {
  const res = (
    await axiosInstance.get<ApiResponse<Attachment[]>>(`/uploads?topicId=${data.topicId}`)
  ).data;
  return res;
};
