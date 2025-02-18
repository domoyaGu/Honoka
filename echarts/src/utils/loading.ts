import useStore from "@/store";

// 请求次数
let loadingCount = 0

// 显示loading
const showLoading = () => {
  if (loadingCount === 0) {
    const { business } = useStore();
    business.changeLoading(true)
  }
  loadingCount ++
}

// 隐藏loading
const hideLoading = () => {
  // 直接隐藏
  loadingCount = 0;
  const { business } = useStore();
  business.changeLoading(false)
  // if (loadingCount <= 0) return
  // loadingCount --
  // if (loadingCount === 0) {
  //   const { business } = useStore();
  //   business.changeLoading(false)
  // }
}

export { showLoading, hideLoading }
