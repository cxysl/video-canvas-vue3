/*
 * @Author: chengsl
 * @Date: 2022-01-06 09:29:40
 * @LastEditors: chengsl
 * @LastEditTime: 2022-05-10 17:49:30
 * @Description: file content
 */
import { createRouter, createWebHistory } from 'vue-router'
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
console.log('routes222', routes)

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
