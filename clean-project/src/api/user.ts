import requestNoLoading from '@/utils/requestNoLoading';

// ————————————————————————————————————————————  用户管理相关接口 ————————————————————————————————————————————————

/**
 * 获取列表
 */
export function getUserList(params) {
  return requestNoLoading({
    url: `/user/query`,
    method: 'get',
    params
  });
}

/**
 * 获取详情
 */
export function getDetail(params) {
  return requestNoLoading({
    url: "/user/queryUserInfo",
    method: 'get',
    params
  });
}

/**
 * 保存用户
 */
export function addUser(data) {
  return requestNoLoading({
    url: `/user/save`,
    method: 'post',
    data
  });
}

/**
 * 修改用户
 */
export function editUser(data) {
  return requestNoLoading({
    url: `/user/edit`,
    method: 'post',
    data
  });
}


/**
 * 积分操作
 */
export function pointOperate(data) {
  return requestNoLoading({
    url: '/user/pointOperate',
    method: 'post',
    data
  });
}

