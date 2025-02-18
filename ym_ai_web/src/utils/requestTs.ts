import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosInstance,
  AxiosError
} from 'axios';
import useStore from '@/store';
import { localStorage, sessionStorage } from '@/utils/storage';
import { ElMessage } from 'element-plus';
import { hideLoading } from './loading';
import { ENUMS } from '@/utils/enums';
// 创建没有加载动画的axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 30000, // 超时时间
  headers: { 'Content-Type': 'application/json;charset=utf-8' }
});

let isRefreshToken = false;

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
      config.headers['token'] = user.token;
    }
    // get请求编码
    // 如果url包括特殊字符的话，可能会导致接口接收参数失败
    let url = config.url;
    if (config.method === 'get' && config.params) {
      url += '?'; // 拼接参数
      // 获取所有参数，通过循环 拼接所有参数，encodeURIComponent对参数编码，
      Object.keys(config.params).map(key => {
        url += `${key}=${config.params[key]}&`;
      });
      url = URLencode(url.substring(0, url.length - 1)); // 删除最后一个&字符并处理特殊字符
      config.params = {}; // 参数已经存在于 url中
    }
    config.url = url;
    return config;
  },
  error => {
    hideLoading();
    return Promise.reject(error);
  }
);

// 编码（处理url中特殊字符）
function URLencode(url: string) {
  // 目前只处理时间格式中的"+"和大小引号
  return decodeURI(url)
    .replace(/\+/g, '%2B')
    .replace(/\"/g, '%22')
    .replace(/\'/g, '%27');
}

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { user } = useStore();
    const { code, data, msg, message } = response.data;
    if (code == 0) {
      return response.data;
    } else {
      // 响应数据为二进制流处理(Excel导出)
      if (response.data instanceof ArrayBuffer) {
        return response;
      }
      if (!isRefreshToken) {
        // code == 2时用data报错
        if (code == 2) {
          // 其他报错提示
          ElMessage({
            message: data || '系统出错',
            type: 'error'
          });
        } else if (
          Object.prototype.hasOwnProperty.call(
            ENUMS.responseErrorStatus,
            'data'
          )
        ) {
          isRefreshToken = true;
          ElMessage({
            message: ENUMS.responseErrorStatus[data],
            type: 'error'
          });
          user.logout();
          setTimeout(() => {
            isRefreshToken = false;
            window.location.href = '/login'; // 跳转登录页
          }, 2000);
        } else {
          // 其他报错提示
          ElMessage({
            message: msg || message || data || '系统出错',
            type: 'error'
          });
        }
      }
      return Promise.reject();
    }
  },
  (error: AxiosError) => {
    // status 2XX以外
    hideLoading();
    const { code, data } = error.response.data;
    // token失效，需要跳转登录页
    if (-10004 <= code && code <= -10001) {
      ElMessageBox.alert('当前页面已失效，请重新登录', '提示', {
        confirmButtonText: '确认',
        type: 'warning',
        callback: () => {
          sessionStorage.clear();
          localStorage.clear(); // 清除缓存
          window.location.href = '/login'; // 跳转登录页
        }
      });
    } else {
      // 接口报错
      ElMessage({
        message: data || '系统出错',
        type: 'error'
      });
    }
    return Promise.reject(new Error(data || 'Error'));
  }
);

// ts封装request函数
// const request: <T>(config?: AxiosRequestConfig) => Promise<T>  = config => service.request(config);

// 导出 axios 实例
export default <T>(config?: AxiosRequestConfig) => {
  return service.request(config) as Promise<T>;
};
