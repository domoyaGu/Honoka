import {
  LoginFormData
} from '@/types/api/login';
import request from '@/utils/request';
import requestNoLoading from '@/utils/requestNoLoading';

/**
 * 其他平台 登录
 * @param data
 */
export function login(data: LoginFormData) {
  return requestNoLoading({
    url: '/v6/auth/login',
    method: 'post',
    data
  });
}

/**
 * 获取当前账号信息
 */
export function getUserInfo() {
  return requestNoLoading({
    url: '/v6/auth/user/current',
    method: 'get',
  });
}

/**
 * 获取资源列表 机构（平铺结构）
 */
export function companyResourceByToken() {
  return requestNoLoading({
    url: '/v6/user/resources/company/list',
    method: 'get',
  });
}

/**
 * 获取资源列表 用户（平铺结构）
 */
export function userResourceByToken() {
  return requestNoLoading({
    url: '/v6/user/account/infoResources',
    method: 'get',
  });
}

/**
 * 修改密码
 */
export function putUserPassword(data) {
  return request({
    url: '/v6/user/account/passwd',
    method: 'put',
    data
  });
}
