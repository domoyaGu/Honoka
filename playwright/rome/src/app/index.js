const Koa = require('koa')
// const cors = require('cors');
const parameter = require('koa-parameter')
const errorHandler = require('./errorHandler')
const router = require('../router')
const { koaBody } = require('koa-body') // 解析请求参数 文件上传等 在所有请求之前注册中间件
const app = new Koa()
const path = require('path')
app.use(parameter(app))
    .use(koaBody({
      multipart: true, // 允许上传文件
      formidable: {
        // 储存文件地址, 在配置选项options中不推荐使用相对路径
        // options 里面的相对路径在KOaBody内处理，相对process.cwd（脚本执行的目录）的相对路径
        uploadDir: path.resolve(__dirname, '../upload'), 
        keepExtensions: true, // 是否保留扩展名 
        
      },
      parsedMethods: ['POST', 'GET', 'PUT', 'DELETE', 'PATCH']
    }))
    // .use(cors())
    .use(router.routes())
    .use(router.allowedMethods()) // 前端请求方法与接口定义方法不一致时报错
// 统一的错误处理
app.on('error', errorHandler)
module.exports = app