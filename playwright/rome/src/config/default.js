const dotenv = require('dotenv')
dotenv.config() // 根目录读取.env文件，形成键值对存入process.env
// console.log(process.env, 'process.env')
module.exports = { APP_PORT } = process.env