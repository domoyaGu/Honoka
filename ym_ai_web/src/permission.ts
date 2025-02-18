import router from '@/router';
import useStore from '@/store';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
NProgress.configure({ showSpinner: false }); // 进度环显示/隐藏

// 白名单路由
const whiteList = ['/login', '/forgotpwd'];

router.beforeEach(async (to, from, next) => {
  next();
  NProgress.start();
  // const { user, permission } = useStore();
  // const hasToken = user.token;
  // if (hasToken) {
  //   // if (permission.rights?.length === 0) {
  //   //   // 用户信息重新获取（store刷新）
  //   //   await user.getUserInfo()
  //   //   // 获取资源列表（生成动态路由、全局存储按钮列表）
  //   //   await permission.getResource()
  //   // }
  //   // 登录成功，跳转到首页
  //   if (to.path === '/login') {
  //     next({ path: '/' });
  //     NProgress.done();
  //   } else {
  //     next();
  //   }
  // } else {
  //   // 未登录可以访问白名单页面(登录页面、忘记密码页)
  //   if (whiteList.indexOf(to.path) !== -1) {
  //     next();
  //   } else {
  //     next(`/login`);
  //     NProgress.done();
  //   }
  // }
});

router.afterEach(() => {
  NProgress.done();
});
