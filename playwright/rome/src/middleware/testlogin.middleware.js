const { login } = require('../controller/IE_BAO/login.controller')

const IE_BAOLogin = async (ctx, palywrightApi) => {
  const {context, page} = palywrightApi
  const reqBody = ctx.request.body
  const { username, password, Authorization } = reqBody
  // 监听页面跳转的url地址

  page.once('framenavigated', async data => {
    const listenUrl = await data.url()
    logger.info(listenUrl, 'listenUrl')
    if (listenUrl.indexOf('pro.boweibx.com/#/login') !== -1) {
      await page.evaluateHandle((Authorization) => {
        sessionStorage.setItem('pigx-access_token', JSON.stringify(Authorization))
      }, Authorization)
    }
    // // token无效后跳转为登录页面
    // if (loginButtonNum === 1) {
    //   // const loginRes = await login({ username, password }, page)
    //   // logger.info(loginRes, 'loginRes')
    //   // 登录成功
    //   if (loginRes.status == '200') {
    //     const loginResAuthorization= JSON.parse(loginRes.auth).authorization
    //     logger.info(loginResAuthorization, 'loginResAuthorization')
    //     if (loginResAuthorization) {
    //       // context.addCookies([
    //       //   {
    //       //     name: 'PHPSESSID',
    //       //     value: loginResCookie.substring(loginResCookie.indexOf('=')+1, loginResCookie.length),
    //       //     url: 'https://groupinsure.zhongbaounion.com'
    //       //   }
    //       // ])
    //     }
    //     // 调接口更新当前平台的信息
    //     // resolve(await loginController.updateLoginInfo(loginRes.auth, reqBody))
    //   } else {
    //     // 登录失败
    //     resolve(0)
    //   }
    //   // cookies有效直接进入表单页
    // } else {
    //   // 移除监听
    // }
  })
  
  await page.goto('https://pro.boweibx.com/#/login');
}

exports.testLogion = async (ctx, next) => {

  const reqBody = ctx.request.body

  // 启动浏览器
  const browser = await chromium.launch({ headless: false });
  // 上下文
  const context = await browser.newContext();
  // 打开新页面
  const page = await context.newPage();

  const palywrightApi = {
    context,
    page
  }

  switch(reqBody.platform) {
    case 'IE_BAO':
      IE_BAOLogin(ctx, palywrightApi)
    break
  }
}

