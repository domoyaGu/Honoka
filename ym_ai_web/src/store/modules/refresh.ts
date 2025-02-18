
import { defineStore } from 'pinia';

const useRefreshStore = defineStore({
  id: 'refresh',
  state: () => {
    return {
      isRefresh: false
    }
  },
  actions: {
    clear() {
      this.isRefresh = false
    },
    refresh () {
      this.isRefresh = true
    }
  },
  persist: {
    enabled: true// 这个配置代表存储生效，而且是整个store都存储
  }
})

export default useRefreshStore;
