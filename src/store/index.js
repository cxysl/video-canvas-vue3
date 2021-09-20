import { createStore } from 'vuex'
import video from './modules/video'

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
  modules: { video }
})
