/*
 * @Author: chengsl
 * @Date: 2022-09-26 16:37:51
 * @LastEditors: chengsl
 * @LastEditTime: 2022-09-26 17:16:43
 * @Description: file content
 */
/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
function debounce(func, wait, immediate) {
  let timeout

  return function () {
    // let context = this
    // let args = arguments

    if (timeout) clearTimeout(timeout)
    if (immediate) {
      var callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) {
        // func.apply(context, args)
        func()
      }
    } else {
      timeout = setTimeout(function () {
        // func.apply(context, args)
        func()
      }, wait)
    }
  }
}

/**
 * 节流函数
 */
function throttle(yourFun, dealy) {
  let timer = null
  return function () {
    // const that = this
    // const args = arguments
    if (!timer) {
      timer = setTimeout(() => {
        // yourFun.apply(that, args)
        yourFun()
        timer = null
      }, dealy)
    }
  }
}

export { debounce, throttle }
