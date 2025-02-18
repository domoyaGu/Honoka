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
    url: '/user/login',
    method: 'post',
    data
  });
}

/**
 * 获取当前账号信息
 */
export function getUserInfo() {
  return requestNoLoading({
    url: '/user/info',
    method: 'get',
  });
}

/**
 * 新增用户（注册）
 */

export function addUser(data) {
  return requestNoLoading({
    url: '/user/add',
    method: 'post',
    data
  });
}

/**
 * 编辑用户
 */
export function editUser(data) {
  return requestNoLoading({
    url: '/user/edit',
    method: 'post',
    data
  });
}

/**
 * 修改密码
 */
export function putUserPassword(data) {
  return request({
    url: '/user/forgotPwd',
    method: 'post',
    data
  });
}
