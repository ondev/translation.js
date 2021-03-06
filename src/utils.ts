import { IAnyObject, ISuperAgentResponseError, ITranslateOptions, TStringOrTranslateOptions } from './interfaces'
import { ERROR_CODE } from './constant'

/**
 * 反转对象
 * @param {IAnyObject} obj
 * @return {IAnyObject}
 */
export function invert (obj: IAnyObject) {
  const result: IAnyObject = {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[obj[key]] = key
    }
  }
  return result
}

/**
 * 安全的获取一个变量上指定路径的值
 * @param obj
 * @param {string | string[]} pathArray
 * @param defaultValue
 * @return {any}
 */
export function getValue (obj: any, pathArray: string | string[], defaultValue?: any) {
  if (obj == null) return defaultValue

  if (typeof pathArray === 'string') {
    pathArray = [pathArray]
  }

  let value = obj

  for (let i = 0; i < pathArray.length; i += 1) {
    const key = pathArray[i]
    value = value[key]
    if (value == null) {
      return defaultValue
    }
  }

  return value
}

export class TranslatorError extends Error {
  readonly code: ERROR_CODE

  constructor (code: ERROR_CODE, message?: string) {
    super(message)
    this.code = code
  }
}

export function transformSuperAgentError (error: ISuperAgentResponseError) {
  if (error.timeout) {
    return new TranslatorError(ERROR_CODE.NETWORK_TIMEOUT, '查询超时')
  } else if (!error.status || !error.response) {
    return new TranslatorError(ERROR_CODE.NETWORK_ERROR, '没有网络连接')
  } else {
    return new TranslatorError(ERROR_CODE.API_SERVER_ERROR, '接口服务器出错了')
  }
}

export function transformOptions (options: TStringOrTranslateOptions) {
  if (typeof options === 'string') {
    return {
      text: options
    }
  }
  return options
}
