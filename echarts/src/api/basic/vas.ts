import request from '@/utils/request';
// ————————————————————————————————————————————  基本设置 增值服务 ————————————————————————————————————————————————

/**
 * 契约锁 认证
 */
export function qiyuesuoCompanyAuth() {
  return request({
    url: '/thirdParty/qiyuesuo/companyAuth',
    method: 'get'
  });
}

/**
* 获取契约锁链接 授权1
*/
export function qiyuesuoPrivilegeAuth() {
  return request({
    url: '/thirdParty/qiyuesuo/privilegeAuth',
    method: 'get'
  });
}

/**
* 获取契约锁链接 授权2
*/
export function qiyuesuoAuth() {
  return request({
    url: '/thirdParty/qiyuesuo/sealSign/authUrl',
    method: 'get'
  });
}

/**
 *
 * 获取契约锁认证结果
 */
export function flushQiyuesuoAuth() {
  return request({
    url: '/thirdParty/qiyuesuo/companyStatus',
    method: 'get'
  });
}
