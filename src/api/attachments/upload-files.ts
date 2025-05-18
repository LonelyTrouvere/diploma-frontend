import type { ApiResponse } from "@/utils/types/response-template";

export const postFiles = async (data: FormData) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/uploads`, {
    method: "POST",
    credentials: "include",
    body: data,
  });
  const resData = await res.json();
  return resData as ApiResponse<string[]>;
};
