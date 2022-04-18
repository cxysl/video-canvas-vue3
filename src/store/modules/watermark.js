export default {
  namespaced: true,
  state: {
    isShowExitReplace: false,
    isTbActivityReplace: false,
    activityId: '',
    mode: 1,
    priceTag: {
      wmId: -1,
      priceTagType: 1, //1智能价签；2价签计算器
      discountArr: []
    },
    tbDiscount: {
      //1单件优惠价; 2多件凑单价; 3活动报名价
      discountType: 1
    }
  },
  mutations: {
    setActivityId(state, palyload) {
      state.activityId = palyload.activityId
      state.isShowExitReplace = !!palyload.activityId
      state.isTbActivityReplace = palyload.isTbActivityReplace || false
      state.mode = palyload.mode
    },
    setPriceTagType(state, palyload) {
      state.priceTag.priceTagType = palyload.priceTagType
    },
    setPriceTagDiscount(state, palyload) {
      state.priceTag.discountArr = palyload.discountArr
    },
    setPriceTagWmId(state, palyload) {
      state.priceTag.wmId = palyload.wmId
      window.sessionStorage.setItem(
        `vmPriceTag-${state.priceTag.wmId}`,
        JSON.stringify(state.priceTag)
      )
    }
  }
}
