import type { ApiResponse } from "@/utils/types/response-template";
import { axiosInstance } from "../instance";
import type { Comment } from "./entity";

type PostComment = Omit<Comment, "id" | "userId" | "timestamp">;

export const postComment = async (data: PostComment) => {
  const res = (
    await axiosInstance.post<ApiResponse<{ id: string }>>(`/comments`, data)
  ).data;
  return res;
};
