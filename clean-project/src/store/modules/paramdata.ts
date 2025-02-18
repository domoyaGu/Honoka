
import { defineStore } from 'pinia';

const useParame = defineStore({
  id: 'paramdata',
  state: () => {
    return {
      params: {},
      isRefresh: false
    }
  },
  actions: {
    setParams (v) {
      this.params = v
    },
    clear() {
      this.isRefresh = false
    },
    refresh () {
      this.isRefresh = true
    }
  },
  persist: {
    enabled: true , // 这个配置代表存储生效，而且是整个store都存储
    strategies: [{ storage: sessionStorage, paths: ['detailsType'] }],
  }
})

export default useParame;
