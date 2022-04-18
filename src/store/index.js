/*
 * @Author: chengsl
 * @Date: 2022-01-06 09:29:40
 * @LastEditors: chengsl
 * @LastEditTime: 2022-01-25 15:11:05
 * @Description: file content
 */
import { createStore } from 'vuex'
import video from './modules/video'
import watermark from './modules/watermark'
import poster from './modules/poster'

export default createStore({
  state: {
    isOperationPage: false,
    //  api地址
    bbtApi:
      window.location.href.indexOf('promote-daily') > -1
        ? '//promotion-cloud-rest-api-daily.baobeituan.com/client/'
        : '//promote-api-waf.baobeituan.com/client/'
  },
  mutations: {
    setIsOperationPage(state, payload) {
      let { isOperationPage } = payload
      state.isOperationPage = isOperationPage
    },
    setBbtApi(state, payload) {
      state.bbtApi = payload.bbtApi
    }
  },
  actions: {},
  modules: { video, watermark, poster }
})
