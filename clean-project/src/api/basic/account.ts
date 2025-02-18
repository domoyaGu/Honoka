import request from '@/utils/request';
import requestNoLoading from '@/utils/requestNoLoading';
// ————————————————————————————————————————————  基本设置 子账号 ————————————————————————————————————————————————


/**
 * 获取账号分页列表
 * @param params
 */
export function listAccountPages(params) {
  return requestNoLoading({
    url: '/v6/user/account/page',
    method: 'get',
    params,
  });
}

/**
 * 获取分佣人列表
 */
export function getUserList() {
  return requestNoLoading({
    url: '/v6/user/account/getUserList',
    method: 'get'
  });
}

/**
 * 获取账号详情
 * @param id
 */
export function getAccountInfo(id) {
  return request({
    url: '/v6/user/account/info/' + id,
    method: 'get',
  });
}

/**
 * 添加账号
 * @param data
 */
export function postAccountInfo(data) {
  return request({
    url: '/v6/user/account',
    method: 'post',
    data,
  });
}

/**
 * 修改账号
 * @param data
 */
export function putAccountInfo(data) {
  return request({
    url: '/v6/user/account',
    method: 'put',
    data
  });
}
