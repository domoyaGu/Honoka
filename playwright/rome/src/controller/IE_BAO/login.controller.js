
const Jimp = require('jimp');
const loginController = require('../login.controller');

/**
 * IE保登录
 */
class IELogin {
  async login({ username, password }, page) {
    logger.info('IE美保开始登录')
    return new Promise(async (resolve, reject) => {
      // 获取用户信息（在token的payload中记录ID，username）
      // 浏览器
      const browser = await chromium.launch({headless: false});
      // 上下文
      const context = await browser.newContext();
      // 打开新页面
      const page = await context.newPage();

      await page.goto('https://pro.boweibx.com/#/login');
      await page.getByPlaceholder('请输入用户名').click();
      await page.getByPlaceholder('请输入用户名').fill(username);
      await page.getByPlaceholder('请输入密码').click();
      await page.getByPlaceholder('请输入密码').fill(password);
      await page.getByRole('button', { name: '登录' }).click();
      // 加载背景图和滑块图
      page.on('response',  (response) => {
        // 验证码接口
        if (response?.url() == 'https://pro.boweibx.com/code') {
          logger.info('调用验证码接口进行识别')
          response.json().then(async (res) => {
            let backImg = res.data.repData.originalImageBase64;
            let sliderImg = res.data.repData.jigsawImageBase64;
            await IELogin.getX(backImg, sliderImg).then(async (bestMatchX) => {
              logger.info('偏移量识别完成')
              // 执行拖动，x和y是相对于元素左上角的偏移量
              let box = await page.locator('.verify-move-block').boundingBox()
              await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
              await page.mouse.down();
              await page.mouse.move(box.x + box.width / 2 + bestMatchX + 9, box.y + box.height / 2)
              await page.mouse.up()
              logger.info('滑块完成')
            }).catch(() => {
              resolve({
                authInfo: null,
                status: -1,
                message: '验证码识别失败',
              })
            })
          })
        } else if(response?.url().indexOf('/auth/oauth/token') > -1) {
          logger.info('token获取接口拦截')
          response.json().then(async (res) => {
            // logger.info(res)
            // 报错的情况
            if (res.msg) {
              await page.close();
              await browser.close();
              resolve({
                authInfo: null,
                status: -1,
                message: res.msg,
              })
            } else if (res.access_token) {
              // 获取登录成功后的sessionStorage
              // const session_storage = await page.evaluate(() => JSON.stringify(sessionStorage))
              // logger.info('session_storage', session_storage)

              const accessToken = await page.evaluateHandle(() => {
                const newAuthInfo = sessionStorage.getItem('pigx-access_token')
                return Promise.resolve(newAuthInfo)
              })

              logger.info('浏览器已关闭')
              await page.close();
              await browser.close();
              resolve({
                authInfo: JSON.stringify({ authorization: `Bearer ${res.access_token}` }),
                frontAuthInfo: accessToken._preview,
                status: 200,
                message: '登录成功',
              })
            } else {
              await page.close();
              await browser.close();
              resolve({
                authInfo: null,
                status: -1,
                message: '未知错误',
              })
            }
          })
        }
      })
    })
  }

