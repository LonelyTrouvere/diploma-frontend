import type { ApiResponse } from "@/utils/types/response-template";
import { axiosInstance } from "../instance";
import type { GroupToUserConnection } from "./entity";
import type { UserDTO } from "../users/entity";

type JoinRequest = UserDTO & Pick<GroupToUserConnection, "joined">;
export const getJoinRequests = async () => {
  const res = (await axiosInstance.get<ApiResponse<JoinRequest[]>>(`/groups/join-requests`));
  return res.data;
};
