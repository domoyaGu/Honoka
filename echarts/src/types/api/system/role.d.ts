import { PageQueryParam, PageResult } from '../base';

/**
 * 角色查询参数类型声明
 */
export type RoleQueryParam = PageQueryParam

/**
 * 角色列表项类型声明
 */
export interface RoleItem {
  tagId: string;
  roleName: string;
  roleDesc: string;
  roleCreateTime: string;
}

/**
 * 角色分页项类型声明
 */
export type RolePageResult = PageResult<RoleItem[]>;

/**
 * 角色表单数据类型声明
 */
export interface RoleDetail {
  tagId: string;
  roleName: string;
  roleDesc: string;
  resourcesId: Array;
}