  /**
   * 识别背景图和滑块图返回要滑动的距离
   * @param {*} backImg base64格式的图片
   * @param {*} sliderImg base64格式的图片 
   * @returns 
   */
  static getX(backImg, sliderImg) {
    return new Promise(async (resolve, reject) => {
      Jimp.read(Buffer.from(backImg, 'base64')).then(async (backgroundImage) => {
        Jimp.read(Buffer.from(sliderImg, 'base64')).then(async (sliderImage) => {
          // 获取背景和滑块图片的宽度和高度
          const bgWidth = backgroundImage.bitmap.width;
          const bgHeight = backgroundImage.bitmap.height;
          const sliderHeight = sliderImage.bitmap.height
          let sliderWidth = sliderImage.bitmap.width;
          
          // 背景图灰度化、滑块图二值化
          backgroundImage = backgroundImage.greyscale()
          sliderImage = sliderImage.greyscale().invert()
          // 记录定位数组(截取滑块图只有滑块的部分并存储滑块边缘点位)
          let x_begin = 9999
          let x_end = 0
          let y_begin = 9999
          let y_end = 0
          let points = [] // 点位数组
          // 遍历截取
          for (let y = 0; y < sliderHeight; y++) {
            for (let x = 0; x < sliderWidth; x++) {
              const rgba = Jimp.intToRGBA(sliderImage.getPixelColor(x, y));
              // 二值化后，边缘点位的明显的白色rgb会变成（1,1,1）或（0,0,0）
              // 其余点位会变成灰色或者全255（应该是全255可能Jimp处理图片的二值化函数操作不同）
              // 取（1,1,1）或者（0,0,0）用 < 5判断即可
              if (rgba.r +rgba.g + rgba.b < 5) {
                x_begin = Math.min(x_begin, x)
                y_begin = Math.min(y_begin, y)
                x_end = Math.max(x_end, x)
                y_end = Math.max(y_end, y)
                points.push({ x: x, y: y })
              }
            }
          }
          // 避免边缘被截取调所以+1
          x_end += 1
          y_end += 1
          // 存储截取的滑块图
          sliderImage.crop(x_begin,y_begin,x_end-x_begin, y_end - y_begin).write('./tests/img/slider.png')
          // 更新滑块宽度方便遍历
          sliderWidth = x_end-x_begin
          // 遍历背景图片，寻找匹配滑块图片的位置
          let bestMatchX = 0; // 要滑动到的最佳x值
          let bestMatchScore = 0; // 匹配points边缘点位的分数
          // 遍历背景大图，只需要关心整个横轴，相当于窗口滑动（滑块图原图的y轴跟背景图一样所以不需要遍历y轴）
          for (let x = x_begin; x < bgWidth - sliderWidth; x++) {
            // 截取当前滑到的点为起始点的跟滑块图一样大的图，并二值化
            const cropSection = backgroundImage.clone().crop(x, y_begin, sliderWidth, y_end - y_begin).invert();
            // cropSection.write(`./tests/img/section${x}.png`)
            // 匹配次数初始化
            let matchPoint = 0
            // 遍历滑块的边缘点位进行匹配
            points.forEach((point) => {
              let rgba = Jimp.intToRGBA(cropSection.getPixelColor(point.x, point.y))
              // 只取对应点的黑色边缘部分进行匹配（1,1,1）或者（0,0,0），匹配到则+1
              if (rgba.r +rgba.g + rgba.b < 5) {
                matchPoint++
              }
            })
            // 匹配次数最多的记录下来
            if (matchPoint > bestMatchScore) {
              bestMatchScore = matchPoint
              bestMatchX = x
            }
          }
          // 移动滑块到最佳匹配位置
          // 这一步通常涉及到发送HTTP请求到目标验证服务
          console.log(`滑块应该被移动到X: ${bestMatchX}`);
          resolve(bestMatchX)
        })
        .catch(err => {
          console.error(err);
          reject(err)
        });
      });
    })
  }

  /**
   * 判断登录凭证是否过期
   */
  async isLogin(reqBody) {
    return new Promise(async (resolve, reject) => {
      // 浏览器
      const browser = await chromium.launch({headless: false});
      // 上下文
      const context = await browser.newContext();
      // 打开新页面
      const page = await context.newPage();
      // 认证信息
      const authInfo = reqBody.frontAuthInfo

      page.once('framenavigated', async data => {
        const listenUrl = await data.url()
        logger.info(listenUrl, 'listenUrl')
        // 导航到登录页面进行token的存储
        if (listenUrl.indexOf('pro.boweibx.com/#/login') !== -1) {
          await page.evaluateHandle((authInfo) => {
            sessionStorage.setItem('pigx-access_token', authInfo)
          }, authInfo)
        }
      })

      page.on('response', async (response) => {
        // 使用存储的token去请求接口后判断凭证是否过期
        if (response.url().indexOf('/admin/user/info') !== -1) {
          logger.info('IEBAOLOGIN_response', response.url())
          const resultMsg = await response.json()
          // logger.info('resultMsg', resultMsg)
          // code === 1 登录凭证已过期
          if (resultMsg.code === 1) {
            // 调用自动登录函数
            const loginRes = await new IELogin().login({ username: reqBody.platformAccount, password: reqBody.platformPassword })
            if (loginRes.status === 200) {
              if (await loginController.updateLoginInfo(loginRes, reqBody)) {
                // 登录成功
              await page.evaluateHandle((loginRes) => {
                sessionStorage.setItem('pigx-access_token', loginRes.frontAuthInfo)
              }, loginRes)
              // reload 为了更新所有session
              await page.reload()
                resolve({ browser, context, page })
              } else {
                await page.close();
                await browser.close();
                logger.info('浏览器已关闭')
                resolve(0)
              }
            } else {
              // 登录失败
              await page.close();
              await browser.close();
              logger.info('浏览器已关闭')
            }
          } else if (resultMsg.code === 0) {
            logger.info('resultMsg.code', resultMsg.code)
            // token有效的时候
            resolve({ browser, context, page })
          }
        }
        
      })
      
      // 首次进入登录页面
      await page.goto('https://pro.boweibx.com/#/login');
    })
  }
}

module.exports = new IELogin()
