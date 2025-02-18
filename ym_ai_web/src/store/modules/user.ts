/* eslint-disable */
import { defineStore } from 'pinia';
import { CurrentResult, LoginFormData } from '@/types/api/login';
import { UserState } from '@/types/store/user';
import { localStorage, sessionStorage } from '@/utils/storage';
import { login, getCurrent } from '@/api/login';
import router from '@/router/index';
const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    token: sessionStorage.get('token') || localStorage.get('token') || '',
    userInfo: {
      userId: '2abe422f7632db8abf534e270448beaf',
      userName: '张三',
      userPhone: '15862463336',
      userEmail: 'guyunqi@yuanmousoft.com',
      isAdmin: '1',
      roleSensitive: '0'
    } as CurrentResult
  }),
  actions: {
    async RESET_STATE() {
      this.$reset(); // 重置state中的数据
    },
    /**
     * 登录
     * isSaveLocalStorage 记录登陆状态
     */
    login(loginData: LoginFormData, isSaveLocalStorage) {
      return new Promise<boolean>((resolve, reject) => {
        login(loginData)
          .then(response => {
            const accessToken: string = response.data; // 返回的token
            if (isSaveLocalStorage) {
              localStorage.set('token', accessToken);
            } else {
              sessionStorage.set('token', accessToken);
            }
            this.token = accessToken;
            resolve(true);
          })
          .catch(error => {
            console.log(`output->error`, error);
            reject();
          });
      });
    },
    /**
     * 获取用户信息
     */
    getUserInfo() {
      return new Promise((resolve, reject) => {
        getCurrent()
          .then(res => {
            this.userInfo = res.data;
            resolve(true);
            // localStorage.set('userInfo', res.data)
          })
          .catch(() => reject());
      });
    },
    /**
     *  注销
     */
    logout() {
      localStorage.clear();
      sessionStorage.clear();
      this.RESET_STATE();
    }
  }
});

export default useUserStore;
