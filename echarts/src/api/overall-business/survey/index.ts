import requestNoLoading from '@/utils/requestNoLoading';
import request from '@/utils/request';
// ————————————————————————————————————————————  1、查勘模块 ————————————————————————————————————————————————

/**
 * 查勘 获取分页列表
 * @param data 
 * @returns 
 */
export function getPage(data) {
  return requestNoLoading({
    url: '/v2/overallPlanning/survey/page',
    method: 'get',
    params: data,
  });
}

/**
 * 查勘 获取详情
 * @param data 
 * @returns 
 */
export function getSurveyInfo(params) {
  return request({
    url: `/v2/overallPlanning/survey/info`,
    method: 'get',
    params
  });
}

/**
 * 查勘 获取所有查勘附件
 * @param data 
 * @returns 
 */
export function surveyAttachPage(claimNo) {
  return requestNoLoading({
    url: `/v2/overallPlanning/survey/surveyAttachPage/${claimNo}`,
    method: 'get'
  });
}


/**
 * 查勘 附件保存/提交
 * @param data 
 * @returns 
 */
export function surveyAttachSave(data) {
  return requestNoLoading({
    url: `/v2/overallPlanning/survey/surveyAttachSave`,
    method: 'post',
    data
  });
}

/**
 * 查勘 附件删除
 * @param data 
 * @returns 
 */
export function deleteSurvey(uploadId) {
  return request({
    url: `/v2/overallPlanning/survey/deleteSurvey/${uploadId}`,
    method: 'delete',
  });
}

/**
 * 查勘 详情保存
 * @param data 
 * @returns 
 */
export function surveySaveOrUpdate(data) {
  return request({
    url: `/v2/overallPlanning/survey/saveOrUpdate`,
    method: 'post',
    data
  });
}
