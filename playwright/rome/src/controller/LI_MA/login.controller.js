
const axios = require('../../utils/axiosUtil');
const loginController = require('../login.controller');

/**
 * 力码登录
 */
class LimaLogin {

  async login(userInfo) {
    const { username, password } = userInfo
    logger.info('力码平台开始登录')
    return new Promise(async (resolve, reject) => {
      let vcMessage = '' // 验证码错误时返回
      let invokeCounts = 0
      // 获取用户信息（在token的payload中记录ID，username）
      const browser = await chromium.launch();
      const context = await browser.newContext();
      // 修改头信息
      context.route('/broker/index/lAct_v2', (route, request) => {
        logger.info(request.headers())
        const headers = {
          ...request.headers(),
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0',
        };
        delete headers['sec-ch-ua']
        route.continue({ headers })
      })
      const page = await context.newPage();
      page.on('dialog', async dialog => {
        logger.info(dialog.message())
        vcMessage = dialog.message()
        if (dialog.message().includes('登录失败') || dialog.message().includes('帐号密码不匹配')) {
          await page.close()
          await browser.close()
          logger.info('浏览器已关闭')
          resolve({
            auth: null,
            status: -1,
            message: dialog.message(),
          })
        }
        await dialog.accept().then(res => {
        });
      });
      page.on('response', async (response) => {
        if (response.url().indexOf('groupinsure.zhongbaounion.com/broker/index/verify') !== -1) {
          logger.info('验证码识别：', invokeCounts)
          invokeCounts++
          if (invokeCounts > 3) {
            await page.close()
            await browser.close()
            logger.info('浏览器已关闭')
            resolve({
              auth: null,
              status: -1,
              message: vcMessage,
            })
          } else {
            let res = await response.body();
            LimaLogin.getVC(res).then(async res => {
              logger.info('验证码识别成功')
              const vc = res
              // 填信息
              await page.fill('#verify', vc)
              await page.fill('#account', username)
              await page.fill('#pwd', password)
              await page.locator('#loginButton').click()
            }).catch(async err => {
              await page.close()
              await browser.close()
              logger.info('浏览器已关闭')
              resolve({
                auth: null,
                status: -1,
                message: '未知错误',
                error: err
              })
            })
          }
        } else if (response.url().indexOf('groupinsure.zhongbaounion.com/broker/index/lAct_v2') !== -1) {
          logger.info('登录接口调用')
          if (response.json) {
            const res = await response.json() // 获取登录接口返回的信息
            if (res && res.status == '1004') {
              await page.close()
              await browser.close()
              logger.info('浏览器已关闭')
              if (invokeCounts === 3) {
                // 拦截到了登录接口但没拿到cookie
                // 识别超过3次不正确的情况不再识别
                resolve({
                  auth: null,
                  status: 1004,
                  message: '验证码识别失败'
                })
              } else {
                resolve({
                  auth: null,
                  status: 1004,
                  message: '验证码识别失败',
                  error: { ...res }
                })
              }
            }
          }
        } else if (response.url().indexOf('groupinsure.zhongbaounion.com/broker/notice/getNewestPublicNoticeAct') !== -1) {
          logger.info('跳转首页成功')
          const resReqCookies = await page.context().cookies([response.url()]) // 获取登录接口request中的cookie
          logger.info(resReqCookies)
          await page.close()
          await browser.close()
          logger.info('浏览器已关闭')
          resolve({
            auth: JSON.stringify({Cookie:`PHPSESSID=${resReqCookies[0].value}`}),
            status: 200,
            message: '登录成功'
          })
        }
      })
      await page.goto('https://groupinsure.zhongbaounion.com/broker/salesmanindex/index');
    })
  }

  /**
   * 获取验证码
   * @param {*} vcBuffer 
   * @returns 
   */
  static async getVC(vcBuffer) {
    // console.log(vcBuffer)
    return new Promise(async (resolve, reject) => {
      const params = new URLSearchParams();
      params.append('imgBase64', vcBuffer.toString('base64'));
      await axios({
        url: `/user/dict/generalUrlBase64`, 
        method: 'get',
        params,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type':	'application/x-www-form-urlencoded',
          'Accept-Language':	'zh-cn',
        }
      }).then(async (res) => {
        let vc = /\d+/g.exec(res.data.generalCode.toString())
        // console.log(vc[0])
        resolve(vc[0])
      }).catch(err => {
        logger.info(err)
        reject(err)
      })
    })
  }

  /**
   * 判断登录凭证是否过期
   */
  async isLogin(reqBody) {
    return new Promise(async (resolve, reject) => {
      // 浏览器
      const browser = await chromium.launch({ headless: false });
      // 上下文
      const context = await browser.newContext();
      // 打开新页面
      const page = await context.newPage();
      // 认证信息
      const authInfo = reqBody.authInfo
      if (authInfo.Cookie) {
        logger.info('Cookie:', authInfo.Cookie.substring(authInfo.Cookie.indexOf('=')+1, authInfo.Cookie.length))
        context.addCookies([
          {
            name: 'PHPSESSID',
            value: authInfo.Cookie.substring(authInfo.Cookie.indexOf('=')+1, authInfo.Cookie.length), 
            // 'hut2kvvn093sf13ds6qf7768hb'
            url: 'https://groupinsure.zhongbaounion.com'
          }
        ])
      }
      //------------------------------------------------cookies登录------------------------------------------------------------
      // 监听页面跳转的url地址
      page.once('framenavigated', async data => {
        const listenUrl = await data.url()
        // cookies无效后跳转为登录页面
        if (listenUrl.indexOf('/broker/salesmanlogin') !== -1) {
          const loginRes = await new LimaLogin().login({ username: reqBody.platformAccount, password: reqBody.platformPassword })
          // logger.info(JSON.parse(loginRes.auth), 'loginRes.auth.Cookie')
          // 登录成功
          if (loginRes.status == '200') {
            const loginResCookie = JSON.parse(loginRes.auth).Cookie
            logger.info('loginResCookie', loginResCookie)
            if (loginResCookie) {
              context.addCookies([
                {
                  name: 'PHPSESSID',
                  value: loginResCookie.substring(loginResCookie.indexOf('=')+1, loginResCookie.length),
                  url: 'https://groupinsure.zhongbaounion.com'
                }
              ])
            }
            // 调接口更新当前平台的信息
            if (await loginController.updateLoginInfo({ authInfo: loginRes.auth }, reqBody)) {
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
            resolve(0)
          }
          logger.info(loginRes, 'loginRes')
          // cookies有效直接进入表单页
        } else if (listenUrl.indexOf('/broker/salesmanindex/index') !== -1) {
          logger.info('/broker/salesmanindex/index')
          // 移除监听
          resolve({ browser, context, page })
        }
      })
      await page.goto('https://groupinsure.zhongbaounion.com/broker/salesmanindex/index');
    })
  }
}

module.exports = new LimaLogin()
