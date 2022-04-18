<template>
  <div>
    <el-input
      placeholder="输入关键字搜索"
      v-model="iconMap.content"
      icon="search"
      @change="getIcon"
      @blur="getIcon"
      @keyup.native.enter="getIcon"
    ></el-input>
    <div class="contain-box">
      <div class="contain">
        <!-- <vue-scrollbar class="maps-container"> -->
        <ul
          class="icon-maps"
          v-infinite-scroll="getIcon"
          :Linfinite-scroll-disabled="iconMap.busy"
          :infinite-scroll-distance="10"
          v-show="iconMap.list.length"
        >
          <li v-for="(item, index) in iconMap.list" :key="index">
            <img
              v-lazy="
                `${item.posterPreview}${
                  $isQn ? '' : '?x-oss-process=image/resize,w_240'
                }`
              "
            />
          </li>
        </ul>
        <div
          class="text-content"
          v-if="iconMap.loading"
          v-loading="iconMap.loading"
        ></div>
        <div
          class="text-content"
          v-if="!iconMap.list.length && !iconMap.loading"
        >
          暂无更多数据
        </div>
        <!-- </vue-scrollbar> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    activeIcon: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      content: '',
      festival: {
        pageNo: 1,
        pageSize: 20,
        loading: false,
        busy: false,
        list: []
      },
      activity: {
        pageNo: 1,
        pageSize: 20,
        loading: false,
        busy: false,
        list: []
      }
    }
  },
  computed: {
    iconMap() {
      if (this.activeIcon === 'festival') {
        return this.festival
      } else {
        return this.activity
      }
    }
  },
  created() {},
  methods: {
    getIcon() {
      //   iconMap.busy = true
      //   iconMap.loading = true
      // axios
      //   .post('/template/poster/posterList.post', {
      //     key: this.iconContent,
      //     pageNo: iconMap.pageNo,
      //     pageSize: iconMap.pageSize
      //   })
      //   .then((res) => {
      //     if (!res.data.data.total) {
      //       iconMap.list = []
      //       iconMap.pageNo = 1
      //     } else {
      //       iconMap.list.push(...res.data.data.list)
      //       iconMap.pageNo += 1
      //       // this.moban.busy = false
      //     }
      //     iconMap.busy = iconMap.pageNo > res.data.data.totalPage
      //     iconMap.loading = false
      //   })
      //   .catch((err) => {
      //     iconMap.loading = false
      //     this.$notify.error({
      //       title: '获取图标失败！',
      //       message: res.data.errorMsg
      //     })
      //   })
    }
  },
  components: {
    // vueScrollbar
  }
}
</script>
