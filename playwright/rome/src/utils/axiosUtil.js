const axios = require('axios')
const log4js = require('./logUtil')
// 引入log4js配置，初始化全局对象
const logger = log4js.getLogger('default'); // 使用默认类别

const JAVA_URL = 'http://192.168.3.112:9050/api'

// 创建没有加载动画的axios实例
const service = axios.create({
  baseURL: JAVA_URL,
  timeout: 30000, // 超时时间
  headers: { 'Content-Type': 'application/json;charset=utf-8' }
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    if (!config.headers) {
      throw new Error(
        `Expected 'config' and 'config.headers' not to be undefined`
      );
    }
    return config;
  },
  error => {
    logger.info(error.response)
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { code, data, msg, message } = response.data;
    // logger.info(response.data)
    return response.data
    // if (code == 0) {
    // } else {
    //   // 响应数据为二进制流处理(Excel导出)
    //   if (response.data instanceof ArrayBuffer) {
    //     return response;
    //   }
    //   return Promise.reject()
    // }
  },
  (error) => { // status 2XX以外
    const { code, data, msg, message } = error.response.data;
    // logger.info(error.response)
    return Promise.reject(new Error(data || 'Error'))
  }
)

// ts封装request函数
const request = (config) => service.request(config)

// 导出 axios 实例
module.exports = request
