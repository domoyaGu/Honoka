import type {
  GetChannelType,
  GetStateDicType,
  AreaObjectType,
  GetRuleIdType,
  GetAllRoleType
} from '@/types/api/dict';
import type { Result } from '@/types/api/index';
import requestTs from '@/utils/requestTs';

/**
 * 获取渠道字典
 */
export function getChannel() {
  return requestTs<Result<GetChannelType[]>>({
    url: `/dict/channel`,
    method: 'get'
  });
}

/**
 * 获取状态字典
 * @returns
 */
export function getStateDic() {
  return requestTs<Result<GetStateDicType[]>>({
    url: `/dict/all`,
    method: 'get'
  });
}

/**
 * 获取城市
 * @returns
 */
export function getArea() {
  return requestTs<Result<AreaObjectType[]>>({
    url: `/area/tree`,
    method: 'get'
  });
}

/**
 *
 * @returns 获取命中规则id
 */
export function getRuleId() {
  return requestTs<Result<GetRuleIdType[]>>({
    url: `/dict/ruleId`,
    method: 'get'
  });
}

/**
 * 获取所有用户
 * @returns
 */
export function getAllRoles() {
  return requestTs<Result<GetAllRoleType[]>>({
    url: `/user/all`,
    method: 'get'
  });
}

/**
 * 获取企业黑名单标签下拉
 * @returns
 */
export function getIndustryTagList() {
  return requestTs<Result<any>>({
    url: '/company/getIndustryTagList',
    method: 'get'
  });
}
