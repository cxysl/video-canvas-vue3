/*
 * @Author: chengsl
 * @Date: 2022-01-06 09:29:40
 * @LastEditors: chengsl
 * @LastEditTime: 2022-01-25 15:34:50
 * @Description: file content
 */
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/home'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/subpage/template/video/editor',
    components: {
      subpage: () =>
        import(/* webpackChunkName: "videoEditor" */ '../pages/video/editor')
    },
    meta: {
      title: '视频编辑器'
    }
  },
  {
    path: '/subpage/template/watermark/watermarkEditor',
    components: {
      subpage: () =>
        import(
          // /* webpackChunkName: "watermarkEditor" */ '../pages/watermark/editor'
          /* webpackChunkName: "watermarkEditor" */ '../pages/watermark/edit'
        )
    },
    meta: {
      title: '水印编辑器'
    }
  },
  {
    path: '/endStory',
    name: 'endStory',
    component: () => import(/* webpackChunkName: "endStory" */ '../pages/story')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
