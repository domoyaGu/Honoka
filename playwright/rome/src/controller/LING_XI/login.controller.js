const log4js = require('../../utils/logUtil');
const logger = log4js.getLogger('default');
const { chromium } = require('playwright');

class LXLogin {
  async login({ username, password }) {
    logger.info('灵犀保代开始登录');

    return new Promise(async (resolve) => {
      const browser = await chromium.launch();
      const context = await browser.newContext();
      const page = await context.newPage();
      let resolved = false;
      let jwtStr = '';

      try {
        await page.goto('https://group-ins.sczhbx.com/#/login');

        // 等待所有响应处理完成的标志
        let allResponsesProcessed = new Promise((resolveAllResponses) => {
          page.on('response', async (response) => {
            if (response?.url().includes('/northrend/login')) {
              logger.info('登录接口拦截');
              const res = await response.json();
              logger.info(res);

              if (!resolved) {
                if (res.code === 50002) {
                  resolved = true;
                  resolve({
                    auth: null,
                    status: -1,
                    message: res.msg,
                  });
                  resolveAllResponses();  // 标记响应处理完成
                } else if (res.code === 10000) {
                  jwtStr = res.data.jwt;
                } else {
                  resolved = true;
                  resolve({
                    auth: null,
                    status: -1,
                    message: '未知错误',
                  });
                  resolveAllResponses();  // 标记响应处理完成
                }
              }
            }

            if (response?.url().includes('/northrend/sys/user/getCurrentUserResource') && !resolved) {
              logger.info('跳转首页成功');
              const state = await context.storageState();

              resolved = true;
              resolve({
                auth: JSON.stringify({ 'jwt': jwtStr }),
                status: 200,
                message: '登录成功',
                frontAuthInfo: JSON.stringify(state)
              });
              resolveAllResponses();  // 标记响应处理完成
            }
          });
        });

        // 填写登录表单并提交
        await page.getByPlaceholder('请输入用户名').fill(username);
        await page.getByPlaceholder('请输入密码').fill(password);
        await page.getByRole('button', { name: '登 录' }).click();

        // 设置超时限制，避免一直等待
        await Promise.race([
          allResponsesProcessed,
          new Promise(resolveTimeout => setTimeout(resolveTimeout, 10000))  // 设置超时10秒
        ]);
        await page.close();
        await browser.close();
        logger.info('浏览器已关闭');
      } catch (error) {
        if (!resolved) {
          resolved = true;
          logger.error('登录过程出错:', error);
          resolve({
            auth: null,
            status: -1,
            message: '登录出错',
          });
        }
      } finally {
        await page.close();
        await browser.close();
        logger.info('浏览器已关闭');
      }
    });
  }

  async isLogin(params) {
    return new Promise(async (resolve, reject) => {
      try {
        // 解析 authInfo 参数，获取 jwt
        const authInfo = JSON.parse(params.authInfo);
        const jwt = authInfo.jwt;

        // 打印 jwt 值
        console.log(`jwt: ${jwt}`);

        // 启动浏览器
        const browser = await chromium.launch({ headless: false });
        const context = await browser.newContext({
          // 在请求头中加入 Authorization: Bearer jwt
          extraHTTPHeaders: {
            Jwt: `${jwt}`
          }
        });

        const page = await context.newPage();

        // 监听所有的网络请求，确保每个请求都携带 JWT
        await page.route('**/*', (route) => {
          const headers = {
            ...route.request().headers(),
            Jwt: `${jwt}`
          };
          route.continue({ headers });
        });

        // 跳转到指定页面
        const response = await page.goto('https://group-ins.sczhbx.com/#/dashboard/index', { waitUntil: 'networkidle' });

        // 等待页面中某个特定的登录后才能看到的元素出现
        await page.waitForSelector('#specific-dashboard-element', { timeout: 5000 });

        // 如果到达这里，说明页面加载成功
        console.log('页面加载成功');
        resolve(true);

        // 关闭浏览器
        // await browser.close();

      } catch (error) {
        // 捕获错误并拒绝 Promise
        console.error(`Error during login check: ${error.message}`);
        reject(error);
      }
    });
  }




}

module.exports = new LXLogin();
