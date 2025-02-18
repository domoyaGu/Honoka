import { PageQueryParam, PageResult } from '../base';

/**
 * 资源查询参数类型声明
 */
export interface MenuQueryParam extends PageQueryParam {
  sysResourcesName: stirng;
  sysResourcesStatus: number;
}

/**
 * 资源列表项类型声明
 */
export interface MenuItem {
  sysResourcesApiPath: stirng,
  sysResourcesDesc: stirng,
  sysResourcesId: stirng,
  sysResourcesName: stirng,
  sysResourcesPid: stirng,
  sysResourcesType: stirng,
  sysResourcesWebPath: stirng,
  sysResourcesWebPathDesc: stirng,
  sysResourcesSort: number,
  sysResourcesStatus: number,
}

/**
 * 资源分页项类型声明
 */
export type MenuPageResult = PageResult<MenuItem[]>;

/**
 * 资源表单数据类型声明
 */
export interface MenuDetail {
  sysResourcesApiPath: stirng,
  sysResourcesDesc: stirng,
  sysResourcesId: stirng,
  sysResourcesName: stirng,
  sysResourcesPid: stirng,
  sysResourcesType: stirng,
  sysResourcesWebPath: stirng,
  sysResourcesWebPathDesc: stirng,
  sysResourcesSort: number,
  sysResourcesStatus: number,
  icon: string
}
