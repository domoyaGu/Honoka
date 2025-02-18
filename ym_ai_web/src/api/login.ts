import type {
  LoginFormData,
  CurrentResult,
  PutUserPassword
} from '@/types/api/login';
import { RightType } from '@/types/api/role';
import requestTs from '@/utils/requestTs';
import type { Result } from '@/types/api/index';

/**
 * 其他平台 登录
 * @param data
 */
export function login(data: LoginFormData) {
  return requestTs<Result<string>>({
    url: '/user/login',
    method: 'post',
    data
  });
}

/**
 *
 * @returns 获取用户信息
 */
export function getCurrent() {
  return requestTs<Result<CurrentResult>>({
    url: '/user/current',
    method: 'get'
  });
}

/**
 * 修改密码
 */
export function putUserPassword(data: PutUserPassword) {
  return requestTs<Result<string>>({
    url: '/user/forgetPwd',
    method: 'post',
    data
  });
}

/**
 * 用户权限列表
 */
export function getInfoResources() {
  return requestTs<Result<RightType[]>>({
    url: '/user/infoResources',
    method: 'get'
  });
}
