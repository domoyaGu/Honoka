/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time: number, label: string) {
  if (time === 1) {
    return time + label;
  }
  return time + label + 's';
}

/**
 * @param {number} time
 */
export function timeAgo(time: number) {
  const between = Date.now() / 1000 - Number(time);
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute');
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour');
  } else {
    return pluralize(~~(between / 86400), ' day');
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num: number, digits: number) {
  const si = [
    { value: 1e18, symbol: 'E' },
    { value: 1e15, symbol: 'P' },
    { value: 1e12, symbol: 'T' },
    { value: 1e9, symbol: 'G' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'k' }
  ];
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (
        (num / si[i].value)
          .toFixed(digits)
          .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
      );
    }
  }
  return num.toString();
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num: number) {
  return (+num || 0)
    .toString()
    .replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','));
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * 金额转换（分->元）
 * 100 => 1
 * @param {number} num
 */
export function moneyFormatter(num: number) {
  return '¥' + (isNaN(num) ? 0.0 : parseFloat((num / 100).toFixed(2)));
}

/**
 * 格式化金额
 * @param val 
 * @param isNegative 
 * @returns 
 */
export function currencyFormat(val, isNegative: boolean) {
  /**只能输入数字且有小数点最多保留两位*/
  let checkPlan = ('' + val)
  // 如果支持负数
  if (isNegative) {
    checkPlan = checkPlan.replace(/[^\d.-]/g, '') // 清除“数字”和“.”和“-”以外的字符
  } else {
    checkPlan = checkPlan.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
  }
  checkPlan = checkPlan
    .replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
    .replace(/^\./g, '') // 保证第一个为数字而不是.
    .replace('.', '$#$')
    .replace(/\./g, '')
    .replace('$#$', '.')
  if (checkPlan.indexOf('.') < 0 && checkPlan !== '') {
    // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
    checkPlan = parseFloat(checkPlan) + ''
  } else if (checkPlan.indexOf('.') >= 0) {
    checkPlan = checkPlan
      .replace(/^()*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
  }
  return checkPlan.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

