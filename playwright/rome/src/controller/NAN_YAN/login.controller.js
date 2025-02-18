const log4js = require('../../utils/logUtil');
const logger = log4js.getLogger('default'); // 使用默认类别
const { chromium } = require('playwright');
const OCRService = require('../../utils/ocrUtil');

class NYLogin {
  async login({ username, password }) {
    logger.info('南燕开始登录');
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    let resolved = false; // 标记 resolve 是否已经被调用
    let ocrAttempts = 0;  // 记录 OCR 尝试次数
    const maxOcrAttempts = 1; // 定义最大尝试次数
    const maxResponseTime = 10000; // 定义最大等待响应时间 10 秒

    return new Promise(async (resolve) => {
      try {
        let vcRes; // 存储验证码响应
        let vc; // 存储验证码
        let allResponsesProcessed = new Promise((resolveAllResponses) => {
          // 拦截验证码图片接口
          page.on('response', async (response) => {
            if (response?.url().includes('/user/hpif_getRand')) {
              logger.info('登录验证码接口拦截');
              let isValidVC = false;

              // 进行验证码 OCR 识别，最多重试 maxOcrAttempts 次
              while (!isValidVC && ocrAttempts < maxOcrAttempts) {
                ocrAttempts++;
                try {
                  const responseBody = await response.body();
                  logger.info('验证码响应被拦截');

                  vcRes = await OCRService.getVC(responseBody); // 调用 OCR 识别验证码

                  // 检查 OCR 结果是否为 null
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
                      // 填写验证码
                      await page.locator('#validatcode').click();
                      // await page.waitForTimeout(500); // 避免操作过快
                      await page.locator('#validatcode').fill(vc);
                      logger.info('验证码填写成功');

                      // 填写用户名和密码
                      await page.getByRole('textbox', { name: '请输入登录账号' }).click();
                      await page.getByRole('textbox', { name: '请输入登录账号' }).fill(username);
                      await page.getByRole('textbox', { name: '请输入密码' }).click();
                      await page.getByRole('textbox', { name: '请输入密码' }).fill(password);

                      // 点击登录按钮
                      await page.waitForTimeout(500); // 避免操作过快
                      await page.getByRole('button', { name: '登    录' }).click();
                      logger.info('登录按钮已点击');

                    }
                    resolveAllResponses(); // 标记所有响应处理完成

                  } else {
                    logger.warn('验证码识别失败，重新获取验证码');
                    // 点击验证码图片，重新获取验证码
                    await page.getByRole('img', { name: '点击更换验证码' }).click();

                    // 等待新的验证码加载，或超时
                    const responseTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error('验证码加载超时')), maxResponseTime));
                    await Promise.race([page.waitForResponse(res => res.url().includes('/user/hpif_getRand')), responseTimeout]);
                  }
                } catch (ocrError) {
                  logger.error('OCR识别出错:', ocrError);

                  if (ocrAttempts >= maxOcrAttempts) {
                    logger.error('OCR识别超过最大尝试次数，终止流程');
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
        await page.goto('https://www.ssish.com/');

        // 添加超时处理的逻辑
        await Promise.race([
          page.waitForNavigation({ waitUntil: 'networkidle' }),
          page.waitForResponse(res => res.url().includes('/policyBilling/policyBilling_showHotProducts')),
          allResponsesProcessed, // 等待所有响应处理完成
          new Promise((_, reject) => setTimeout(() => reject(new Error('登录过程超时')), 10000))  // 设置超时10秒
        ]);

        if (!resolved) {
          logger.info('检测到页面跳转，登录成功');
          const cookies = await context.cookies();
          const cookieString = cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join(';');

          resolved = true;

          const state = await context.storageState();
          const frontAuthInfo = JSON.stringify(state);

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

}

module.exports = new NYLogin();
