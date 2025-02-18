/**
 * 基础
 */

/**
 * 分页类型声明
 */
export interface PageQueryParam {
  current: number,
  size: number,
  column: string,
  order: string,
}

export interface PageResult<T> {
  current: number;
  records: T;
  size: number;
  total: number;
}
