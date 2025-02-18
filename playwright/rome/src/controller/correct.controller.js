
/**
 * 批单统一入口
 */
class CorrectController {
  async correct(ctx, next) {
    try {
      const reqBody = ctx.request.body
      logger.info("request:", reqBody)
      // path需要单独定义，否则可能引入文件失败
      let path = `./${reqBody.platformCode}/correct.controller`
      let r = require(path)
      logger.info('file:', r)
      ctx.body = await r.correct(reqBody)
      logger.info("response:", ctx.body)
    } catch (err) {
      logger.error(err)
      ctx.body = err
    }
  }

  async downloadPolicy(ctx, next) {
    try {
      const reqBody = ctx.request.body
      logger.info("request:", reqBody)
      // path需要单独定义，否则可能引入文件失败
      let path = `./${reqBody.platformCode}/correct.controller`
      let r = require(path)
      logger.info('file:', r)
      ctx.body = await r.downloadPolicy(reqBody)
      logger.info("response:", ctx.body)
    } catch (err) {
      logger.error(err)
      ctx.body = err
    }
  }
  
}

module.exports = new CorrectController()