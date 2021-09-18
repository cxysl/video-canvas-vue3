<template>
  <div class="page-loading" v-if="!showMain">正在加载....</div>
  <router-view v-else-if="isOperationPage" name="subpage"></router-view>
  <div class="page-all" v-else>
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

    <div class="header">
      <top-nav></top-nav>
    </div>
    <div class="main">
      <div width="200px" class="left-nav">Aside</div>
      <div class="content">
        <router-view />
      </div>
    </div>
    <div class="footer">————世林出品</div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import topNav from '@/components/topNav'
export default {
  name: 'app',
  data() {
    return {
      showMain: false
    }
  },
  components: {
    topNav
  },
  created() {},
  mounted() {
    setTimeout(() => {
      this.showMain = true
    }, 500)
  },
  computed: {
    ...mapState(['isOperationPage'])
  }
}
</script>
<style lang="scss">
@import './assets/css/reset.css';
@import './assets/scss/app';
</style>
