import type {
  BlackAreaType,
  GetBlackAreaParamsType,
  BlackCompanyType,
  BlackCompanyParams
} from '@/types/api/blacklist';
import type { Result } from '@/types/api/index';
import requestTs from '@/utils/requestTs';

// ————————————————————————————————————————————  黑名单接口 ————————————————————————————————————————————————
/**
 * 获取城市黑名单
 * @param params
 * @returns
 */
export function getBlackArea(params: GetBlackAreaParamsType) {
  return requestTs<Result<BlackAreaType>>({
    url: `/area/blackAreaPage`,
    method: 'get',
    params
  });
}

/**
 * 获取企业黑名单
 * @param params
 * @returns
 */
export function getCompanyPage(params: BlackCompanyParams) {
  return requestTs<Result<BlackCompanyType>>({
    url: '/company/companyPage',
    method: 'get',
    params
  });
}

/**
 * 企业黑名单下载模板（文件流暂时都用xhr调用）
 * @param params
 * @returns
 */
export function getBlackExcelDownload() {
  return requestTs<Result<any>>({
    url: '/company/blackExcelDownload',
    method: 'get'
  });
}
