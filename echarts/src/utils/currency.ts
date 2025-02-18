// 货币处理工具类
import currency from 'currency.js'

// 单个数加上另一个数
export function currencyAdd(amount: number, addend: number) {
  return currencyToString(currency(amount).add(addend).format().replace('$', ''))
}

// 单个数加上另一个数
export function currencyAddString(amount: String, addend: String) {
  return currencyToString(currency(Number(amount)).add(Number(addend)).format().replace('$', ''))
}

// 减法
export function currencySubtract(amount: number, subend: number) {
  if (amount) {
    return currencyToString(currency(amount).subtract(subend).format().replace('$', ''))
  }
  return ''
}
// 减法(字符串支持)
export function currencySubtractString(amount: String, subend: String) {
  if (amount) {
    return currencyToString(currency(Number(amount)).subtract(Number(subend)).format().replace('$', ''))
  }
  return ''
}

// 除法
export function currencyDivide(amount: number, divend: number) {
  if (amount) {
    return currencyToString(currency(amount).divide(divend).format().replace('$', ''))
  }
  return ''
}

// 乘法
export function currencyMultiply(amount: number, mulend: number) {
  if (amount) {
    return currencyToString(currency(amount).multiply(mulend).format().replace('$', ''))
  }
  return ''
}

// 乘法
export function currencyMultiplyAllString(amounts: String[]) {
  if (amounts && amounts.length > 1) {
    let res = currencyMultiply(Number(amounts[0]), Number(amounts[1]))
    for (let i = 2; i < amounts.length; i++) {
      res = currencyMultiply(Number(res), Number(amounts[i]))
    }
    return res;
  }
  return '0'
}

// 数组中所有数字相加
export function currencyAddAll(amounts: number[]) {
  let res = new currency(0);
  amounts.forEach((value) => {
    res = res.add(value)
  })
  return currencyToString(res.format().replace('$', ''))
}

// 字符串类型转数字类型再相加
export function currencyAddAllString(amounts: String[]) {
  let res = new currency(0);
  amounts?.forEach((value) => {
    res = res.add(Number(value))
  })
  return currencyToString(res.format().replace('$', ''))
}

// 数字格式化
export function currencyFormat(amount: number) {
  return currencyToString(currency(amount).format().replace('$', ''))
}

// 转回Number类型
export function currencyToNumber(amount: string) {
  if (amount) {
    return Number(amount.replaceAll(',', ''))
  }
  return 0
}

// 转回Number类型
export function currencyToString(amount: string) {
  if (amount) {
    return amount.replaceAll(',', '')
  }
  return '0'
}

// 转回Number类型
export function currencyTypeToNumber(amount: currency) {
  if (amount) {
    return Number(amount.format().replace('$', '').replaceAll(',', ''))
  }
  return 0
}

