import type { ApiResponse } from "@/utils/types/response-template";
import { axiosInstance } from "../instance";

export const generateStreamToken = async () => {
  const res = (
    await axiosInstance.get<ApiResponse<{ token: string }>>(
      `/users/generate-stream-token`
    )
  ).data;
  const data = res.data as { token: string };
  return data.token;
};
