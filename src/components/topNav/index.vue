<template>
  <div class="top-nav">
    <el-row>
      <el-col :span="4">
        <div class="logo-wrap" data-traceid="20-0">
          <div class="logo"></div>
          <div class="production-name">LaoCheng</div>
        </div>
      </el-col>
      <el-col :span="15">
        <el-row class="nav-list">
          <el-col
            :span="6"
            v-for="(nav, index) in navList"
            :key="index"
            :class="[
              'nav-item',
              {
                hover: index === activeIndex || $route.path == nav.url
              }
            ]"
            @click="jump(nav)"
            @mouseenter="menuChange(nav, index)"
            @mouseleave="hideSubmenu"
          >
            <!-- <el-popover placement="bottom" :width="200" trigger="hover">
              <template #reference> -->
            <p>
              {{ nav.name }}
              <laocheng-icon
                icon="laocheng-icon-xiala"
                size="12"
              ></laocheng-icon>
            </p>
            <!-- </template>
              </el-popover> -->
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="5">
        <div class="user-info" data-traceid="20-0">
          <div class="head-portrait"></div>
          <el-popover placement="bottom" :width="85" trigger="hover">
            <template #reference>
              <div class="user-name">小楼昨夜又东风</div>
              <el-icon><arrow-down /></el-icon>
            </template>
            <div class="user-block">
              <div class="item" @click="sysSetting">系统设置</div>
            </div>
          </el-popover>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'topNav',
  components: {},
  props: {},
  data() {
    return {
      activeIndex: 9999,
      navList: [
        {
          name: '首页',
          id: 1,
          url: '/'
        },
        {
          name: '视频动画',
          id: 2,
          url: '/subpage/template/video/editor?itemId=589462069387&mode=1'
        },
        {
          name: '编辑页',
          id: 3,
          url: '/subpage/template/watermark/watermarkEditor'
        },
        {
          name: '尾页',
          id: 4,
          url: '/endStory'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    jump(nav) {
      // console.log('路由跳转', nav)
      if ([2, 3].indexOf(nav.id) > -1) {
        this.$store.commit('setIsOperationPage', { isOperationPage: true })
        //编辑操作页 -- 需要单独新开一个完整页面
      } else {
        this.$store.commit('setIsOperationPage', { isOperationPage: false })
      }
      this.$router.push(nav.url)
      this.hideSubmenu()
    },
    menuChange(item, index) {
      this.activeIndex = index
      // this.activeMenus = item.items
      // this.activeModuleName = item.name
      // this.showSubmenu()
    },
    hideSubmenu() {
      this.activeIndex = 9999
    },
    // 系统设置
    sysSetting() {
      this.$store.commit('SET_IS_OPEN_SYSCONFIG', true)
    }
  }
}
</script>
<style lang="scss">
@import './styles.scss';
</style>
