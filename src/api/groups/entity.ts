export interface Group {
  id: string;
  name: string;
}

export const USER_ROLE = {
  owner: "owner",
  admin: "admin",
  participant: "participant",
} as const;

export const USER_GROUP_STATUS = {
  request_to_user: "request_to_user",
  request_from_user: "request_from_user",
  active: "active",
  blocked: "blocked",
} as const;

export interface GroupToUserConnection {
  id: number;
  userId: string;
  groupId: string;
  joined: string;
  role: (typeof USER_ROLE)[keyof typeof USER_ROLE];
  status: (typeof USER_GROUP_STATUS)[keyof typeof USER_GROUP_STATUS];
}