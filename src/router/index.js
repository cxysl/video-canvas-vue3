/*
 * @Author: chengsl
 * @Date: 2022-01-06 09:29:40
 * @LastEditors: chengsl
 * @LastEditTime: 2022-10-14 13:12:09
 * @Description: file content
 */
import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'
import navList from './navList'

export var routes = []

function getRouterList(list) {
  list.forEach((item) => {
    if (item.children && item.children.length) {
      const tempItem = {
        path: item.path,
        name: item.name,
        component: item.component
      }
      routes.push(tempItem)
      getRouterList(item.children)
    } else {
      routes.push(item)
    }
  })
}
getRouterList(navList)

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  strict: false,
  // 切换页面，滚动到最顶部
  scrollBehavior: () => ({ left: 0, top: 0 })
})

/**
 * @description 路由拦截 beforeEach
 * */
router.beforeEach((to, from, next) => {
  console.log('router say:', to.path, '-', from.path, store)
  if (to.query.onlyShowMain === 'true' && store.state.onlyShowMain === false) {
    store.commit('setOnlyShowMain', true)
  } else if (
    store.state.onlyShowMain === true &&
    Object.prototype.hasOwnProperty.call(to.query, 'onlyShowMain')
  ) {
    store.commit('setOnlyShowMain', true)
  }
  next()
})

export default router
