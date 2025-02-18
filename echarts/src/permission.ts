import router from '@/router';
import { ElMessage } from 'element-plus';
import useStore from '@/store';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
NProgress.configure({ showSpinner: false }); // 进度环显示/隐藏

// 白名单路由
const whiteList = ['/login','/analysis/detail'];

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  const { user, system, permission } = useStore();
  const accessRoutes: any = await permission.getResource();
  // if (accessRoutes.length) {
  //   accessRoutes.forEach((route: any) => {
  //     router.addRoute(route);
  //   });
  // }
  next();
});

router.afterEach(() => {
  NProgress.done();
});
