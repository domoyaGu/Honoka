import { defineStore } from 'pinia';
import { BusinessState } from '@/types/store/business';
import { ElLoading } from 'element-plus'

const loadingInstance: any = ref('')
const openLoading = () => {
  loadingInstance.value = ElLoading.service({
    lock: true,
    text: '正在加载',
    background: 'hsla(0,0%,100%,.3)'
  })
}
const closeLoading = () => {
  loadingInstance.value.close()
}

export const useBusinessStore = defineStore({
  id: 'business',

  state: (): BusinessState => ({
    loading: false,
    qiyuesuoLink: '',
  }),
  actions: {
    // 开启或关闭动画
    changeLoading(loading: boolean) {
      this.loading = loading
      loading ? openLoading() : closeLoading()
    },
    // 设置契约锁跳转链接
    setQiyuesuoLink(link: string) {
      this.qiyuesuoLink = link;
    },
},
  persist: {
    enabled: true , // 持久化存储
  }
});

export default useBusinessStore;
