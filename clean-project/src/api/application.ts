import requestNoLoading from '@/utils/requestNoLoading';

// ————————————————————————————————————————————  其他接口 ————————————————————————————————————————————————

/**
 * 获取手机验证码
 */
export function getApplication(params) {
  return requestNoLoading({
    url: '/data/applicationPage',
    method: 'get',
    params
  });
}

/**
 * 获取手机验证码
 */
export function getDetail(params) {
  return requestNoLoading({
    url: '/data/applicationDetail',
    method: 'get',
    params
  });
}

