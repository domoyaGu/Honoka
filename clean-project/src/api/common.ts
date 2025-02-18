import requestNoLoading from '@/utils/requestNoLoading';

// ————————————————————————————————————————————  其他接口 ————————————————————————————————————————————————

/**
 * 获取手机验证码
 */
export function getSmsCode(params) {
  return requestNoLoading({
    url: '/captcha/getCode',
    method: 'get',
    params
  });
}



