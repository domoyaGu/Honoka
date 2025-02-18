const fs = require('fs');

/**
 * 下订单统一入口
 */
class PayController {
  async payFiles(ctx, next) {
    try {
      const reqBody = ctx.request.body
      logger.info("request:", reqBody)
      // 上传文件的目录如果不存在则创建
      if (!fs.existsSync('./src/payFiles')) {
        fs.mkdir('./src/payFiles', (err) => {
          if (err) {
            console.error(err);
          } else {
            logger.info('payFiles文件夹创建成功');
          }
        });
      }
      // path需要单独定义，否则可能引入文件失败
      let path = `./${reqBody.platformCode}/pay.controller`
      let r = require(path)
      logger.info('file:', r)
      ctx.body = await r.payFiles(reqBody)
      logger.info("response:", ctx.body)
    } catch (err) {
      logger.error(err)
      ctx.body = err
    }
  }
  
  /**
   * 获取支付链接
   * @param {*} ctx 
   * @param {*} next 
   */
  async pay(ctx, next) {
    try {
      const reqBody = ctx.request.body
      logger.info("request:", reqBody)
      // path需要单独定义，否则可能引入文件失败
      let path = `./${reqBody.platformCode}/pay.controller`
      let r = require(path)
      logger.info('file:', r)
      ctx.body = await r.pay(reqBody)
      logger.info("response:", ctx.body)
    } catch (err) {
      logger.error(err)
      ctx.body = err
    }
  }
}

module.exports = new PayController()