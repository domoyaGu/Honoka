import request from '@/utils/request';
import requestNoLoading from '@/utils/requestNoLoading';
// ————————————————————————————————————————————  1、派工模块 ————————————————————————————————————————————————

/**
 * 派工 获取分页列表
 */
export function getPage(data) {
  return requestNoLoading({
    url: '/v2/overallPlanning/dispatch/page',
    method: 'get',
    params: data,
  });
}


/**
 * 派工 获取详情
 */
export function getInfo(params) {
  return request({
    url: `/v2/overallPlanning/dispatch/info`,
    method: 'get',
    params
  });
}

/**
 * 派工 保存
 */
export function infoSave(data) {
  return request({
    url: `/v2/overallPlanning/dispatch/infoSave`,
    method: 'post',
    data
  });
}

