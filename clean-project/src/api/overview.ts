import requestNoLoading from '@/utils/requestNoLoading';

// ————————————————————————————————————————————  一览页接口 ————————————————————————————————————————————————

/**
 * 获取数据概览页的数据
 */
export function getCarTrend(params) {
  return requestNoLoading({
    url: '/upload/carTrend',
    method: 'get',
    params
  });
}


/**
 * 车辆数据
 */
export function getCarOverView() {
  return requestNoLoading({
    url: `/upload/carInfo`,
    method: 'get'
  });
}

/**
 * 用户数据
 */
export function getUserOverView() {
  return requestNoLoading({
    url: `/upload/userInfo`,
    method: 'get'
  });
}