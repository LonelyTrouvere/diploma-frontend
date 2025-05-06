import { axiosInstance } from "../instance";

export const login = async (data: {email: string, password: string}) => {
  const res = (await axiosInstance.post(`/users/login`, data)).data;
  return res;
};
