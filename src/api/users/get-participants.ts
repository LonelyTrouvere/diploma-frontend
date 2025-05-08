import type { ApiResponse } from "@/utils/types/response-template";
import { axiosInstance } from "../instance";
import type { UserDTO } from "./entity";
import type { GroupToUserConnection } from "../groups/entity";

type Participant = UserDTO & Pick<GroupToUserConnection, "role" | "joined">;
export const getGroupParticipants = async () => {
  const res = (
    await axiosInstance.get<ApiResponse<Participant[]>>("/users/participants")
  ).data;
  return res;
};
