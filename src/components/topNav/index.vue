<template>
  <div class="top-nav">
    <el-row>
      <el-col :span="4">
        <div class="logo-wrap" data-traceid="20-0">
          <!-- <div class="logo"></div> -->
          <logo-icon></logo-icon>
          <div class="production-name">LaoCheng</div>
        </div>
      </el-col>
      <el-col :span="15">
        <el-row class="nav-list">
          <el-col
            v-for="(nav, index) in navList"
            :key="index"
            :span="6"
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
              <div class="user-name">
                小楼昨夜又东风
                <el-icon><arrow-down /></el-icon>
              </div>
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
// import logoIcon from '../logoIcon'
import { routes } from '../../router/index'
import navList from '../../router/navList'
export default {
  name: 'TopNav',
  // components: { logoIcon },
  props: {},
  data() {
    return {
      activeIndex: 9999,
      routeList: routes,
      navList: navList
    }
  },
  computed: {},
  watch: {
    $route() {
      this.updateSideMenuList()
    }
  },
  created() {},
  mounted() {
    this.updateSideMenuList()
  },
  methods: {
    // 更新左侧栏菜单
    updateSideMenuList() {
      var sideList = []
      this.navList.some((item) => {
        if (item.path.includes(this.$route.path.split('/')[1])) {
          sideList = item.children
          return true
        }
      })
      this.$store.commit('setting/SET_SIDE_MENU_LIST', sideList)
    },
    jump(nav) {
      // console.log('路由跳转', nav)
      if (nav.path.includes('subpage')) {
        this.$store.commit('setIsOperationPage', { isOperationPage: true })
        //编辑操作页 -- 需要单独新开一个完整页面
      } else {
        this.$store.commit('setIsOperationPage', { isOperationPage: false })
      }
      if (nav.name === '编辑页') {
        this.$router.push(
          '/subpage/template/watermark/watermarkEditor?type=1&id=671&modes=1,2,3&activityId=&isTbWm=false'
        )
      } else {
        this.$router.push(nav.path)
      }
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
      this.$store.commit('setting/SET_IS_OPEN_SYSCONFIG', true)
    }
  }
}
</script>
<style lang="scss">
@import './styles.scss';
</style>
