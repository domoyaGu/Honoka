import { PageQueryParam, PageResult } from '../base';

/**
 * 权限组查询参数类型声明
 */
export type PermissionQueryParam = PageQueryParam

/**
 * 权限组列表项类型声明
 */
export interface PermissionItem {
  tagId: string;
  PermissionName: string;
  PermissionDesc: string;
  PermissionCreateTime: string;
}

/**
 * 权限组分页项类型声明
 */
export type PermissionPageResult = PageResult<PermissionItem[]>;

/**
 * 权限组表单数据类型声明
 */
export interface PermissionDetail {
  tagId: string;
  permissionName: string;
  permissionDesc: string;
  resourcesId: Array;
}
