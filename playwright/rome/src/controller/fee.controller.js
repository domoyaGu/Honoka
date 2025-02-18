
/**
 * 费用计算统一入口
 */
class FeeController {
  async calcFee(ctx, next) {
    try {
      const reqBody = ctx.request.body
      logger.info("request:", reqBody)
      // path需要单独定义，否则可能引入文件失败
      let path = `./${reqBody.platformCode}/products/${reqBody.productCode}`
      let r = require(path)
      logger.info('file:', r)
      ctx.body = await r.calcFee(reqBody)
      logger.info("response:", ctx.body)
    } catch (err) {
      logger.error(err)
      ctx.body = err
    }
  }
}

module.exports = new FeeController()