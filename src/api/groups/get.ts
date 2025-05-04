import { axiosInstance } from "../instance";
import type { Group } from "./entity";

export const getGroups = async () => {
  const res = (await axiosInstance.get(`/groups`)).data as Group[];
  return res;
};
