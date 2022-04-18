/*
 * @Author: chengsl
 * @Date: 2022-01-06 09:29:40
 * @LastEditors: chengsl
 * @LastEditTime: 2022-01-25 14:25:03
 * @Description: file content
 */
import axios from 'axios'
const initAxios = (vm) => {
  setBbtapi(vm)
  //  全局配置axios
  axios.defaults.baseURL = vm.$store.state.bbtApi
  axios.defaults.withCredentials = true
  axios.defaults.crossDomain = true
  axios.defaults.timeout = 30000
  axios.defaults.headers = {
    'Content-Type': 'application/json;charset=UTF-8'
  }
  // axios.interceptors.response.use(
  //   res => {
  //     const status = res.data.status
  //     if (status === 1) {
  //       return res.data.data
  //     } else {
  //       if (res.data.msg) {
  //         // Message.warning(res.data.msg)
  //         vm.$message.warning(res.data.msg)
  //       }
  //       return Promise.reject(res)
  //     }
  //   },
  //   error => {
  //     return Promise.reject(error)
  //   }
  // )
}

function setBbtapi(vm) {
  let bbtApi = localStorage.getItem('bbtApi')
  if (bbtApi) {
    vm.$store.commit({
      type: 'setBbtApi',
      bbtApi: `//${bbtApi}/client/`
    })
  } else {
    let reg = new RegExp('(^|&)bbtApi=([^&]*)(&|$)', 'i')
    let r = window.location.search.substr(1).match(reg)
    if (r != null) {
      localStorage.setItem('bbtApi', unescape(r[2]))
      vm.$store.commit({
        type: 'setBbtApi',
        bbtApi: `//${unescape(r[2])}/client/`
      })
    }
  }
}
export default initAxios
