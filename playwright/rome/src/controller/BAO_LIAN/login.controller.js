const { chromium } = require('playwright');
const fs = require('fs').promises; // 用于文件操作
const path = require('path'); // 用于路径操作

class BLLogin {
  async login({ username, password }) {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    let resolved = false; // 标记 resolve 是否已经被调用

    return new Promise(async (resolve) => {
      try {
        let allResponsesProcessed = new Promise((resolveAllResponses) => {
          // 拦截验证码图片接口
          page.on('response', async (response) => {
            if (response?.url().includes('/captcha/verify')) {
              const responseBody = await response.body();

              // 将验证码图片保存到本地
              const captchaImagePath = path.join(__dirname, 'captcha.png');
              await fs.writeFile(captchaImagePath, responseBody);

              // 提示用户输入验证码
              const vc = await this.promptUserForCaptcha(captchaImagePath);

              if (vc) {
                // 填写验证码
                await page.getByPlaceholder('验证码').click();
                await page.waitForTimeout(1000); // 避免操作过快
                await page.getByPlaceholder('验证码').fill(vc);

                // 填写用户名和密码
                await page.getByPlaceholder('请输入用户名').click();
                await page.getByPlaceholder('请输入用户名').fill(username);
                await page.getByPlaceholder('请输入密码').click();
                await page.getByPlaceholder('请输入密码').fill(password);

                // 点击登录按钮
                await page.waitForTimeout(1000); // 避免操作过快
                await page.getByRole('button', {name: '确 定'}).click();

                // 监听请求 /user/detail 以获取 x-token
                page.on('request', async (request) => {
                  if (request.url().includes('/user/detail')) {
                    const headers = request.headers();
                    const xToken = headers['x-token'];

                    if (xToken) {
                      if (!resolved) {
                        resolved = true;

                        const state = await context.storageState();

                        resolve({
                          auth: JSON.stringify({'x-token': xToken}),
                          status: 200,
                          message: '登录成功',
                          frontAuthInfo: JSON.stringify(state)
                        });
                        resolveAllResponses();
                      }
                    }
                  }
                });
              }
            }
          });
        });
        // 访问登录页面
        await page.goto('https://b.anqbao.com/#/user/login');

        // 添加超时处理的逻辑
        await Promise.race([
          page.waitForNavigation({ waitUntil: 'networkidle' }),
          page.waitForResponse(res => res.url().includes('/user/detail')),
          allResponsesProcessed, // 等待所有响应处理完成
          new Promise((_, reject) => setTimeout(() => reject(new Error('登录过程超时')), 20000))  // 设置超时10秒
        ]);

        if (!resolved) {
          resolved = true;
          resolve({auth: null, status: -1, message: '登录失败或 x-token 未捕获'});
        }

      } catch (error) {
        if (!resolved) {
          resolved = true;
          logger.error('登录过程出错:', error);
          resolve({ auth: null, status: -1, message: '登录出错' });
        }
      } finally {
        await page.close();
        await browser.close();
        logger.info('浏览器已关闭');
      }
    });
  }

  // 提示用户输入验证码
  async promptUserForCaptcha(captchaImagePath) {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      readline.question(`请查看图片 ${captchaImagePath} 并输入验证码: `, (captcha) => {
        readline.close();
        resolve(captcha);
      });
    });
  }
}

module.exports = new BLLogin();
