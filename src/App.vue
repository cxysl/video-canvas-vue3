<template>
  <div v-if="!showMain" class="page-loading">正在加载....</div>
  <div v-else-if="isOperationPage" class="page-subpage">
    <router-view name="subpage"></router-view>
    <!-- 个性化设置 -->
    <user-setting />
  </div>
  <div v-else class="page-all">
    <!-- <el-container>
      <el-header class="page-header">
        <top-nav></top-nav>
      </el-header>
      <el-container class="page-main">
        <el-aside width="200px" class="page-left-nav">Aside</el-aside>
        <el-main class="page-content">
          <router-view />
        </el-main>
      </el-container>
      <el-footer class="page-footer">————世林出品</el-footer>
    </el-container> -->

    <div v-if="!onlyShowMain" class="app-header">
      <top-nav></top-nav>
    </div>
    <div :class="['main', onlyShowMain ? 'only-main' : '']">
      <!-- <div width="200px" class="left-nav">左侧栏</div> -->
      <side-nav v-if="!onlyShowMain">左侧栏</side-nav>
      <div class="content">
        <div class="csl-watermark"></div>
        <router-view />
      </div>
    </div>
    <div v-if="!onlyShowMain" class="footer">————世林出品</div>
    <!-- 个性化设置 -->
    <user-setting />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import initAxios from './assets/js/axios'
import topNav from '@/components/topNav'
import sideNav from '@/components/sideNav'
import userSetting from '@/components/user-setting'
export default {
  name: 'App',
  components: {
    topNav,
    sideNav,
    userSetting
  },
  data() {
    return {
      showMain: false
    }
  },
  computed: {
    ...mapState(['isOperationPage', 'onlyShowMain'])
  },
  created() {
    window.axios = initAxios(this)
    // window.VM = this
    // eslint-disable-next-line no-unused-vars
    this.$router.beforeEach((to, from, next) => {
      // console.log(to, from, next)
      let pathArr = to.path.split('/')
      if (pathArr[1] == 'subpage') {
        //编辑操作页 -- 需要单独新开一个完整页面
        this.$nextTick(() => {
          this.$store.commit('setIsOperationPage', { isOperationPage: true })
        })
      } else {
        this.$nextTick(() => {
          this.$store.commit('setIsOperationPage', { isOperationPage: false })
        })
      }
      next()
    })
  },
  mounted() {
    setTimeout(() => {
      this.showMain = true
    }, 500)
  },
  methods: {}
}
</script>
<style lang="scss">
@import './assets/css/reset.css';
@import './assets/scss/app';
</style>
