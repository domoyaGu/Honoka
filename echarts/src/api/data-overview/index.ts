import request from '@/utils/request';
// ————————————————————————————————————————————  数据概览 ————————————————————————————————————————————————

/**
 * 获取统计信息
 */
export function getStatistical() {
  return request({
    url: '/v25/underwriting/insurance/statistical/overview',
    method: 'get'
  });
}
