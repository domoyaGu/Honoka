const { APP_PORT } = require('./config/default')
const app = require('./app/index')
const log4js = require('./utils/logUtil')
// 引入log4js配置，初始化全局对象
const logger = log4js.getLogger('default'); // 使用默认类别
global.logger = logger
// 自动化对象
const { chromium } = require('playwright');
global.chromium = chromium
 
// 捕获未抓捕的异常，例如进程突然挂掉时的报错
process.on('uncaughtException', function (err) {
  logger.error(err.stack) // 保存错误的调用栈
});

app.listen(APP_PORT, () => {
  console.log(`服务已启动，端口号${APP_PORT}`)
})

