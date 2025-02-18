import request from '@/utils/request';
import requestNoLoading from '@/utils/requestNoLoading';
// ————————————————————————————————————————————  基本设置 角色 ————————————————————————————————————————————————


/**
 * 获取角色分页列表
 * @param params
 */
export function listRolePages(params) {
  return requestNoLoading({
    url: '/v6/user/role/page',
    method: 'get',
    params,
  });
}

/**
 * 获取角色详情
 * @param id
 */
export function getRoleInfo(id) {
  return request({
    url: '/v6/user/role/info/' + id,
    method: 'get',
  });
}

/**
 * 添加角色
 * @param data
 */
export function postRoleInfo(data) {
  return request({
    url: '/v6/user/role',
    method: 'post',
    data,
  });
}

/**
 * 修改角色
 * @param data
 */
export function putRoleInfo(data) {
  return request({
    url: '/v6/user/role',
    method: 'put',
    data,
  });
}
