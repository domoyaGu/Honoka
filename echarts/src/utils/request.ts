import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import useStore from '@/store';
import { localStorage } from '@/utils/storage';
import { ElMessage } from 'element-plus';

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 30000, // 超时时间
  headers: { 'Content-Type': 'application/json;charset=utf-8' }
});

// 请求拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (!config.headers) {
      throw new Error(
        `Expected 'config' and 'config.headers' not to be undefined`
      );
    }
    const { user } = useStore();
    if (user.token) {
      config.headers['token'] = `${localStorage.get('token')}`;
    }
    // get请求编码
    // 如果url包括特殊字符的话，可能会导致接口接收参数失败
    let url = config.url
    if (config.method === 'get' && config.params) {
      url += '?' // 拼接参数
      // 获取所有参数，通过循环 拼接所有参数，encodeURIComponent对参数编码，
      Object.keys(config.params).map(key => {
          url += `${key}=${config.params[key]}&`
      })
      url = URLencode(url.substring(0, url.length - 1)) // 删除最后一个&字符并处理特殊字符
      config.params = {} // 参数已经存在于 url中
    }
    config.url = url
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 编码（处理url中特殊字符）
function URLencode(url:string) {
  // 目前只处理时间格式中的"+"和大小引号
  return decodeURI(url).replace(/\+/g, '%2B').replace(/\"/g,'%22').replace(/\'/g, '%27');  
}

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, msg } = response.data;
    if (code == 0) {
      return response.data;
    } else {
      // 响应数据为二进制流处理(Excel导出)
      if (response.data instanceof ArrayBuffer || response.status === 200) {
        return response;
      }
      // 报错提示
      ElMessage({
        message: msg || '系统出错',
        type: 'error'
      });
      return Promise.reject(new Error(msg || 'Error'));
    }
  },
  error => {
    const { code, msg } = error.response.data;
    // token失效，需要跳转登录页
    if (-10004 <= code && code <= -10001) {
      ElMessageBox.alert(
        '当前页面已失效，请重新登录',
        '提示',
        {
          confirmButtonText: '确认',
          type: 'warning',
          callback: () => {
            localStorage.clear(); // 清除缓存
            window.location.href = '/login'; // 跳转登录页
          }
        }
      )
    } else {
      // 接口报错
      ElMessage({
        message: msg || '系统出错',
        type: 'error'
      });
    }
    return Promise.reject(new Error(msg || 'Error'));
  }
);

// 导出 axios 实例
export default service;
