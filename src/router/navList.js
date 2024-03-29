/*
 * @Author: chengsl
 * @Date: 2022-05-10 15:47:52
 * @LastEditors: chengsl
 * @LastEditTime: 2022-10-28 18:53:21
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
      },
      {
        name: '组合式api',
        path: '/learn/setup',
        component: import('../pages/home/views/setup')
      },
      {
        name: '工具',
        path: '/learn/tools',
        component: import('../pages/home/views/tools/index.vue')
      },
      {
        name: 'Cascader 级联选择器',
        path: '/learn/cascader',
        component: import('../pages/home/views/cascader/index.vue')
      }
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
          '../pages/watermark/editor'
          // '../pages/watermark/edit'
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
