const Router = require('koa-router')
const router = new Router({prefix: '/playwright'})
const { login, isLogin } = require('../controller/login.controller')
const { calcFee } = require('../controller/fee.controller')
const { order } = require('../controller/order.controller')
const { correct, downloadPolicy } = require('../controller/correct.controller')
const { pay, payFiles } = require('../controller/pay.controller')

// 登录
router.post('/login', login)
// 登陆凭证有效判断
router.post('/isLogin', isLogin)
// 费用计算
router.post('/calcFee', calcFee)
// 下单
router.post('/order', order)
// 批单
router.post('/correct', correct)
// 支付材料
router.post('/payFiles', payFiles)
// 支付
router.post('/pay', pay)
// 下载保单
router.post('/downloadPolicy', downloadPolicy)

module.exports = router
