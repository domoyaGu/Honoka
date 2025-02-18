export interface UserDetail {
  creditCode?: string;
  password?: string;
  roleId: string;
  userEmail: string;
  userId: string;
  userName: string;
  userPhone: string;
}

// 获取用户详情
export interface GetUserInfo {
  userId: string;
  creditCode: any;
  userName: string;
  userEmail: string;
  userPhone: string;
  password: any;
  salt: any;
  userStatus: any;
  roleId: number;
  roleName: string;
  staffStatus: string;
}

// 获取用户分页
export interface GetUserPage {
  current: number;
  records: GetUserInfo[];
  size: number;
  total: number;
}
