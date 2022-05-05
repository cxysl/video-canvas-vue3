/*
 * @Author: chengsl
 * @Date: 2022-04-18 08:55:03
 * @LastEditors: chengsl
 * @LastEditTime: 2022-05-04 16:53:06
 * @Description: main.js
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import lazyPlugin from 'vue3-lazy'
import * as ElIconModules from '@element-plus/icons-vue'
import VueClipboards from 'vue-clipboards'
import './assets/js/bbt-icon'

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
  .use(VueClipboards)
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
const iconNameList = []
Object.keys(ElIconModules).forEach(function (key) {
  iconNameList.push(ElIconModules[key].name)
  app.component(ElIconModules[key].name, ElIconModules[key])
})
console.log('直接可用的图标有：', iconNameList)

/** *************** 全局组件 *******************/
const componentNameList = []
const components = require.context('@/components', true, /index\.vue$/)
components.keys().forEach((componentPath) => {
  const componentEntity = components(componentPath).default
  if (componentEntity.name) {
    componentNameList.push(componentEntity.name)
    app.component(componentEntity.name, componentEntity)
  }
})
console.log('直接可用的组件有：', componentNameList)

/** *************** 全局指令 *******************/
const directives = require.context('@/directives', true, /\.js$/) // 批量注册全局指令
directives.keys().forEach((directivePath) => {
  const directiveEntity = directives(directivePath).default
  if (directiveEntity.name) {
    app.directive(directiveEntity.name, directiveEntity)
  }
})

// app.config.globalProperties.$yourObj =
// const { appContext } = getCurrentInstance()
// const globalProxy = appContext.config.globalProperties;
// globalProxy.$yourObj
/** ***** 添加原型属性 dayjs 指向 app *****/
import dayjs from 'dayjs'
vm.$dayjs = dayjs

import { updateThemeColor } from '@/utils/updateThemeColor'
vm.$updateThemeColor = updateThemeColor

/**
 * 添加原型属性 $getDialogHeight 计算弹框高度
 * @param {*} fatherClassName 父容器的样式class名
 * @param {*} loseHeight 额外减去的高度
 * @param {*} dontAddOverflowY 不自动加滚动条
 */
vm.$getDialogHeight = function (fatherClassName, loseHeight, dontAddOverflowY) {
  const className = fatherClassName
    ? fatherClassName.includes('.')
      ? fatherClassName
      : '.' + fatherClassName
    : '.el-dialog'
  const dialogBody = document.querySelector(`${className} .el-dialog__body`)
  const headerHeight = document.querySelector(
    `${className} .el-dialog__header`
  ).offsetHeight
  if (!dontAddOverflowY) {
    dialogBody.style.overflowY = 'auto'
  }
  dialogBody.style.maxHeight =
    (document.body.clientHeight - headerHeight - loseHeight || 150) + 'px'
  console.log(
    '计算dialogBody高度, className:',
    className,
    ', body:',
    document.body.clientHeight,
    '-headerHeight:',
    headerHeight,
    '-',
    headerHeight + loseHeight || 120,
    '=',
    document.body.clientHeight - headerHeight - loseHeight || 50
  )
}
window.VM = vm
// window.VMApp = app
// console.log('aaaa', this)
// console.log('bbbb', this.$store.state)
