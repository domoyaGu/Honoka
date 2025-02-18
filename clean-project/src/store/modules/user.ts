/* eslint-disable */
import { defineStore } from 'pinia';
import { LoginFormData } from '@/types/api/login';
import { UserState } from '@/types/store/user';
import { localStorage, sessionStorage } from '@/utils/storage';
import { login } from '@/api/login';
import { getUserInfo } from '@/api/login';
import { UserInfo } from '@/types/common';

const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    token: sessionStorage.get('token') || (localStorage.get('token') || ''),
    userId: '',
    userInfo: {} as UserInfo,
    roles: [],
    perms: [],
  }),
  actions: {
    async RESET_STATE() {
      this.$reset();
    },
    // 设置按钮权限
    setPerms(perms: Array<any>) {
      this.perms = perms;
    },
    /**
     * 登录
     */
    login(loginData: LoginFormData, isSaveLocalStorage) {
      return new Promise((resolve, reject) => {
        login(loginData)
          .then((response) => {
            const accessToken: string = response.data
            if (isSaveLocalStorage) {
              localStorage.set('token', accessToken);
            } else {
              sessionStorage.set('token', accessToken);
            }
            this.token = accessToken;
            resolve(accessToken);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    /**
     *  获取用户信息（昵称、头像、角色集合、权限集合）
     */
    getUserInfo() {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then(({ data }) => {
            if (!data) {
              return reject('Verification failed, please Login again.');
            }
            const { userId } = data;
            this.roles = ['ADMIN'];
            this.userId = userId;
            this.userInfo = { ...data } as any;
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    /**
     *  注销
     */
    logout() {
      sessionStorage.remove('token')
      localStorage.remove('token');
      localStorage.clear()
      sessionStorage.clear()
      this.RESET_STATE();
      // resetRouter();
    },

    /**
     * 清除 Token
     */
    resetToken() {
      return new Promise((resolve) => {
        localStorage.remove('token');
        this.RESET_STATE();
        resolve(null);
      });
    },
  },
});

export default useUserStore;
