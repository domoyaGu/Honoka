/* 为减小体积 只引用des(包含md5 base64) 和 utf8 模块 */
import 'crypto-js/enc-utf8'
import 'crypto-js/tripledes'
import 'crypto-js/sha1'
import * as CryptoJS from 'crypto-js/core'

/**
 * @description: MD5加密
 * @param {string} message 需加密的字符串
 * @return {string} 加密后的字符串
 */
export function encryptByMD5 (message: string): string {
  return CryptoJS.MD5(message).toString()
}

/**
 * @description: Base64加密
 * @param {string} message 需加密的字符串
 * @return {string} 加密后的字符串
 */
export function encryptByBase64 (message: string): string {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(message))
}

/**
 * @description: Sha1加密
 * @param {string} message 需加密的字符串
 * @return {string} 加密后的字符串
 */
export function encryptBySha1 (message: string): string {
  return CryptoJS.SHA1(message).toString()
}


/**
 * @description: DES加密
 * @param {string} message 需加密的字符串
 * @param {string} key 加密密钥
 * @return {string} 加密过后的字符串
 */
export function encryptByDES (message: string, key: string): string {
  const keyHex = CryptoJS.enc.Utf8.parse(key)
  const ivHex = CryptoJS.enc.Utf8.parse(key)
  const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    iv: ivHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
}

/**
 * @description: DES解密
 * @param {string} cipherText 需解密的字符串
 * @param {string} key 密钥
 * @return {string} 解密后的字符串
 */
export function decryptByDES (cipherText: string, key: string): string {
  // cipherText为带解密字符串，key为密匙
  const keyHex = CryptoJS.enc.Utf8.parse(key)
  const ivHex = CryptoJS.enc.Utf8.parse(key)
  const decrypted = CryptoJS.DES.decrypt({
    ciphertext: CryptoJS.enc.Base64.parse(cipherText)
  }, keyHex, {
    iv: ivHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}

