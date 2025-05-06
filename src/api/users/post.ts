import { axiosInstance } from "../instance";
import type { User } from "./entity";

type PostUser = Omit<User, "id"> & { password: string };

export const postUser = async (data: PostUser) => {
  const res = (await axiosInstance.post(`/users`, data)).data;
  return res;
};
