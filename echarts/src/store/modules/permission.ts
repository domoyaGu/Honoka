/* eslint-disable */
import { PermissionState } from '@/types/store/permission';
import { RouteRecordRaw } from 'vue-router';
import { defineStore } from 'pinia';
import { constantRoutes } from '@/router';
import { userResourceByToken } from '@/api/login';
import { isNotNull, treeSortData } from '@/utils/validate';
import useStore from '@/store';

const modules = import.meta.glob('../../views/**/**.vue');
export const Layout = () => import('@/layout/index.vue');

const hasPermission = (roles: string[], route: RouteRecordRaw) => {
  if (route.meta && route.meta.roles) {
    if (roles.includes('ROOT')) {
      return true;
    }
    return roles.some((role) => {
      if (route.meta?.roles !== undefined) {
        return (route.meta.roles as string[]).includes(role);
      }
    });
  }
  return false;
};

export const filterAsyncRoutes = (
  routes: RouteRecordRaw[],
) => {
  const res: RouteRecordRaw[] = [];
  routes.forEach((route) => {
    const temp = { ...route } as any;
    const menuItem = {} as any
    const menuComponent = modules[`../../views/${temp.menuComponent}.vue`]
    // --------------------目录--------------------
    if (temp.menuType == '目录') {
      menuItem.path = temp.menuPath
      menuItem.component = Layout
      menuItem.redirect = temp.menuRedirect
      if (temp.children || temp.children.length) {
        menuItem.children = temp.children
      }
      // 有菜单展示
      if (temp.hasMenus) {
        menuItem.meta = {
          title: temp.menuTitle,
          icon: temp.menuIcon,
          hidden: false,
          alwaysShow: true
        }
      }
    }
    // --------------------菜单--------------------
    if (temp.menuType == '菜单') {
      menuItem.path = temp.menuPath
      menuItem.component = menuComponent
      // 目录才有重定向地址
      menuItem.name = temp.menuName // 菜单必须有name标识
      menuItem.meta = {
        title: temp.menuTitle,
        icon: temp.menuIcon,
        hidden: temp.menuHidden == 1, // 详情页隐藏
        alwaysShow: false,
        activeMenu: temp.menuActiveMenu,
        // noCache: true
        // keepAlive: true
      }
    }
    res.push(menuItem);

    if (menuItem.children && menuItem.children.length) {
      menuItem.children = filterAsyncRoutes(menuItem.children);
    }
  });
  return res;
};

