/* eslint-disable */
import { defineStore } from 'pinia';
import { LoginFormData } from '@/types/api/login';
import { UserState } from '@/types/store/user';
import { localStorage, sessionStorage } from '@/utils/storage';
import { login } from '@/api/login';
import { getUserInfo } from '@/api/login';
import { constantRoutes, resetRouter } from '@/router';
import useStore from '@/store';
import {getAreaTree, getAllEnum, getSelectOption, getCompanyIcon} from '@/api/common';
import { changePlace } from '@/utils/validate';
import {log} from "util";

// 'VEHICLE_TYPE_MERGE'
const selectCode = ['CAR_TYPE', 'DOCUMENT_TYPE', 'ENERGY_TYPE', 'FLEET_SIZE', 'OWNER_NATURE', 'USE_NATURE', 'VEHICLE_TYPE']

const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    token: localStorage.get('token') || '',
    userId: '',
    userInfo: {},
    allEnum: {},
    roles: [],
    perms: [],
    selectMap: {},
    area: []
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
    login(loginData: LoginFormData) {
      // const { userName, password } = loginData;
      return new Promise((resolve, reject) => {
        login(loginData)
          .then((response) => {
            const accessToken: string = response.data
            localStorage.set('token', accessToken);
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
            data.companyId && this.getIcon()
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    getIcon() {
      getCompanyIcon().then((response: any) => {
        if (response.code == 0 && Object.keys(response.data).length) {
          const { companyShowName, companyEnglishName, urlThumb } = response.data
          // @ts-ignore
          this.userInfo.companyShowName = companyShowName + '·理赔平台'
          // @ts-ignore
          this.userInfo.companyEnglishName = companyEnglishName
          // @ts-ignore
          this.userInfo.urlThumb = urlThumb
        }
      })
        .catch((err) => {
          console.log(err)
        })
    },

    // 获取枚举
    getAllEnum() {
      return new Promise((resolve, reject) => {
        getAllEnum().then((response: any) => {
          if (response.code == 0) {
            this.allEnum = {...response.data}
            // console.log(this.allEnum, '######allEnum')
            resolve(response.data);
          }
        })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 获取下拉选项
    getSelect() {
      return new Promise((resolve, reject) => {
        getSelectOption(selectCode).then((response: any) => {
          if (response.code == 0) {
            this.selectMap = response.data
            // console.log(this.selectMap, 'dict')
            resolve(response.data);
          }
        })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 获取省市区
    getAllMap() {
      return new Promise((resolve, reject) => {
        getAreaTree().then((response: any) => {
          // console.log(response, '###')
          if (response.code == 0) {
            const mapData = changePlace(response.data)
            sessionStorage.set('map', mapData);
            resolve(mapData);
          }
        })
          .catch((error) => {
            reject(error);
          });
      });
    },

    /**
     *  注销
     */
    // logout() {
    //   return new Promise((resolve, reject) => {
    //     logout()
    //       .then(() => {
    //         localStorage.remove('token');
    //         this.RESET_STATE();
    //         resetRouter();
    //         resolve(null);
    //       })
    //       .catch((error) => {
    //         reject(error);
    //       });
    //   });
    // },
    logout() {
      localStorage.remove('token');
      localStorage.clear()
      sessionStorage.clear()
      this.RESET_STATE();
      resetRouter();
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
