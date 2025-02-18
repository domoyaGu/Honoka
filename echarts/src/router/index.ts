import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router';
import useStore from '@/store';

export const Layout = () => import('@/layout/index.vue');

// 参数说明: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
// 静态路由
export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  // 登录
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true }
  },
  // 契约锁
  // {
  //   path: '/qiyuesuo',
  //   component: () => import('@/views/qiyuesuo/index.vue'),
  //   meta: { hidden: true }
  // },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    meta: { hidden: true }
  },
  // {
  //   path: '/:catchAll(.*)',
  //   name: '404',
  //   component: () => import('@/views/error-page/404.vue')
  // },

  // // 首页
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   children: [
  //     {
  //       path: 'dashboard',
  //       component: () => import('@/views/dashboard/index.vue'),
  //       name: 'Dashboard',
  //       meta: { title: 'dashboard', icon: 'user-info', affix: true }
  //     },
  //     {
  //       path: '401',
  //       component: () => import('@/views/error-page/401.vue'),
  //       meta: { hidden: true }
  //     },
  //   ]
  // },
  // 数据概览
  {
    path: '/',
    component: Layout,
    redirect: '/data-overview',
    children: [
      {
        path: '/data-overview',
        component: () => import('@/views/data-overview/index.vue'),
        name: 'dataOverview',
        meta: { title: 'dataOverview', icon: 'data-overview', affix: true }
      },
      {
        path: '401',
        component: () => import('@/views/error-page/401.vue'),
        meta: { hidden: true }
      },
    ]
  },
    // // 综合查询
    // {
    //   path: '/comprehensive-survey',
    //   component: Layout,
    //   redirect: '/comprehensive-survey',
    //   children: [
    //     {
    //       path: '/comprehensive-survey', // 综合查询 列表页
    //       component: () => import('@/views/comprehensive-survey/comprehensive-survey'),
    //       name: 'ComprehensiveSurvey',
    //       meta: { title: 'comprehensiveSurvey', icon: 'search', roles: ['admin'] }
    //     }
    //   ]
    // },
  // -------------------------------------------
    // 统筹业务
    {
      path: '/overall-business',
      component: Layout,
      redirect: '/analysis',
      name: 'OverallBusiness',
      meta: {
        title: 'overallBusiness',
        icon: 'workbench',
        roles: ['admin']
      },
      children: [
        {
          path: '/analysis',
          component: () => import('@/views/overall-business/analysis/index.vue'),
          meta: { hidden: true}
        },
        {
          path: '/analysis/detail/:id',
          component: () => import('@/views/overall-business/analysis/detail.vue'),
          meta: { hidden: true}
        },
      ]
    },
  //   // 支付管理
  //   {
  //     path: '/payment-management',
  //     component: Layout,
  //     redirect: '/payment-management',
  //     children: [
  //       {
  //         path: '/payment-management', // 支付管理 列表页
  //         component: () => import('@/views/payment-management/index.vue'),
  //         name: 'PaymentManagement',
  //         meta: { title: 'PaymentManagement', icon: 'money', roles: ['admin'] }
  //       },
  //       {
  //         path: '/payment-management-details/:id',
  //         component: () => import('@/views/payment-management/details.vue'),
  //         name: 'paymentManagementDetails',
  //         meta: { title: 'paymentManagementDetails', noCache: true,hidden: true, roles: ['admin'], activeMenu: '/payment-management' }
  //       }
  //     ]
  //   },
  // // 基本设置
  // {
  //   path: '/basic',
  //   component: Layout,
  //   redirect: '/basic/account',
  //   meta: {
  //     title: '基本设置',
  //     icon: 'goods',
  //     hidden: false,
  //     alwaysShow: true,
  //     roles: ['admin'],
  //   },
  //   children: [
  //     {
  //       path: '/basic/account',
  //       component: () => import('@/views/basic/account/index.vue'),
  //       name: 'account',
  //       meta: {
  //         title: '子账号管理',
  //         hidden: false,
  //         alwaysShow: false,
  //         roles: ['admin'],
  //       }
  //     },
  //     {
  //       path: '/basic/account/detail/:id',
  //       component: () => import('@/views/basic/account/detail.vue'),
  //       name: 'account-detail',
  //       meta: {
  //         title: '子账号详情',
  //         hidden: true,
  //         alwaysShow: false,
  //         roles: ['admin'],
  //       }
  //     },
  //     {
  //       path: '/basic/role',
  //       component: () => import('@/views/basic/role/index.vue'),
  //       name: 'role',
  //       meta: {
  //         title: '角色管理',
  //         hidden: false,
  //         alwaysShow: false,
  //         roles: ['admin'],
  //       }
  //     },
  //     {
  //       path: '/basic/role/detail/:id',
  //       component: () => import('@/views/basic/role/detail.vue'),
  //       name: 'role-detail',
  //       meta: {
  //         title: '角色详情',
  //         hidden: true,
  //         alwaysShow: false,
  //         roles: ['admin'],
  //       }
  //     },
  //     {
  //       path: '/basic/unit',
  //       component: () => import('@/views/basic/unit/index.vue'),
  //       name: 'unit',
  //       meta: {
  //         title: '单位管理',
  //         hidden: false,
  //         alwaysShow: false,
  //         roles: ['admin'],
  //       }
  //     },
  //     {
  //       path: '/basic/unit/detail/:id',
  //       component: () => import('@/views/basic/unit/detail.vue'),
  //       name: 'unit-detail',
  //       meta: {
  //         title: '单位管理详情',
  //         hidden: true,
  //         alwaysShow: false,
  //         roles: ['admin'],
  //       }
  //     },
  //     // {
  //     //   path: '/basic/account/profile',
  //     //   component: () => import('@/views/basic/account/profile.vue'),
  //     //   name: 'account-profile',
  //     //   meta: {
  //     //     title: '我的',
  //     //     hidden: false,
  //     //     alwaysShow: false,
  //     //     roles: ['admin'],
  //     //   }
  //     // },
  //   ]
  // },
  // -------------------------------------------
];

// 创建路由
const router = createRouter({
  // history: createWebHashHistory(), // hash模式
  history: createWebHistory(), // history模式
  routes: constantRoutes as RouteRecordRaw[],
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 })
});

// 重置路由
export function resetRouter() {
  const { permission } = useStore();
  permission.routes.forEach(route => {
    const name = route.name;
    if (name && router.hasRoute(name)) {
      router.removeRoute(name);
    }
  });
}

export default router;
