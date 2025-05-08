import { axiosInstance } from "../instance";
import type { Group } from "./entity";

type UpdateGroup = Partial<Omit<Group, "id">>;

export const updateGroup = async (data: UpdateGroup) => {
  const res = (await axiosInstance.post(`/groups/update`, data)).data;
  return res;
};
