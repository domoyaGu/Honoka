import { RouteRecordRaw } from 'vue-router';
import useStore from '@/store';
import router from '.';
import { initMenuList } from './index';

// 带权限的菜单列表(SubMenu组件用)
export let permissionMenuList: Array<RouteRecordRaw> = [];

/**
 * 获取有权限的菜单列表
 * @param list 列表
 * @param permIds 权限id数组
 * @returns 有权限的菜单列表
 */
function getPermissionMenu(list, permIds, isAdmin) {
  const menu = [];
  list.forEach(item => {
    if (item.name?.startsWith('right')) {
      // 权限管理菜单
      if (isAdmin) {
        menu.push(item);
        if (!router.hasRoute(item.name)) {
          router.addRoute({ ...item });
        }
      } else {
        // 非管理员删除权限管理模块
        if (router.hasRoute(item.name)) router.removeRoute(item.name);
      }
    } else {
      // 其他菜单
      if (!item.meta || !item.meta.id || permIds.includes(item.meta.id)) {
        menu.push(item);
        // 如果路由中没有，则加入
        if (!router.hasRoute(item.name) && item.path !== '/') {
          router.addRoute(item);
        }
      } else if (router.hasRoute(item.name)) {
        // 无权限则删除路由
        router.removeRoute(item.name);
      }
    }
    if (item.children?.length > 0) {
      item.children = getPermissionMenu(item.children, permIds, isAdmin);
      // 子节点没有权限，则删除(黑白名单的情况)
      if (
        (!item.children || item.children.length === 0) &&
        router.hasRoute(item.name) &&
        ['blackList', 'whiteList'].includes(item.name)
      ) {
        // 无权限则删除路由
        router.removeRoute(item.name);
        menu.pop();
      }
    }
  });
  return menu;
}

/**
 * 根据权限筛选路由
 * @returns 根据当前角色权限返回的菜单
 */
export const initPermissionMenuList = () => {
  const { user, permission } = useStore();
  const permIds = [];
  permission.rights.forEach(item => {
    permIds.push(item.menuId);
    if (item.menuList?.length > 0) {
      item.menuList.forEach(child => permIds.push(child.menuId));
    }
  });
  permissionMenuList = getPermissionMenu(
    initMenuList(),
    permIds,
    user.userInfo.isAdmin == '1'
  );
  return permissionMenuList;
};
