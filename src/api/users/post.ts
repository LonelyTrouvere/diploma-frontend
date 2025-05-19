import type { ApiResponse } from "@/utils/types/response-template";
import { axiosInstance } from "../instance";
import type { UserDTO } from "./entity";

type PostUser = Omit<UserDTO, "id"> & { password: string };

export const postUser = async (data: PostUser) => {
  const res = (await axiosInstance.post<ApiResponse<{ id: string }>>(`/users`, data)).data;
  return res;
};
