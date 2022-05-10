/*
 * @Author: chengsl
 * @Date: 2022-04-22 15:52:14
 * @LastEditors: chengsl
 * @LastEditTime: 2022-05-10 14:01:17
 * @Description: file content
 */

const getLocalSettingData = () => {
  let localSetting = {}
  try {
    const localSettingStr = localStorage.getItem('setting')
    localSetting = JSON.parse(localSettingStr)
  } catch (error) {
    console.error(error)
  }
  return localSetting
}

const saveLocalSettingData = (data) => {
  try {
    if (typeof data !== 'string') {
      data = JSON.stringify(data)
    }
    localStorage.setItem('setting', data)
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

const localSetting = getLocalSettingData()
// console.log(localSetting, 'localSetting')
const setting = localSetting || {
  themeColor: '#008BFF',
  fontSize: '14'
}
const state = {
  isOpenSysConfig: false,
  sideMenuList: [],
  ...setting
}

const mutations = {
  // 侧边栏菜单
  SET_SIDE_MENU_LIST(state, data) {
    state.sideMenuList = data
  },
  SET_THEME_COLOR(state, data) {
    state.themeColor = data
  },
  SET_FONT_SIZE(state, data) {
    state.fontSize = data
  },
  SET_IS_OPEN_SYSCONFIG(state, data) {
    state.isOpenSysConfig = data
  },
  SAVE_SETTING_DATA(state) {
    saveLocalSettingData(JSON.stringify(state))
  }
}

const actions = {
  // 设置是否打开系统设置组件
  setIsOpenSysConfig({ commit }, data) {
    commit('SET_IS_OPEN_SYSCONFIG', data)
  },
  // 保存个性化设置
  saveSettingData({ commit }) {
    commit('SAVE_SETTING_DATA')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
