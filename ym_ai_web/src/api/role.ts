import { Result } from '@/types/api/index';
import requestTs from '@/utils/requestTs';
import type { RightType, GetRolePage, RoleRecord } from '@/types/api/role';

// ————————————————————————————————————————————  角色管理接口 ————————————————————————————————————————————————

/**
 * 获取角色分页
 */
export function getRolePage(params) {
  return requestTs<Result<GetRolePage>>({
    url: '/role/page',
    method: 'get',
    params
  });
}

/**
 * 获取所有角色
 */
export function getRoleAll() {
  return requestTs<Result<RoleRecord[]>>({
    url: '/role/all',
    method: 'get'
  });
}
/**
 * 获取角色详情
 */
export function getRoleInfo(id) {
  return requestTs<Result<any>>({
    url: `/role/info/${id}`,
    method: 'get'
  });
}

/**
 * 创建
 */
export function addRole(data) {
  return requestTs<Result<any>>({
    url: '/role/addRole',
    method: 'post',
    data
  });
}

/**
 * 编辑
 */
export function editRole(data) {
  return requestTs<Result<any>>({
    url: '/role/editRole',
    method: 'post',
    data
  });
}

/**
 * 编辑
 */
export function getMenuList() {
  return requestTs<Result<RightType[]>>({
    url: '/role/getMenuList',
    method: 'get'
  });
}
