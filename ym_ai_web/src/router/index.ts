import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { require_ } from '@/utils/require';
const Layout = () => import('@/layout/index.vue');

export function initMenuList() {
  return [
    {
      path: '/',
      component: Layout,
      redirect: '/home',
      children: [
        // 车险
        {
          path: '/car',
          redirect: '/picture',
          component: () => import('@/views/empty.vue'),
          meta: { title: '车险服务', type: 'group' },
          children: [
            {
              path: '/picture',
              name: 'picture',
              component: () => import('@/views/car/picture/index.vue'),
              meta: {
                title: '以图搜图',
                noCache: false,
                keepAlive: true,
                level: 2,
                type: 'item',
                activeIcon: require_('@/assets/menu/picture-active.svg'),
                deActiveIcon: require_('@/assets/menu/picture.svg')
              }
            },
            {
              path: '/carrisk',
              component: () => import('@/views/car/carrisk/index.vue'),
              name: 'carrisk',
              meta: {
                title: '车辆风险',
                noCache: false,
                keepAlive: true,
                level: 2,
                type: 'item',
                activeIcon: require_('@/assets/menu/carrisk-active.svg'),
                deActiveIcon: require_('@/assets/menu/carrisk.svg')
              }
            },
            {
              path: '/peoplerisk',
              component: () => import('@/views/car/peoplerisk/index.vue'),
              name: 'peoplerisk',
              meta: {
                title: '人员风险',
                noCache: false,
                keepAlive: true,
                level: 2,
                type: 'item',
                activeIcon: require_('@/assets/menu/peoplerisk-active.svg'),
                deActiveIcon: require_('@/assets/menu/peoplerisk.svg')
              }
            },
            {
              path: '/socialrisk',
              name: 'socialrisk',
              component: () => import('@/views/car/socialrisk/index.vue'),
              meta: {
                title: '车险事后',
                noCache: false,
                keepAlive: true,
                level: 2,
                type: 'item',
                activeIcon: require_('@/assets/menu/socialrisk-active.svg'),
                deActiveIcon: require_('@/assets/menu/socialrisk.svg')
              },
            },
            {
              path: '/socialrisk/detail',
              component: () => import('@/views/car/socialrisk/detail.vue'),
              name: 'socialriskDetail',
              meta: {
                title: '车险事后详情',
                type: 'item',
                noCache: false,
                level: 3,
                parentPath: '/socialrisk',
                parentTitle: '车险事后',
              }
            },
          ]
        },
        // 医疗
        {
          path: '/medicine',
          redirect: '/medicinechart',
          component: () => import('@/views/empty.vue'),
          meta: { title: '医疗服务', type: 'group' },
          children: [
            {
              path: '/medicinechart',
              component: () => import('@/views/medicine/chart/index.vue'),
              name: 'medicinechart',
              meta: {
                title: '医疗图谱',
                noCache: false,
                keepAlive: true,
                level: 2,
                type: 'item',
                activeIcon: require_('@/assets/menu/medicine-chart-active.svg'),
                deActiveIcon: require_('@/assets/menu/medicine-chart.svg')
              }
            },
            {
              path: '/medicineAtlas',
              component: () => import('@/views/medicine/atlas/index.vue'),
              name: 'medicineAtlas',
              meta: {
                title: '医院名录',
                noCache: false,
                keepAlive: true,
                level: 2,
                type: 'item',
                activeIcon: require_('@/assets/menu/medicine-atlas-active.svg'),
                deActiveIcon: require_('@/assets/menu/medicine-atlas.svg')
              }
            },
            {
              path: '/classificationOfDrugs',
              component: () =>
                import('@/views/medicine/classificationOfDrugs/index.vue'),
              name: 'classificationOfDrugs',
              meta: {
                title: '药品分类与代码',
                noCache: false,
                keepAlive: true,
                level: 2,
                type: 'item',
                activeIcon: require_('@/assets/menu/medicine-drugs-active.svg'),
                deActiveIcon: require_('@/assets/menu/medicine-drugs.svg')
              }
            },
            {
              path: '/medicalSupplies',
              component: () =>
                import('@/views/medicine/medicalSupplies/index.vue'),
              name: 'medicalSupplies',
              meta: {
                title: '医用耗材与代码',
                noCache: false,
                keepAlive: true,
                level: 2,
                type: 'item',
                activeIcon: require_(
                  '@/assets/menu/medical-supplies-active.svg'
                ),
                deActiveIcon: require_('@/assets/menu/medical-supplies.svg')
              }
            },
            {
              path: '/serviceItems',
              component: () =>
                import('@/views/medicine/serviceItems/index.vue'),
              name: 'serviceItems',
              meta: {
                title: '医疗服务项目分类代码',
                noCache: false,
                keepAlive: true,
                level: 2,
                type: 'item',
                activeIcon: require_('@/assets/menu/service-items-active.svg'),
                deActiveIcon: require_('@/assets/menu/service-items.svg')
              }
            },
            {
              path: '/classificationCode',
              component: () =>
                import('@/views/medicine/classificationCode/index.vue'),
              name: 'classificationCode',
              meta: {
                title: '手术操作分类与代码',
                noCache: false,
                keepAlive: true,
                level: 2,
                type: 'item',
                activeIcon: require_(
                  '@/assets/menu/classification-code-active.svg'
                ),
                deActiveIcon: require_('@/assets/menu/classification-code.svg')
              }
            }
          ]
        },
        {
          path: '/company',
          redirect: '/companyInfo',
          component: () => import('@/views/empty.vue'),
          meta: { title: '企业风险', type: 'group' },
          children: [
            {
              path: '/companyInfo',
              component: () => import('@/views/company/companyInfo/index.vue'),
              name: 'companyInfo',
              meta: {
                title: '企业信息库',
                noCache: false,
                keepAlive: true,
                level: 2,
                type: 'item',
                activeIcon: require_('@/assets/menu/company-info-active.svg'),
                deActiveIcon: require_('@/assets/menu/company-info.svg')
              }
            },
            {
              path: '/companyrisk',
              component: () => import('@/views/company/risk/index.vue'),
              name: 'companyrisk',
              meta: {
                title: '诉讼风险',
                noCache: false,
                keepAlive: true,
                level: 2,
                type: 'item',
                activeIcon: require_('@/assets/menu/company-risk-active.svg'),
                deActiveIcon: require_('@/assets/menu/company-risk.svg')
              }
            }
          ]
        }
      ]
    }
  ] as Array<RouteRecordRaw>;
}

// 参数说明: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
// 静态路由
export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true }
  },
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
  {
    path: '/home',
    component: () => import('@/views/home/index.vue'),
    meta: { hidden: true }
  },
  ...initMenuList()
];

// 创建路由
const router = createRouter({
  history: createWebHistory(), // history模式
  routes: constantRoutes as RouteRecordRaw[],
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 })
});

export default router;
