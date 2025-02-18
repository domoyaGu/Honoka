const log4js = require('../../utils/logUtil');
const logger = log4js.getLogger('default'); // 使用默认类别
const { chromium } = require('playwright');

class ZHLogin {
  async login({ username, password }) {
    logger.info('中保通开始登录');

    return new Promise(async (resolve) => {
      const browser = await chromium.launch();
      const context = await browser.newContext();
      const page = await context.newPage();
      let resolved = false; // 确保 resolve 只调用一次

      try {
        await page.goto('https://union.insurance-china.com/login.html');

        // 等待所有响应处理完成的标志
        let allResponsesProcessed = new Promise((resolveAllResponses) => {
          // 监听响应事件
          page.on('response', async (response) => {
            try {
              if (response.url().includes('/user/commonlogin')) {
                const res = await response.json();
                logger.info(`拦截到的响应体: ${JSON.stringify(res, null, 2)}`);

                if (res.code !== 200 && !resolved) {
                  resolved = true;
                  resolve({
                    auth: null,
                    status: -1,
                    message: res.message,
                  });
                  resolveAllResponses(); // 标记所有响应处理完成
                }
              }

              if (response.url().includes('/memberAPI/login/getLoginInfo') && !resolved) {
                logger.info('跳转首页成功');
                const cookies = await page.context().cookies([response.url()]);
                const cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join(';');
                const state = await context.storageState();

                resolved = true;
                resolve({
                  auth: JSON.stringify({ Cookie: `${cookieString}` }),
                  status: 200,
                  message: '登录成功',
                  frontAuthInfo: JSON.stringify(state),
                });
                resolveAllResponses(); // 标记所有响应处理完成
              }
            } catch (error) {
              logger.warn(`响应处理错误: ${error.message}`);
            }
          });
        });

        // 输入用户名和密码并登录
        await page.getByPlaceholder('用户名/邮箱/手机号').fill(username);
        await page.getByPlaceholder('密码').fill(password);
        await page.getByText('立即登录').first().click();

        // 等待页面跳转或响应，加入超时机制
        await Promise.race([
          page.waitForNavigation({ waitUntil: 'networkidle' }),
          page.waitForResponse(response => response.url().includes('/memberAPI/login/getLoginInfo')),
          allResponsesProcessed, // 等待所有响应处理完成
          new Promise(resolveTimeout => setTimeout(resolveTimeout, 10000))  // 设置超时10秒
        ]);

        if (!resolved) {
          // 如果跳转完成但未捕获到特定响应
          logger.info('检测到页面跳转，登录成功');
          const cookies = await context.cookies();
          const cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join(';');
          const state = await context.storageState();

          resolved = true;
          resolve({
            auth: JSON.stringify({ Cookie: `${cookieString}` }),
            status: 200,
            message: '登录成功',
            frontAuthInfo: JSON.stringify(state),
          });
        }

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
    return new Promise(async (resolve) => {
      let browser;
      try {
        // 解析 authInfo 参数，获取 Cookie
        const authInfo = JSON.parse(params.authInfo);
        const cookieString = authInfo.Cookie;
        logger.info(`Cookies: ${cookieString}`);

        // 将Cookie字符串解析为Playwright格式的cookie对象
        const cookies = cookieString.split(';').map(cookiePair => {
          const [name, value] = cookiePair.trim().split('=');
          return {
            name,
            value,
            domain: 'union.insurance-china.com',  // 替换为目标网站的域名
            path: '/'
          };
        });

        // 启动浏览器
        browser = await chromium.launch({ headless: false });
        const context = await browser.newContext();
        await context.addCookies(cookies);

        // 创建新页面
        const page = await context.newPage();

        // 初始化变量来保存拦截的请求响应数据
        let responseData = null;

        // 监听并拦截指定接口的响应
        page.on('response', async (response) => {
          if (response.url().includes('/memberAPI/login/getLoginInfo')) {  // 判断是否是我们要拦截的请求
            responseData = await response.json();  // 获取返回的JSON数据
            logger.info('拦截到请求响应:', responseData);
          }
        });

        // 跳转到指定页面
        await page.goto('https://union.insurance-china.com/Nuxt/UnionPage/productList', { waitUntil: 'networkidle' });

        // 刷新页面
        await page.reload({ waitUntil: 'networkidle' });

        // 检查拦截到的响应数据，判断登录状态
        if (responseData && responseData.status === 200) {
          logger.info('登录有效，接口正常调用');
          resolve({
            auth: null,
            status: 200,
            message: '登录凭证有效',
            response: responseData,
          });
        } else {
          logger.info('登录凭证失效，需更新凭证');
          resolve({
            auth: '新登录凭证是XXX',
            status: -1,
            message: '登录凭证失效，需更新凭证',
            response: responseData,
          });
        }

      } catch (error) {
        logger.error(`登录凭证过期检查时出错: ${error.message}`);

        // 捕获异常，返回登录过期状态
        resolve({
          auth: null,
          status: -1,
          message: '登录凭证过期检查时出错',
          response: null
        });
      } finally {
        // 确保关闭浏览器
        // await browser.close();
        logger.info('浏览器已关闭');
      }
    });
  }

}

module.exports = new ZHLogin();
