import requestNoLoading from '@/utils/requestNoLoading';
import request from '@/utils/request';

// ————————————————————————————————————————————  1、理算模块 ————————————————————————————————————————————————

/**
 * 理算 获取分页列表
 * @param data 
 * @returns 
 */
export function getAdjustmentPage(data) {
  return requestNoLoading({
    url: '/v2/overallPlanning/adjustment/page',
    method: 'get',
    params: data,
  });
}

/**
 * 理算 获取详情
 * @param data 
 * @returns 
 */
export function getAdjustmentInfo(params) {
  return request({
    url: `/v2/overallPlanning/adjustment/info`,
    method: 'get',
    params
  });
}

/**
 * 理算保存/更新
 */
export function adjustmentSaveOrUpdate(data) {
  return request({
    url: `/v2/overallPlanning/adjustment/saveOrUpdate`,
    method: 'post',
    data
  });
}
