import { ElLoading } from 'element-plus';

// 请求次数
let loadingInstance = null;

// 显示loading
const showLoading = () => {
  loadingInstance = ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  });
};

// 隐藏loading
const hideLoading = () => {
  if (loadingInstance) loadingInstance.close();
};

export { showLoading, hideLoading };
