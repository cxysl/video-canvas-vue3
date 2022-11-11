<template>
  <div class="side-nav">
    <div v-if="sideMenuList && sideMenuList.length" class="side-list">
      <div
        v-for="item in sideMenuList"
        :key="item.path"
        class="item"
        :class="['item', checkPagePath === item.path ? 'item-active' : '']"
        @click="choicePage(item, index)"
      >
        {{ item.name }}
      </div>
    </div>

    <div v-else class="none-list">城南花未开，老程已不在;</div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('setting')
export default {
  name: 'SideNav',
  components: {},
  props: {
    // sideMenuList: {
    //   type: Array,
    //   default: () => {}
    // }
  },
  data() {
    return {
      checkPagePath: '' // 当前选中页面的path
    }
  },
  computed: {
    ...mapState(['sideMenuList'])
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    choicePage(route) {
      this.checkPagePath = route.path
      // console.log(this.checkPagePath, '--', this.$router)
      this.$router.push(route.path)
    }
  }
}
</script>
<style lang="scss">
.side-nav {
  width: 200px;
  height: 100%;
  .side-list {
    height: 100%;
    // height: calc(100% - 67px);
    margin-bottom: 15px;
    overflow-y: auto;
    .item {
      height: 40px;
      width: 100%;
      line-height: 40px;
      padding-left: 15px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      cursor: pointer;
      &:hover {
        background: #f5f7fa;
      }
    }
    .item-active {
      background: #f0f0ff;
    }
  }
}
</style>
