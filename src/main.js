import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import laochengIcon from '../src/components/laochengIcon'
import lazyPlugin from 'vue3-lazy'

const app = createApp(App)
app
  .use(store)
  .use(router)
  .use(ElementPlus)
  .use(lazyPlugin, {
    loading: require('@/assets/images/holder.png'), // 图片加载时默认图片
    error: require('@/assets/images/holder.png') // 图片加载失败时默认图片
  })
  .mount('#app')

app.component('laocheng-icon', laochengIcon)
