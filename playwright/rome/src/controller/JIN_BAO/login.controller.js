const log4js = require('../../utils/logUtil');
const logger = log4js.getLogger('default');
const { chromium } = require('playwright');

class JINLogin {
  async login({ username, password }) {
    logger.info('金保宝网开始登录');

    return new Promise(async (resolve, reject) => {
      // 初始化浏览器、上下文和页面
      const browser = await chromium.launch();
      const context = await browser.newContext();
      const page = await context.newPage();
      let resolved = false; // 确保 resolve 只被调用一次

      // 等待所有响应处理完成的标志
      let allResponsesProcessed = new Promise((resolveAllResponses) => {
        page.on('response', async (response) => {
          try {
            if (response.url().includes('/oauth/api/oauth2/token')) {
              const res = await response.json();
              logger.info(`拦截到的响应体: ${JSON.stringify(res, null, 2)}`);
              if (res.error && !resolved) {
                resolved = true;
                resolve({
                  auth: null,
                  status: -1,
                  message: res.error,
                });
                resolveAllResponses(); // 标记所有响应处理完成
              }
            }
          } catch (error) {
            if (!resolved) {
              logger.warn(`无法解析响应体，页面可能已经跳转: ${error.message}`);
            }
          }
        });
      });

      try {
        await page.goto('https://v2.jinbaobao.com.cn/');

        // 输入用户名和密码并点击登录
        await page.locator('a').filter({ hasText: '登录' }).click();
        await page.getByPlaceholder('请输入用户名').fill(username);
        await page.getByPlaceholder('请输入密码').fill(password);
        await page.getByRole('button', { name: '登 录' }).click();

        // 等待页面跳转到首页或响应处理完成，加入超时机制
        await Promise.race([
          page.waitForNavigation({ waitUntil: 'networkidle' }),
          allResponsesProcessed, // 等待所有响应处理完成
          new Promise(resolveTimeout => setTimeout(resolveTimeout, 10000))  // 设置超时10秒
        ]);

        if (!resolved) {
          // 获取 localStorage 中的 v2_access_token
          const v2AccessToken = await page.evaluate(() => localStorage.getItem('v2_access_token'));

          if (v2AccessToken) {
            logger.info(`成功获取到 v2_access_token: ${v2AccessToken}`);
            resolved = true;

            const state = await context.storageState();
            resolve({
              auth: JSON.stringify({ 'Authorization': `Bearer ${v2AccessToken}` }),
              status: 200,
              message: '登录成功',
              frontAuthInfo: JSON.stringify(state)
            });
          } else {
            resolved = true;
            reject('登录成功但无法获取 v2_access_token');
          }
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
        await page.close();
        await browser.close();
        logger.info('浏览器已关闭');
      }
    });
  }
}

module.exports = new JINLogin();
