
import requestNoLoading from '@/utils/requestNoLoading';

// ————————————————————————————————————————————  用户管理相关接口 ————————————————————————————————————————————————

/**
 * 获取列表
 */
export function getList(params) {
  return requestNoLoading({
    url: `/carInfo/adminCarQuery`,
    method: 'get',
    params
  });
}

/**
 * 验真
 */
export function carAudit(data) {
  return requestNoLoading({
    url: `/carInfo/carAudit`,
    method: 'post',
    data
  });
}

/**
 * 获取车辆详情
 */
export function getDetail(params) {
  return requestNoLoading({
    url: `/carInfo/query`,
    method: 'get',
    params
  });
}

