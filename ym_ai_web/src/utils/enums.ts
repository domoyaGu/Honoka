// 状态码
const responseErrorStatus = {
  '-20000': 'TOKEN不存在',
  '-20001': 'TOKEN无效',
  '-20002': '异地登录,强制下线',
  '-20004': 'TOKEN超时'
  // '-20005': '无权限请求当前接口',
};

// 以图搜图状态
const pictureStatus = {
  执行中: { color: '#2560D2' },
  失败: { color: '#D9001B' },
  成功: { color: '#67c23a' }
};

export const ENUMS = {
  responseErrorStatus,
  pictureStatus
};
