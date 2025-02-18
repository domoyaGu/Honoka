import request from '@/utils/request';
import requestNoLoading from '@/utils/requestNoLoading';
// ————————————————————————————————————————————  1、报案模块 ————————————————————————————————————————————————

/**
 * 报案 获取分页列表
 */
export function getPage(data) {
  return requestNoLoading({
    url: '/v2/overallPlanning/report/page',
    method: 'get',
    params: data,
  });
}

/**
 * 报案 获取统筹列表（新建报案弹窗统一接口）
 */
export function getTcPage(data) {
  return requestNoLoading({
    url: '/v2/overallPlanning/report/tcPage',
    method: 'get',
    params: data,
  });
}

/**
 * 报案 保存
 * @param data 
 * @returns 
 */
export function saveOrUpdate(data) {
  return request({
    url: `/v2/overallPlanning/report/saveOrUpdate`,
    method: 'post',
    data
  })
}

/**
 * 获取详情
 */
export function getDetail(params) {
  return request({
    url: `/v2/overallPlanning/report/info`,
    method: 'get',
    params
  });
}

/**
 * 报价 获取统筹项目表格信息
 */
export function getInsuranceInfo() {
  return request({
    url: '/v25/underwriting/quotation/getInsuranceInfo',
    method: 'get'
  });
}
