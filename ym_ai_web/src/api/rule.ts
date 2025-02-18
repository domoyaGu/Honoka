import type { Result } from '@/types/api/index';
import requestTs from '@/utils/requestTs';
import type { GetRulePageRecord, GetRuleDetailType } from '@/types/api/rule';

/**
 * 获取模型列表
 * @param params
 * @returns
 */
export function getRulePage(params) {
  return requestTs<Result<GetRulePageRecord>>({
    url: `/rule/page`,
    method: 'get',
    params
  });
}

/**
 * 获取模型信息
 * @param configId
 * @returns
 */
export function getRuleDetail(configId) {
  return requestTs<Result<GetRuleDetailType>>({
    url: `/rule/detail/${configId}`,
    method: 'get'
  });
}

/**
 * 保存模型信息
 * @param data
 * @returns
 */
export function postSaveRule(data) {
  return requestTs<Result<string>>({
    url: `/rule/saveRule`,
    method: 'post',
    data
  });
}

/**
 * 删除模型信息
 * @param data
 * @returns
 */
export function deleteRule(configId) {
  return requestTs<Result<string>>({
    url: `/rule/removeRule/${configId}`,
    method: 'post'
  });
}

export function getRuleHistory(ruleId) {
  return requestTs<Result<any>>({
    url: `/rule/record/${ruleId}`,
    method: 'get'
  });
}
