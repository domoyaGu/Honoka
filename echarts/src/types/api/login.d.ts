/**
 * 登录表单类型声明
 */
export interface LoginFormData {
  userName: string;
  password: string
}

/**
 * 登录响应类型声明
 */
export interface LoginResponseData {
  token: string;
}

/**
 * 验证码类型声明
 */
export interface Captcha {
  img: string;
  uuid: string;
}
