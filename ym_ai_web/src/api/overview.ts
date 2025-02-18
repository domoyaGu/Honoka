import type { Result } from '@/types/api/index';
import requestTs from '@/utils/requestTs';
import type { GetOverviewDataType } from '@/types/api/overview';

// ————————————————————————————————————————————  一览页接口 ————————————————————————————————————————————————

/**
 * 获取数据概览页的数据
 */
export function getOverviewData(params) {
  return requestTs<Result<GetOverviewDataType>>({
    url: `/data/overview/`,
    method: 'get',
    params
  });
}
