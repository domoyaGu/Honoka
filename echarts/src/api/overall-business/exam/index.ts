import requestNoLoading from '@/utils/requestNoLoading';
import request from '@/utils/request';

// ————————————————————————————————————————————  1、核损模块 ————————————————————————————————————————————————

/**
 * 核损 获取分页列表
 * @param data 
 * @returns 
 */
export function getExamPage(data) {
  return requestNoLoading({
    url: '/v2/overallPlanning/examination/page',
    method: 'get',
    params: data,
  });
}

/**
 * 核损 获取详情
 * @param data 
 * @returns 
 */
export function getExamInfo(params) {
  return request({
    url: `/v2/overallPlanning/examination/info`,
    method: 'get',
    params
  });
}

/**
 * 核损保存/更新
 */
export function examSaveOrUpdate(data) {
  return request({
    url: `/v2/overallPlanning/examination/saveOrUpdate`,
    method: 'post',
    data
  });
}
