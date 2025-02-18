/* eslint-disable */
/**
 * 判断网页协议
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path: string) {
  return /^(https?:|http?:|mailto:|tel:)/.test(path);
}

/**
 * 返回正则校验规则
 * @return {String}
 * @param type
 */
export function regRule(type: string) {
    // 非负整数
  if (type === 'int') {
    return '^[1-9]\\d*|0$'
    // 数字 保留两位小数
  } else if (type === 'money') {
    return '^(([1-9]{1}\\d*)|(0{1}))(\\.\\d{1,2})?$'
    // 英文数字
  } else if (type === 'str') {
    return '^\\w+$'
    // 手机号
  } else if (type === 'phone') {
    return '^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[289])\\d{8}$'
    // 邮箱
  } else if (type === 'email') {
    return '^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$'
    // 身份证号码
  } else if (type === 'id') {
    return '^((\\d{18})|([0-9x]{18})|([0-9X]{18}))$'
    // 车牌号 包括新能源
  } else if (type === 'plate') {
    return '^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$'
    // 1到100整数
  } else if (type === 'max126') {
    return '^([1-9]?\d|100)$'
    // 座机号
  } else if (type === 'tel') {
    return '^[0][1-9]{2,3}-[0-9]{5,10}$'
    // IP
  } else if (type === 'ip') {
    return '/^((25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))\\.){3}(25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))$/g'
  }
}

/**
 * 字符串转数组
 */
export function StrToArray(str: string) {
  return isNotNull(str) ? str.split(',') : []
}

/**
 * 判断传入的值是否为空
 * @returns {boolean}
 * @param val
 */
export function isNotNull(val: any) {
  return !(val === null || val === '' || val === undefined)
}

/**
 * 数值为空（判断0）
 */
export function isNotNumberNull(val: any) {
  return !(val === null || val === '' || val === undefined || val == '0')
}

/** 将省市区对象转成带层级的数组
 * @returns [arr]
 * @param place
 */
export function changePlace(place) {
  let area = []
  place.forEach((item) => {
    let areaTemp = {
      value: item.areaCode,
      label: item.areaName,
      children: []
    }
    if (item.areaList && item.areaList.length > 0) {
      areaTemp.children = changePlace(item.areaList)
    }
    area.push(areaTemp)
  })
  return area
}

// export function getPlace(place) {
// }

// 平铺结构转树结构并排序
export function treeSortData(arr) {
  if (!Array.isArray(arr) || !arr.length) return
  const map = {}
  arr.forEach((item) => (map[item.menuId] = item))
  const roots = []
  arr.forEach((item) => {
    const parent = map[item.menuPid]
    if (parent) {
      (parent.children || (parent.children = [])).push(item)
    } else {
      roots.push(item)
    }
    if (parent && parent.children) {
      parent.children.sort((a,b)=>{ return a.menuSort - b.menuSort})
    }
  })
  roots.sort((a,b)=>{ return a.menuSort - b.menuSort})
  // console.log(roots, 'roots')
  return roots
}

// 获取当前日期（YYYY-mm-dd）格式
export function getNowDate() {
  let date = new Date(),
    seperator1 = '-', //格式分隔符
    year = date.getFullYear(), //获取完整的年份(4位)
    month: any = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
    strDate: any = date.getDate() // 获取当前日(1-31)
  if (month >= 1 && month <= 9) month = '0' + month // 如果月份是个位数，在前面补0
  if (strDate >= 0 && strDate <= 9) strDate = '0' + strDate // 如果日是个位数，在前面补0
  return year + seperator1 + month + seperator1 + strDate
}

/** 判断传入的值是否为空，空值返回- - -
 * @returns {string}
 * @param val
 */
export function isEmpty(val) {
  // @ts-ignore
  return val == null || val == '' || val == undefined || val == [] ? '- - -' : val
}

/** 判断传入的值是否为空，空值返回0 已引入公共filter
 * @returns {string}
 * @param val
 */
export function isNumber(val) {
  return val == null || val == '' || val == undefined ? 0 : val
}
