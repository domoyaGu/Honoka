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
  companyId: string;
  companyName: string;
  companyTopId: string;
  email: string;
  name: string;
  openid: string;
  phone: string;
  sys: string;
  userId: string;
  userNum: string
}
