const log4js = require('../../utils/logUtil');
const logger = log4js.getLogger('default'); // 使用默认类别
const { chromium } = require('playwright');

class NUANLogin {
  async login({ username, password }) {
    logger.info('暖心保开始登录');

    return new Promise(async (resolve, reject) => {
      // 初始化浏览器、上下文和页面
      const browser = await chromium.launch();
      const context = await browser.newContext();
      const page = await context.newPage();
      let resolved = false; // 确保 resolve 只调用一次

      // 等待所有响应处理完成的标志
      let allResponsesProcessed = new Promise((resolveAllResponses) => {
        page.on('response', async (response) => {
          try {
            const url = response.url();
            if (url.includes('/seller/login/pwdLogin')) {
              const res = await response.json();
              logger.info(`拦截到的响应体: ${JSON.stringify(res, null, 2)}`);

              if (res.code !== 1 && !resolved) {
                resolved = true;
                resolve({
                  auth: null,
                  status: -1,
                  message: res.msg,
                });
                resolveAllResponses(); // 标记所有响应处理完成
              }
            }

            if (url.includes('/seller/index/user') && !resolved) {
              logger.info('跳转首页成功');
              const cookies = await context.cookies([response.url()]);
              const cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join(';');

              const state = await context.storageState();
              resolved = true;
              resolve({
                auth: JSON.stringify({ Cookie: cookieString }),
                status: 200,
                message: '登录成功',
                frontAuthInfo: JSON.stringify(state)
              });
              resolveAllResponses(); // 标记所有响应处理完成
            }
          } catch (error) {
            if (!resolved) {
              logger.warn(`无法解析响应体，页面可能已经跳转: ${error.message}`);
            }
          }
        });
      });

      try {
        // 访问登录页面
        await page.goto('https://nxb.xiehewanbang.com/index/login');

        // 输入用户名和密码并登录
        await page.fill('input[placeholder="请输入手机号"]', username);
        await page.fill('input[placeholder="请输入密码"]', password);
        await page.click('text=登 录');

        // 等待页面跳转或所有响应处理完成
        await Promise.race([
          page.waitForNavigation({ waitUntil: 'networkidle' }),
          allResponsesProcessed, // 等待所有响应处理完成
          new Promise(resolveTimeout => setTimeout(resolveTimeout, 10000))  // 设置超时10秒
        ]);

        if (!resolved) {
          // 登录成功，处理 Cookie
          logger.info('检测到页面跳转，登录成功');
          const cookies = await context.cookies();
          const cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join(';');

          const state = await context.storageState();
          resolved = true;
          resolve({
            auth: JSON.stringify({ Cookie: cookieString }),
            status: 200,
            message: '登录成功',
            frontAuthInfo: JSON.stringify(state)
          });
        }

      } catch (error) {
        if (!resolved) {
          resolved = true;
          logger.error('登录过程出错:', error);
          resolve({
            auth: null,
            status: -1,
            message: '登陆出错',
          });
        }
      } finally {
        // 确保关闭页面和浏览器
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
            domain: 'nxb.xiehewanbang.com',  // 替换为目标网站的域名
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
          if (response.url().includes('/seller/index/user')) {  // 判断是否是我们要拦截的请求
            responseData = await response.json();  // 获取返回的JSON数据
            logger.info('拦截到请求响应:', responseData);
          }
        });

        // 跳转到指定页面
        await page.goto('https://nxb.xiehewanbang.com/index/home', { waitUntil: 'networkidle' });

        // 刷新页面
        await page.reload({ waitUntil: 'networkidle' });

        // 检查拦截到的响应数据，判断登录状态
        if (responseData && responseData.msg.mobile !== '') {
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
        // 确保浏览器关闭
        if (browser) {
          // await browser.close();
        }
      }
    });
  }

}

module.exports = new NUANLogin();
