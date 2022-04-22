/*
 * @Author: chengsl
 * @Date: 2022-04-18 08:55:03
 * @LastEditors: chengsl
 * @LastEditTime: 2022-04-22 17:55:48
 * @Description: main.js
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import lazyPlugin from 'vue3-lazy'
import * as ElIconModules from '@element-plus/icons-vue'

// 复制 element-plus 的样式文件到本地 并引入
// node_modules\element-plus\theme-chalk\index.css
import './assets/css/element-plus/theme-chalk.css'
// node_modules\element-plus\dist\index.css
import './assets/css/element-plus/dist-index.css'

const app = createApp(App)
const vm = app
  .use(store)
  .use(router)
  .use(ElementPlus)
  .use(lazyPlugin, {
    loading: require('@/assets/images/holder.png'), // 图片加载时默认图片
    error: require('@/assets/images/holder.png') // 图片加载失败时默认图片
  })
  .mount('#app')

// 40-TODO message 还没处理
// const prpoElementArr = ['Message', 'MessageBox', 'Notification', 'Loading']
// if (prpoElementArr.includes(key)) {
//   vm[`$${key.toLocaleLowerCase()}`] = ElIconModules[key]
//   console.log(key, ': ', ElIconModules[key])
// }

/** *************** 引入 element-plus 的图标 *******************/
Object.keys(ElIconModules).forEach(function (key) {
  app.component(ElIconModules[key].name, ElIconModules[key])
})

/** *************** 全局组件 *******************/
const components = require.context('@/components', true, /\.vue$/)
components.keys().forEach((componentPath) => {
  const componentEntity = components(componentPath).default
  if (componentEntity.name) {
    app.component(componentEntity.name, componentEntity)
  }
})

/** *************** 全局指令 *******************/
const directives = require.context('@/directives', true, /\.js$/) // 批量注册全局指令
directives.keys().forEach((directivePath) => {
  const directiveEntity = directives(directivePath).default
  if (directiveEntity.name) {
    app.directive(directiveEntity.name, directiveEntity)
  }
})

/** ***** 添加原型属性 dayjs 指向 app *****/
import dayjs from 'dayjs'
vm.$dayjs = dayjs

import { updateThemeColor } from '@/utils/updateThemeColor'
vm.$updateThemeColor = updateThemeColor
window.VM = vm
// window.VMApp = app
// console.log('aaaa', this)
// console.log('bbbb', this.$store.state)
