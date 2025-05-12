import { axiosInstance } from "../instance";
import type { Topic } from "./entity";

type UpdateTopic = Partial<Omit<Topic, "id" | "created" | "groupId">> & { id: string };

export const updateTopic = async (data: UpdateTopic) => {
  const res = (await axiosInstance.post(`/topics/update`, data)).data;
  return res;
};
