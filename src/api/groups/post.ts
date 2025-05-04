import { axiosInstance } from "../instance";
import type { Group } from "./entity";

type PostGroup = Omit<Group, "id">;

export const postGroup = async (data: PostGroup) => {
  const res = (await axiosInstance.post(`/groups`, data)).data;
  return res;
};
