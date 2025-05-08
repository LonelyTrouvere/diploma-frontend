import { axiosInstance } from "../instance";

export const loginGroup = async (data: string) => {
  const res = (await axiosInstance.post(`/groups/login`, { groupId: data })).data;
  return res;
};
