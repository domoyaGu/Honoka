const log4js = require('../../utils/logUtil');
const logger = log4js.getLogger('default'); // 使用默认类别
const { chromium } = require('playwright');
const OCRService = require('../../utils/ocrUtil');

class JIULogin {
  async login({ username, password }) {
    logger.info('玖保云开始登录');
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    let resolved = false; // 标记 resolve 是否已经被调用
    let ocrAttempts = 0;  // 记录 OCR 尝试次数
    const maxOcrAttempts = 3; // 定义最大尝试次数
    const maxResponseTime = 10000; // 定义最大等待响应时间 10 秒

    return new Promise(async (resolve, reject) => {
      try {
        let vcRes; // 存储验证码响应
        let vc; // 存储验证码
        let isValidVC = false;

        let allResponsesProcessed = new Promise((resolveAllResponses) => {
          // 拦截验证码图片接口
          page.on('response', async (response) => {
            if (response?.url().includes('/user/verifyCode')) {
              logger.info('登录验证码接口拦截');

              // 进行验证码 OCR 识别，最多重试3次
              while (!isValidVC && ocrAttempts < maxOcrAttempts) {
                ocrAttempts++;
                try {
                  const responseBody = await response.body();
                  logger.info('验证码响应被拦截');

                  vcRes = await OCRService.getVC(responseBody); // 调用 OCR 识别验证码

                  if (vcRes === null) {
                    logger.error('OCR调用结果为null');
                    if (!resolved) {
                      resolved = true;
                      resolve({ auth: null, status: -1, message: 'OCR调用结果为null' });
                      resolveAllResponses(); // 标记所有响应处理完成
                    }
                    return;
                  }

                  // 去除4位数字之外的字符
                  vc = vcRes.toString().replace(/\D/g, '');
                  logger.info('验证码识别结果:', vc);

                  if (vc && vc.length === 4) {
                    logger.info('验证码识别成功:', vc);
                    isValidVC = true; // 成功识别验证码，结束循环
                    if (isValidVC) {
                      await page.getByPlaceholder('请输入验证码').fill(vc);
                      logger.info('验证码填写成功');

                      // 填写用户名和密码
                      await page.getByPlaceholder('请输入用户名').fill(username);
                      await page.getByPlaceholder('请输入密码').fill(password);

                      // 点击登录按钮
                      await page.waitForTimeout(1000); // 避免操作过快
                      await page.getByRole('button', { name: '登 录' }).click();
                      logger.info('登录按钮已点击');
                      resolveAllResponses(); // 标记所有响应处理完成
                    }
                  } else {
                    logger.warn('验证码识别失败，重新获取验证码');
                    await page.locator('#vcode').click();
                    const responseTimeout = new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('验证码加载超时')), maxResponseTime)
                    );
                    await Promise.race([page.waitForResponse(res => res.url().includes('/user/verifyCode')), responseTimeout]);
                  }
                } catch (ocrError) {
                  logger.error('OCR识别出错:', ocrError);

                  if (ocrAttempts >= maxOcrAttempts) {
                    logger.error('OCR识别超过三次，终止流程');
                    if (!resolved) {
                      resolved = true;
                      resolve({ auth: null, status: -1, message: 'OCR识别超过最大尝试次数' });
                      resolveAllResponses(); // 标记所有响应处理完成
                    }
                    return;
                  }
                }
              }
            }
          });
        });
        // 访问登录页面
        await page.goto('https://baoxian9.com/');

        await Promise.race([
          page.waitForNavigation({ waitUntil: 'networkidle' }),
          page.waitForResponse(res => res.url().includes('/tk/companymana/getcompany')),
          allResponsesProcessed, // 等待所有响应处理完成
          new Promise((_, reject) => setTimeout(() => reject(new Error('登录过程超时')), 10000))  // 设置超时10秒
        ]);

        if (!resolved) {
          logger.info('检测到页面跳转，登录成功');
          const cookies = await context.cookies();
          const cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join(';');

          const state = await context.storageState();

          resolved = true;
          resolve({
            auth: JSON.stringify({ Cookie: `${cookieString}` }),
            status: 200,
            message: '登录成功',
            frontAuthInfo: JSON.stringify(state)
          });
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
            domain: 'baoxian9.com',  // 替换为目标网站的域名
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
          if (response.url().includes('/tk/user/checkLogin')) {  // 判断是否是我们要拦截的请求
            responseData = await response.json();  // 获取返回的JSON数据
            logger.info('拦截到请求响应:', responseData);
          }
        });

        // 跳转到指定页面
        await page.goto('https://baoxian9.com/pc/product.html', { waitUntil: 'networkidle' });

        // 刷新页面
        await page.reload({ waitUntil: 'networkidle' });

        // 检查拦截到的响应数据，判断登录状态
        if (responseData && responseData.errorCode === 10) {
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

module.exports = new JIULogin();
