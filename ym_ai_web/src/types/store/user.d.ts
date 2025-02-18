import { CurrentResult } from '../api/login';

export interface UserState {
  token: string;
  userInfo: CurrentResult;
}
