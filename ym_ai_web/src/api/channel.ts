import type { Result } from '@/types/api/index';
import type {
  GetChannelPageType,
  GetChannelPageParamsType,
  RecordType
} from '@/types/api/channel';
import requestTs from '@/utils/requestTs';

/**
 *
 * @param params
 * @returns
 */
export function getChannelPage(params: GetChannelPageParamsType) {
  return requestTs<Result<GetChannelPageType>>({
    url: `/channel/channelPage`,
    method: 'get',
    params
  });
}

/**
 *
 * @param params
 * @returns
 */
export function getChannelAll() {
  return requestTs<Result<RecordType[]>>({
    url: `/channel/channelAll`,
    method: 'get'
  });
}
