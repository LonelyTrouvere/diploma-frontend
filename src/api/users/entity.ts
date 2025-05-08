import type { Group, GroupToUserConnection } from "../groups/entity";

export interface User {
  id: string;
  name: string;
  email: string;
  groups?: Group;
  groups_to_users?: GroupToUserConnection;
}

export interface UserDTO {
  id: string;
  name: string;
  email: string;
}
