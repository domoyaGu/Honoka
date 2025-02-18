import request from '@/utils/request';
import requestNoLoading from '@/utils/requestNoLoading';
// ————————————————————————————————————————————  基本设置 单位 ————————————————————————————————————————————————


/**
 * 获取单位分页列表
 * @param params
 */
export function listDeptPages(params) {
  return requestNoLoading({
    url: '/v6/user/dept/dept/list',
    method: 'get',
    params,
  });
}

/**
 * 获取单位详情
 * @param id
 */
export function getDeptInfo(id) {
  return request({
    url: '/v6/user/dept/info/' + id,
    method: 'get',
  });
}

/**
 * 添加单位
 * @param data
 */
export function postDeptInfo(data) {
  return request({
    url: '/v6/user/dept/dept',
    method: 'post',
    data,
  });
}

/**
 * 修改单位
 * @param data
 */
export function putDeptInfo(data) {
  return request({
    url: '/v6/user/dept/dept',
    method: 'put',
    data,
  });
}
