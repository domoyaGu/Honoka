import router from '@/router';
import useStore from '@/store';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
NProgress.configure({ showSpinner: false }); // 进度环显示/隐藏

// 白名单路由
const whiteList = ['/home', '/login', '/forgotpwd'];

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  const { user } = useStore();
  // const hasToken = user.token;
  // if (hasToken) {
  //   // 登录成功，跳转到首页
  //   if (to.path === '/login') {
  //     next({ path: '/' });
  //     NProgress.done();
  //   } else {
  //     if (!user?.userInfo?.userId) {
  //       await user.getUserInfo();
  //     }
  //     const id = user.userInfo.userId
  //     const isAdmin = user.userInfo.isAdmin
  //     if (id && (isAdmin === '1')) {
  //       if (to.matched.length === 0) {
  //         from.name ? next({ name: from.name as any }) : next('/401');
  //       } else {
  //         next();
  //       }
  //     } else {
  //       // try {
  //       //   // 获取用户信息
  //       //   await user.getUserInfo();
  //       //   next({ ...to, replace: true });
  //       // } catch (error) {
  //         // 移除 token 并跳转登录页
  //         await user.logout();
  //         ElMessageBox.alert(
  //           '当前页面已失效或无权限，请重新登录',
  //           '提示',
  //           {
  //             confirmButtonText: '确认',
  //             type: 'warning',
  //             callback: () => {
  //               sessionStorage.clear();
  //               localStorage.clear(); // 清除缓存
  //               window.location.href = '/login'; // 跳转登录页
  //             }
  //           }
  //         )
  //         NProgress.done();
  //       // }
  //     }
  //   }
  // } else {
    // 未登录可以访问白名单页面(登录页面)
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login`);
      NProgress.done();
    }
  // }
});

router.afterEach(() => {
  NProgress.done();
});