const usePermissionStore = defineStore({
  id: 'permission',
  state: (): PermissionState => ({
    routes: [],
    addRoutes: [],
  }),
  actions: {
    // 设置添加动态路由
    setRoutes(routes: RouteRecordRaw[]) {
      this.addRoutes = routes;
      this.routes = constantRoutes.concat(routes);
    },
    // 获取用户资源
    getResource() {
      return new Promise((resolve, reject) => {
        const menuList = [
          {
            "menuStatus": 1,
            "menuTitle": "瀚远",
            "menuPid": "0",
            "menuId": "3288cbb1cf85f7373a08414fa5402465",
            "menuType": "系统",
            "hasMenus": 1,
            "menuSort": 3
          },
          {
            "menuStatus": 1,
            "menuPath": "/overall-business",
            "menuIcon": "overall-business",
            "menuTitle": "OA业务",
            "menuComponent": "Layout",
            "menuPid": "3288cbb1cf85f7373a08414fa5402465",
            "menuRedirect": "/analysis",
            "menuId": "5ba3248eede1bc965934e0b09b4f8baf",
            "menuType": "目录",
            "hasMenus": 1,
            "menuHidden": "0",
            "menuSort": 3
          },
          {
            "menuStatus": 1,
            "menuPath": "/orgnize",
            "menuTitle": "组织",
            "menuComponent": "overall-business/orgnize/index",
            "menuPid": "5ba3248eede1bc965934e0b09b4f8baf",
            "menuName": "orgnize",
            "menuId": "f0bdc36ba27b6ad5c4f21ff55811cb96",
            "menuType": "菜单",
            "hasMenus": 1,
            "menuHidden": "0",
            "menuSort": 1
          },
          {
            "menuStatus": 1,
            "menuPath": "/orgnize/detail/:id",
            "menuTitle": "组织详情",
            "menuComponent": "overall-business/orgnize/detail",
            "menuPid": "5ba3248eede1bc965934e0b09b4f8baf",
            "menuName": "orgnizeDetail",
            "menuId": "3ad7a67f16c8aa23b8bb3af92cec6e91",
            "menuType": "菜单",
            "hasMenus": 1,
            "menuActiveMenu": "/orgnize",
            "menuHidden": "1",
            "menuSort": 2
          },
          {
            "menuStatus": 1,
            "menuPath": "/people",
            "menuTitle": "人事",
            "menuComponent": "overall-business/people/index",
            "menuPid": "5ba3248eede1bc965934e0b09b4f8baf",
            "menuName": "people",
            "menuId": "f0bdc36ba27b6ad5c4f21ff55811cb96",
            "menuType": "菜单",
            "hasMenus": 1,
            "menuHidden": "0",
            "menuSort": 3
          },
          {
            "menuStatus": 1,
            "menuPath": "/people/detail/:id",
            "menuTitle": "人事详情",
            "menuComponent": "overall-business/people/detail",
            "menuPid": "5ba3248eede1bc965934e0b09b4f8baf",
            "menuName": "peopleDetail",
            "menuId": "3ad7a67f16c8aa23b8bb3af92cec6e91",
            "menuType": "菜单",
            "hasMenus": 1,
            "menuActiveMenu": "/people",
            "menuHidden": "1",
            "menuSort": 4
          },
          {
            "menuStatus": 1,
            "menuPath": "/salary",
            "menuTitle": "薪资",
            "menuComponent": "overall-business/salary/index",
            "menuPid": "5ba3248eede1bc965934e0b09b4f8baf",
            "menuName": "salary",
            "menuId": "f0bdc36ba27b6ad5c4f21ff55811cb96",
            "menuType": "菜单",
            "hasMenus": 1,
            "menuHidden": "0",
            "menuSort": 5
          },
          {
            "menuStatus": 1,
            "menuPath": "/salary/detail/:id",
            "menuTitle": "薪资详情",
            "menuComponent": "overall-business/salary/detail",
            "menuPid": "5ba3248eede1bc965934e0b09b4f8baf",
            "menuName": "salaryDetail",
            "menuId": "3ad7a67f16c8aa23b8bb3af92cec6e91",
            "menuType": "菜单",
            "hasMenus": 1,
            "menuActiveMenu": "/salary",
            "menuHidden": "1",
            "menuSort": 6
          },
          {
            "menuStatus": 1,
            "menuPath": "/attend",
            "menuTitle": "考勤",
            "menuComponent": "overall-business/attend/index",
            "menuPid": "5ba3248eede1bc965934e0b09b4f8baf",
            "menuName": "attend",
            "menuId": "f0bdc36ba27b6ad5c4f21ff55811cb96",
            "menuType": "菜单",
            "hasMenus": 1,
            "menuHidden": "0",
            "menuSort": 7
          },
          {
            "menuStatus": 1,
            "menuPath": "/attend/detail/:id",
            "menuTitle": "考勤详情",
            "menuComponent": "overall-business/attend/detail",
            "menuPid": "5ba3248eede1bc965934e0b09b4f8baf",
            "menuName": "attendDetail",
            "menuId": "3ad7a67f16c8aa23b8bb3af92cec6e91",
            "menuType": "菜单",
            "hasMenus": 1,
            "menuActiveMenu": "/attend",
            "menuHidden": "1",
            "menuSort": 8
          },
          {
            "menuStatus": 1,
            "menuPath": "/analysis",
            "menuTitle": "数据分析",
            "menuComponent": "overall-business/analysis/index",
            "menuPid": "5ba3248eede1bc965934e0b09b4f8baf",
            "menuName": "analysis",
            "menuId": "f0bdc36ba27b6ad5c4f21ff55811cb96",
            "menuType": "菜单",
            "hasMenus": 1,
            "menuHidden": "0",
            "menuSort": 7
          },
          {
            "menuStatus": 1,
            "menuPath": "/analysis/detail/:id",
            "menuTitle": "个人数据分析",
            "menuComponent": "overall-business/analysis/detail",
            "menuPid": "5ba3248eede1bc965934e0b09b4f8baf",
            "menuName": "analysisDetail",
            "menuId": "3ad7a67f16c8aa23b8bb3af92cec6e91",
            "menuType": "菜单",
            "hasMenus": 1,
            "menuActiveMenu": "/analysis",
            "menuHidden": "1",
            "menuSort": 8
          },
        ]
        let accessedRoutes = []
        // 存储按钮标识
        const { user } = useStore()
        if (menuList.length) {
          const permList = filterResourcePerm(menuList, [])
          user.setPerms(permList)
          const currentResource = treeSortData(menuList);
          if (isNotNull(currentResource)) {
            if (currentResource[0].menuType == '系统') {
              accessedRoutes = filterAsyncRoutes(currentResource[0].children);
            } else {
              accessedRoutes = filterAsyncRoutes(currentResource)
            }
          }
        }
        this.setRoutes(accessedRoutes);
        console.log(accessedRoutes)
        resolve(accessedRoutes);
      });
    },
  },
});

const filterResourcePerm = (resources, permIds) => {
  resources.forEach((resource) => {
    if (resource.menuBtnList) {
      resource.menuBtnList.forEach((perm) => {
        permIds.push(perm.menuBtnPerms);
      });
    }
  });
  return permIds;
};

export default usePermissionStore;
