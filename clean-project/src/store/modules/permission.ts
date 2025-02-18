/* eslint-disable */
import { PermissionState } from '@/types/store/permission';
import { RouteRecordRaw } from 'vue-router';
import { defineStore } from 'pinia';
import { constantRoutes } from '@/router';
// import { userResourceByToken } from '@/api/login';
const modules = import.meta.glob('../../views/**/**.vue');

// export const filterAsyncRoutes = (
//   routes: RouteRecordRaw[],
// ) => {
//   const res: RouteRecordRaw[] = [];
//   routes.forEach((route) => {
//     const temp = { ...route } as any;
//     const menuItem = {} as any
//     const menuComponent = modules[`../../views/${temp.menuComponent}.vue`]
//     // --------------------目录--------------------
//     if (temp.menuType == '目录') {
//       menuItem.path = temp.menuPath
//       menuItem.component = Layout
//       menuItem.redirect = temp.menuRedirect
//       if (temp.children || temp.children.length) {
//         menuItem.children = temp.children
//       }
//       // 有菜单展示
//       if (temp.hasMenus) {
//         menuItem.meta = {
//           title: temp.menuTitle,
//           icon: temp.menuIcon,
//           hidden: false,
//           alwaysShow: true
//         }
//       }
//     }
//     // --------------------菜单--------------------
//     if (temp.menuType == '菜单') {
//       menuItem.path = temp.menuPath
//       menuItem.component = menuComponent
//       // 目录才有重定向地址
//       menuItem.name = temp.menuName // 菜单必须有name标识
//       menuItem.meta = {
//         title: temp.menuTitle,
//         icon: temp.menuIcon,
//         hidden: temp.menuHidden == 1, // 详情页隐藏
//         alwaysShow: false,
//         activeMenu: temp.menuActiveMenu,
//         // noCache: true
//         // keepAlive: true
//       }
//     }
//     res.push(menuItem);

//     if (menuItem.children && menuItem.children.length) {
//       menuItem.children = filterAsyncRoutes(menuItem.children);
//     }
//   });
//   return res;
// };

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
    // getResource() {
    //   return new Promise((resolve, reject) => {
    //     userResourceByToken()
    //       .then((response: any) => {
    //         const menuList = response.data
    //         let accessedRoutes = []
    //         // 存储按钮标识
    //         const { user } = useStore()
    //         if (menuList.length) {
    //           const permList = filterResourcePerm(menuList, [])
    //           user.setPerms(permList)
    //           const currentResource = treeSortData(menuList);
    //           if (isNotNull(currentResource)) {
    //             if (currentResource[0].menuType == '系统') {
    //               accessedRoutes = filterAsyncRoutes(currentResource[0].children);
    //             } else {
    //               accessedRoutes = filterAsyncRoutes(currentResource)
    //             }
    //           }
    //         }
            
    //         this.setRoutes(accessedRoutes);
    //         resolve(accessedRoutes);
    //       })
    //       .catch((error) => {
    //         reject(error);
    //       });
    //   });
    // },
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
