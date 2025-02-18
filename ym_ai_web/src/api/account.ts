import requestTs from '@/utils/requestTs';
import { Result } from '@/types/api/index';
import type { GetUserInfo, GetUserPage } from '@/types/api/account';

// ————————————————————————————————————————————  子账号管理接口 ————————————————————————————————————————————————

/**
 * 获取账号分页
 */
export function getUserPage(params) {
  return requestTs<Result<GetUserPage>>({
    url: '/user/page',
    method: 'get',
    params
  });
}

/**
 * 获取账号详情
 */
export function getUserInfo(id) {
  return requestTs<Result<GetUserInfo>>({
    url: `/user/info/${id}`,
    method: 'get'
  });
}

/**
 * 创建
 */
export function addUser(data) {
  return requestTs<Result<any>>({
    url: '/user/add',
    method: 'post',
    data
  });
}

/**
 * 编辑
 */
export function editUser(data) {
  return requestTs<Result<any>>({
    url: '/user/editUser',
    method: 'post',
    data
  });
}
