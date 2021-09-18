export default {
  namespaced: true,
  state: {
    isPlay: false,
    stateIndex1: 0,
    nowState: {}
  },
  getters: {},
  mutations: {
    setNowState(state, payload) {
      let { nowState } = payload
      state.nowState = nowState
    },
    setStateIndex1(state, payload) {
      let { stateIndex1 } = payload
      state.stateIndex1 = stateIndex1
      state.isPlay = false
    },
    restVideoState(state) {
      state.stateIndex1 = 0
      state.nowState = {}
      state.isPlay = false
    },
    setIsPlay(state, payload) {
      let { isPlay } = payload
      state.isPlay = isPlay
    }
  }
}
