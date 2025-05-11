import type { ApiResponse } from "@/utils/types/response-template";
import { axiosInstance } from "../instance";
import type { Topic } from "./entity";
import type { UserDTO } from "../users/entity";
import type { Comment } from "../comments/entity";

type GetTopicResponse = Topic & {
  comments: Array<Comment & Omit<UserDTO, "id">>;
};

export const getTopic = async (id: string) => {
  const res = (
    await axiosInstance.get<ApiResponse<GetTopicResponse>>(`/topics?id=${id}`)
  ).data;
  return res;
};
