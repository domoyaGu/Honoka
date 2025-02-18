const axios = require('../utils/axiosUtil')

/**
 * 登录统一入口
 */
class LoginController {
  async login(ctx, next) {
    try{
      const reqBody = ctx.request.body
      logger.info("request:", reqBody)
      // path需要单独定义，否则可能引入文件失败
      let path = `./${reqBody.platform}/login.controller`
      let r = require(path)
      logger.info('file:', r)
      ctx.body = await r.login(reqBody)
      logger.info("response:", ctx.body)
    } catch (err) {
      logger.error(err)
      ctx.body = err
    }
  }

  async isLogin(ctx, next) {
    try {
      const reqBody = ctx.request.body;
      logger.info("request:", reqBody);
      let path = `./${reqBody.platformCode}/login.controller`;
      let r = require(path);
      logger.info('file:', r);
      ctx.body = await r.isLogin(reqBody);
      logger.info("response:", ctx.body);
    } catch (err) {
      logger.error(err);
      ctx.body = err;
    }
  }


  async updateLoginInfo({authInfo, frontAuthInfo}, {platformCode, insuranceId} ) {
    return new Promise((resolve, reject) => {
      const data = {
        authInfo,
        platformCode,
        insuranceId,
        frontAuthInfo
      }
      logger.info('updateLoginInfo', platformCode, data)
      axios({
        url: `/product/platform/updateAuthInfo`,
        method: 'post',
        data
      }).then(async (res) => {
        logger.info('更新java后台认证成功', res)
        resolve(1)
      }).catch(err => {
        logger.info('更新java后台认证失败')
        logger.info(err)
        resolve(err)
      })
    })
  }
}

module.exports = new LoginController()
