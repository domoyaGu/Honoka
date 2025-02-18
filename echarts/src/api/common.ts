import request from '@/utils/request';
import requestNoLoading from '@/utils/requestNoLoading';

// ————————————————————————————————————————————  其他接口 ————————————————————————————————————————————————

/**
 * 获取手机验证码
 */
export function getSmsCode(data) {
  return request({
    url: '/push/sms/code',
    method: 'post',
    data
  });
}

/**
 * 获取邮箱验证码
 */
export function getEmailCode(data) {
  return request({
    url: '/push/email/ym/code',
    method: 'post',
    data
  });
}

/**
 * 图片OCR解析
 */
export function imgDistinguish(query) {
  return request({
    url: `/thirdParty/orc/cloudWalk/imageRecognition`,
    method: 'get',
    params: query
  })
}

/**
 * 获取全国省市区数据
 */
export function getAreaTree() {
  return requestNoLoading({
    url: '/opsData/area/getAreaTree',
    method: 'get'
  });
}

/**
 * 获取统筹流程下拉选项
 */
export function getAllEnum() {
  return requestNoLoading({
    url: '/v25/underwriting/dropDown/status',
    method: 'get'
  });
}

/**
 *
 * 获取统筹业务下拉选项
 */
export function getSelectOption(data) {
  return requestNoLoading({
    url: '/v25/underwriting/dropDown/dict',
    method: 'post',
    data
  })
}

/**
 *
 * 获取公司logo信息
 */
export function getCompanyIcon() {
  return requestNoLoading({
    url: `/v6/user/account/getLogoInfo`,
    method: 'get',
  })
}

/**
 * 获取网站title
 */
 export function getCompanyName() {
  return requestNoLoading({
    url: `v6/user/company/getCompanyName`,
    method: 'get',
  })
}

// 获取二维码

export function getQrCodeKey(params) {
  return requestNoLoading({
    url: `/v25/underwriting/application/getQrCodeKey`,
    method: 'get',
    params
  })
}

/**
 * 获取统筹单详情
 */
export function getTcInfo(tcNo) {
  return requestNoLoading({
    url: `/v2/overallPlanning/report/tcDetail/${tcNo}`,
    method: 'get'
  })
}

/**
 * 批改 批单列表
 */
export function getCorrectionList(insuranceId) {
  return request({
    url: `/v25/underwriting/correction/list/${insuranceId}`,
    method: 'get'
  });
}

/**
 * 获取车损下拉
 */

export function getLossProject(params) {
  return requestNoLoading({
    url: `/v2/overallPlanning/code/lossProject`,
    method: 'get',
    params
  })
}

/**
 * 获取流程明细
 */
export function getProcessDetail(claimNo) {
  return requestNoLoading({
    url: `/v2/overallPlanning/report/getProcessDetail?claimNo=${claimNo}`,
    method: 'get'
  })
}

/**
 * 获取用户列表
 */
export function getUserList() {
  return requestNoLoading({
    url: '/v6/user/account/getUserList',
    method: 'get'
  });
}
