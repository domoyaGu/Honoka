
/**
 * 超能宝登录
 */
class QBAOLogin {
  async login({ username, password }) {
    logger.info('超能宝开始登录')
    return new Promise(async (resolve, reject) => {
      // 获取用户信息（在token的payload中记录ID，username）
      const browser = await chromium.launch();
      const page = await browser.newPage();
      await page.goto('https://www.qbao100.com/00100y02S/mobile/#/login');
      page.on('response',  (response) => {
        if(response?.url().indexOf('/backend/agent/1.0.0/login') > -1) {
          logger.info('token获取接口拦截')
          response.json().then(async (res) => {
            logger.info(res)
            page.close()
            browser.close()
            logger.info('浏览器已关闭')
            // 报错的情况
            if (res.response.tips) {
              resolve({
                auth: null,
                status: -1,
                message: res.response.tips,
              })
            } else if (res.response.sessionId) {
              resolve({
                auth: JSON.stringify({ 'Web-State': `sessionId=${res.response.sessionId}` }),
                status: 200,
                message: '登录成功',
              })
            } else {
              resolve({
                auth: null,
                status: -1,
                message: '未知错误',
              })
            }
          })
        }
      })
      await page.getByText('密码登录').click();
      await page.getByPlaceholder('请填写手机号').click();
      await page.getByPlaceholder('请填写手机号').fill(username);
      await page.getByPlaceholder('请填写密码').click();
      await page.getByPlaceholder('请填写密码').fill(password);
      await page.getByRole('button', { name: '登 录' }).click();
    })
  }
}

module.exports = new QBAOLogin()
