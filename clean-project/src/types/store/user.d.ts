import { UserInfo } from "../common";

export interface UserState {
  token: string;
  userId: string;
  userInfo: UserInfo,
  roles: string[],
  perms: string[]
}
