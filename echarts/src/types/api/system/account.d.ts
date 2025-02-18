import {PageQueryParam, PageResult} from '../base';

/**
 * 账号查询参数类型声明
 */
export interface AccountQueryParam extends PageQueryParam {
  userName: stirng;
  userPhone: stirng;
  userRoleName: stirng;
  userStatus: stirng;
}

/**
 * 账号列表项类型声明
 */
export interface AccountItem {
  companyId: string;
  createTime: string;
  userEmail: string;
  userId: string;
  userName: string;
  userPassword: string;
  userPhone: string;
  userRoleName: string;
  userSalt: string;
  userStatus: string;
}

/**
 * 账号分页项类型声明
 */
export type AccountPageResult = PageResult<AccountItem[]>;

/**
 * 账号表单数据类型声明
 */
export interface AccountDetail {
  // companyId: string;
  // createTime: string;
  userEmail: string;
  userId: string;
  userName: string;
  userPassword: string;
  userPhone: string;
  userRoleName: string;
  // userSalt: string;
  userStatus: string
}
