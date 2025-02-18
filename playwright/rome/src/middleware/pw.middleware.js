
const { userFormateError } = require('../constant/error.type')

// 校验函数
// const verifyUser = async (ctx, next) => {
//   const { username } = ctx.request.body
//   try {
//     const res = await getUserInfo({username})
//     if (res) {
//       console.error('用户名已经存在', {username})
//       ctx.app.emit('error', userAlreadyExited, ctx)
//       return
//     }
//   } catch (error) {
//     console.error('获取用户信息错误', error)
//     ctx.app.emit('error', userRegisterError, ctx)
//     return
//   }
//   await next()
// }

module.exports = {
  // userValidator
}