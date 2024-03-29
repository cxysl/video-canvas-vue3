/*
 * @Author: chengsl
 * @Date: 2022-01-06 09:29:40
 * @LastEditors: chengsl
 * @LastEditTime: 2022-10-14 13:13:59
 * @Description: file content
 */
import { createStore } from 'vuex'
import video from './modules/video'
import watermark from './modules/watermark'
import poster from './modules/poster'
import setting from './modules/setting'

// https://webpack.js.org/guides/dependency-management/#requirecontext
// 不需要单独引入每个vux模块,已自动导入
// const modulesFiles = require.context('./modules', true, /\.js$/)
// const modules = modulesFiles.keys().reduce((modules, modulePath) => {
//   const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
//   const value = modulesFiles(modulePath)
//   modules[moduleName] = value.default
//   return modules
// }, {})

export default createStore({
  state: {
    isOperationPage: false, // 编辑器页面
    onlyShowMain: false, // 只显示页面内容主体部分
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
    setOnlyShowMain(state, data) {
      state.onlyShowMain = data
    },
    setBbtApi(state, payload) {
      state.bbtApi = payload.bbtApi
    }
  },
  actions: {},
  modules: { video, watermark, poster, setting }
})
