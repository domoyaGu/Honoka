
import { defineStore } from 'pinia';

const useParame = defineStore({
  id: 'parame',
  state: () => {
    return {
      detailsType: {},
      isRefresh: false
    }
  },
  actions: {
    setDetailsType (v) {
      let detail = {}
      const key = v.key.toString()
      detail[key] = v.value
      this.detailsType = detail
      // const keys = Object.keys(this.detailsType)
      // console.log(keys);
      // if(keys.includes(v.key)){
      //     console.log("obj对象中存在指key");
      //     this.detailsType[v.key] = v.value
      // }else{
      //     console.log("obj对象中不存在指key");
      // }
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
