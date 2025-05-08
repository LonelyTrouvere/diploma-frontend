const USER_ROLE = {
  owner: "owner",
  admin: "admin",
  participant: "participant",
} as const;

const USER_GROUP_STATUS = {
  request_to_user: "request_to_user",
  request_from_user: "request_from_user",
  active: "active",
  blocked: "blocked",
} as const;

export interface User {
  id: string;
  name: string;
  email: string;
  groups?: {
    id: string;
    name: string;
  };
  groups_to_users?: {
    id: number;
    userId: string;
    groupId: string;
    role: (typeof USER_ROLE)[keyof typeof USER_ROLE];
    status: (typeof USER_GROUP_STATUS)[keyof typeof USER_GROUP_STATUS];
  };
}
