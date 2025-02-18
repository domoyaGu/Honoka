/**
 * 弹窗类型
 */
export interface Dialog {
  title: string;
  visible: boolean;
}

/**
 * 通用组件选择项类型
 */
export interface Option {
  value: string;
  label: string;
  checked?: boolean;
  children?: Option[];
}

/**
 * 登录用户类型声明
 */
export interface UserInfo {
  creditCode?: string,
  userEmail: string,
  userId: string,
  userName: string,
  userPhone: string,
  userPwd?: string,
  userPwdSalt?: string,
  userStatus?: number,
  currentPoint?: string,
  pointSum?: string,
  pointSumHis?: string,
  pointSurplus?: string,
  createTime?: string,
  isAdmin?: string
}
