const fs = require('fs');

/**
 * 下订单统一入口
 */
class OrderController {
  async order(ctx, next) {
    try {
      const reqBody = ctx.request.body
      // logger.info("order.controller.js-request:", reqBody)
      // 上传文件的目录如果不存在则创建
      if (!fs.existsSync('./src/images')) {
        fs.mkdir('./src/images', (err) => {
          if (err) {
            console.error(err);
          } else {
            logger.info('images文件夹创建成功');
          }
        });
      }
      // path需要单独定义，否则可能引入文件失败
      let path = `./${reqBody.platformCode}/products/${reqBody.productCode}`
      let r = require(path)
      // logger.info('file:', r)
      ctx.body = await r.order(reqBody)
      logger.info("response:", ctx.body)
    } catch (err) {
      logger.error(err)
      ctx.body = err
    }
  }
}

module.exports = new OrderController()