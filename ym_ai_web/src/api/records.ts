import type { Result } from '@/types/api/index';
import requestTs from '@/utils/requestTs';
import type {
  applicationPageType,
  IvokeinsuredBeanType,
  GetExcelExportRecordListType,
  GetDataLawMsgType,
  GetDataLawPageType
} from '@/types/api/records';

// ————————————————————————————————————————————  其他接口 ————————————————————————————————————————————————

/**
 * 获取调用记录列表
 */
export function getApplication(params) {
  return requestTs<Result<applicationPageType>>({
    url: '/data/applicationPage',
    method: 'get',
    params
  });
}

/**
 * 获取详情
 */
export function getDetail(params) {
  return requestTs<Result<IvokeinsuredBeanType>>({
    url: '/data/applicationDetail',
    method: 'get',
    params
  });
}

/**
 * 导出表格
 */
export function excelExport(params) {
  return requestTs<Result<string>>({
    url: '/exceldata/excelExport',
    method: 'get',
    params
  });
}

/**
 * 获取表格下载列表
 */
export function getExcelExportList(params) {
  return requestTs<Result<GetExcelExportRecordListType>>({
    url: '/exceldata/excelPage',
    method: 'get',
    params
  });
}

/**
 * 获取公司诉讼信息条数
 */
export function getDataLaw(keyWord) {
  return requestTs<Result<number>>({
    url: `/data/law/${keyWord}`,
    method: 'get'
  });
}

/**
 * 获取公司诉讼信息描述
 */
export function getDataLawMsg(keyWord) {
  return requestTs<Result<GetDataLawMsgType[]>>({
    url: `/data/lawMsg/${keyWord}`,
    method: 'get'
  });
}

/**
 * 获取公司诉讼信息描述
 */
export function getDataLawPage(params) {
  return requestTs<Result<GetDataLawPageType>>({
    url: `/data/lawPage`,
    method: 'get',
    params
  });
}

/**
 * 获取JSON
 * id 流水号
 */
export function getDecryptReport(id) {
  return requestTs<Result<any>>({
    url: `/data/decryptReport/${id}`,
    method: 'get'
  });
}

/**
 * 再次调用
 * id 流水号
 */
export function getCallRepeat(id) {
  return requestTs<Result<any>>({
    url: `/data/reCheck/${id}`,
    method: 'get'
  });
}
