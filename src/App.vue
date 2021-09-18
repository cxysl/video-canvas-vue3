<template>
  <div class="page-loading" v-if="!showMain">正在加载....</div>
  <router-view v-else-if="isOperationPage" name="subpage"></router-view>
  <div class="page-main" v-else>
    <el-container>
      <el-header>
        <top-nav></top-nav>
      </el-header>
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
      <el-footer>Footer</el-footer>
    </el-container>
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
@import './assets/scss/app';
</style>
