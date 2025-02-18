import type { Result } from '@/types/api/index';
import requestTs from '@/utils/requestTs';
import type {
  GetCompanyWhitePage,
  GetOrderWhitePage
} from '@/types/api/whitelist';

// ————————————————————————————————————————————  白名单接口 ————————————————————————————————————————————————

/**
 * 获取企业白名单
 * @param params
 * @returns
 */
export function getCompanyPage(params) {
  return requestTs<Result<GetCompanyWhitePage>>({
    url: '/company/companyWhitePage',
    method: 'get',
    params
  });
}

/**
 * 编辑企业白名单
 * @param data
 * @returns
 */
export function companyWhiteSave(data) {
  return requestTs<Result<any>>({
    url: '/company/companyWhiteSave',
    method: 'post',
    data
  });
}

/**
 * 白名单删除和恢复
 * @param data
 * @returns
 */
export function whiteDelRecovery(id) {
  return requestTs<Result<any>>({
    url: `/company/whiteDelRecovery/${id}`,
    method: 'post'
  });
}

/**
 * 获取投保单白名单
 * @param params
 * @returns
 */
export function getOrderWhitePage(params) {
  return requestTs<Result<GetOrderWhitePage>>({
    url: '/company/orderWhitePage',
    method: 'get',
    params
  });
}

/**
 * 编辑投保单白名单
 * @param data
 * @returns
 */
export function orderWhiteSave(data) {
  return requestTs<Result<any>>({
    url: '/company/orderWhiteSave',
    method: 'post',
    data
  });
}
