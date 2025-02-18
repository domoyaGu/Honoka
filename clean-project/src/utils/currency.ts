// 货币处理工具类
import currency from 'currency.js'

// 单个数加上另一个数
export function currencyAdd(amount: number, addend: number) {
  return currency(amount).add(addend).format().replace('$', '')
}

// 减法
export function currencySubtract(amount: number, subend: number) {
  if (amount) {
    return currency(amount).subtract(subend).format().replace('$', '')
  }
  return ''
}

// 除法
export function currencyDivide(amount: number, divend: number) {
  if (amount) {
    return currency(amount).divide(divend).format().replace('$', '')
  }
  return ''
}

// 乘法
export function currencyMultiply(amount: number, mulend: number) {
  if (amount) {
    return currency(amount).multiply(mulend).format().replace('$', '')
  }
  return ''
}

// 数组中所有数字相加
export function currencyAddAll(amounts: number[]) {
  let res = new currency(0);
  amounts.forEach((value) => {
    res = res.add(value)
  })
  return res.format().replace('$', '')
}

// 字符串类型转数字类型再相加
export function currencyAddAllString(amounts: String[]) {
  let res = new currency(0);
  amounts.forEach((value) => {
    res = res.add(Number(value))
  })
  return res.format().replace('$', '')
}

// 数字格式化
export function currencyFormat(amount: number) {
  return currency(amount).format().replace('$', '')
}

// 转回Number类型
export function currencyToNumber(amount: string) {
  if (amount) {
    return Number(amount.replaceAll(',', ''))
  }
  return 0
}

// 转回Number类型
export function currencyTypeToNumber(amount: currency) {
  if (amount) {
    return Number(amount.format().replace('$', '').replaceAll(',', ''))
  }
  return 0
}

