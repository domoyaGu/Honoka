import { localStorage } from '@/utils/storage';
/**
 * 下载模板（文件流，直接打开新窗口下载）
 * @param url 下载链接
 * @param downloadName 下载文件命名
 */
export const downloadStream = (url, downloadName) => {
  getStream(url).then(res => {
    // 文件流转文件再打开新窗口下载
    const a = document.createElement('a');
    const href = window.URL.createObjectURL(
      new Blob([res], {
        type: 'application/msword;charset=utf-8'
      })
    );
    a.href = href;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(href);
  });
};

/**
 * 下载文件（文件流转blob）
 * @param url 下载链接
 * @returns blob格式
 */
export const getStream = url => {
  return new Promise((resolve, reject) => {
    const x = new XMLHttpRequest();
    x.open('GET', url, true);
    x.setRequestHeader('token', localStorage.get('token'));
    x.responseType = 'blob';
    x.onload = function (e) {
      // 文件流转文件再打开新窗口下载
      resolve(e.target.response);
    };
    x.send();
  });
};
