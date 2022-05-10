/*
 * @Author: chengsl
 * @Date: 2022-05-10 15:47:52
 * @LastEditors: chengsl
 * @LastEditTime: 2022-05-10 17:49:34
 * @Description: file content
 */
export default [
  {
    name: '练习场',
    path: '/learn',
    component: import('../pages/home'),
    children: [
      {
        name: '过渡 & 动画概述练习',
        path: '/learn/transition',
        component: import('../pages/home/views/transition')
      }
      // {
      //   name: '爱上对方过后就看了',
      //   path: '/learn/transition1',
      //   component: import('../pages/home/views/transition')
      // },
      // {
      //   name: '了空间和规范的撒',
      //   path: '/learn/transition2',
      //   component: import('../pages/home/views/transition')
      // }
    ]
  },
  {
    name: '视频动画',
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
    name: '编辑页',
    path: '/subpage/template/:feature(poster|watermark)/watermarkEditor',
    components: {
      subpage: () =>
        import(
          /* webpackChunkName: "watermarkEditor" */ '../pages/watermark/editor'
          // /* webpackChunkName: "watermarkEditor" */ '../pages/watermark/edit'
        )
    },
    meta: {
      title: '水印编辑器'
    }
  },
  {
    path: '/endStory',
    name: '尾页',
    component: () => import(/* webpackChunkName: "endStory" */ '../pages/story')
  }
]
