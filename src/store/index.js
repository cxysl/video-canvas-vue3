import { createStore } from 'vuex'
import video from './modules/video'

export default createStore({
  state: {
    isOperationPage: false
  },
  mutations: {
    setIsOperationPage(state, payload) {
      let { isOperationPage } = payload
      state.isOperationPage = isOperationPage
    }
  },
  actions: {},
  modules: { video }
})
