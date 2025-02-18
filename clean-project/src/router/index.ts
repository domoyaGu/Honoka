import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router';
import useStore from '@/store';

export const Layout = () => import('@/layout/index.vue');

// 参数说明: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
// 静态路由
export const constantRoutes: Array<RouteRecordRaw> = [
  // {
  //   path: '/redirect',
  //   component: Layout,
  //   meta: { hidden: true },
  //   children: [
  //     {
  //       path: '/redirect/:path(.*)',
  //       component: () => import('@/views/redirect/index.vue')
  //     }
  //   ]
  // },
  // 登录
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true }
  },
  // {
  //   path: '/register',
  //   component: () => import('@/views/login/register.vue'),
  //   meta: { hidden: true }
  // },
  {
    path: '/forgotpwd',
    component: () => import('@/views/login/forgotpwd.vue'),
    meta: { hidden: true }
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    meta: { hidden: true }
  },
  // 首页
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        name: 'home',
        meta: { title: '数据概览', icon: 'data-overview', affix: true, level: 1, activateMenu: '/home' }
      },
      {
        path: '401',
        component: () => import('@/views/error-page/401.vue'),
        meta: { hidden: true }
      },
    ]
  },
  {
    path: '/business',
    component: Layout,
    redirect: '/user',
    children: [
      {
        path: '/user',
        component: () => import('@/views/user/index.vue'),
        name: 'user',
        meta: { title: '用户管理', icon: 'data-overview', affix: true, level: 1, activateMenu: '/user' },
        children: [
          {
            path: '/user/detail',
            component: () => import('@/views/user/detail.vue'),
            name: 'userDetail',
            meta: { title: '用户详情', level: 2, activateMenu: '/user' }
          },
        ]
      },
      {
        path: '/car',
        component: () => import('@/views/car/index.vue'),
        name: 'car',
        meta: { title: '车辆管理', icon: 'data-overview', affix: true, level: 1, activateMenu: '/car' },
        children: [
          {
            path: '/car/detail',
            component: () => import('@/views/car/detail.vue'),
            name: 'carDetail',
            meta: { title: '车辆详情', level: 2, activateMenu: '/car' }
          }
        ]
      },
    ]
  }
];

// 创建路由
const router = createRouter({
  history: createWebHistory(), // history模式
  routes: constantRoutes as RouteRecordRaw[],
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 })
});

// 重置路由
// export function resetRouter() {
//   const { permission } = useStore();
//   permission.routes.forEach(route => {
//     const name = route.name;
//     if (name && router.hasRoute(name)) {
//       router.removeRoute(name);
//     }
//   });
// }

export default router;
