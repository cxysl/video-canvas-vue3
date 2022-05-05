<template>
  <div class="wm-maps">
    <el-input
      placeholder="输入关键字搜索"
      v-model="content"
      icon="search"
      @change="searchWaterMark"
      @blur="searchWaterMark"
      @keyup.native.enter="searchWaterMark"
    ></el-input>
    <div class="contain-box">
      <div class="contain">
        you want change chunks？
        <!-- <ul
          class="maps"
          v-infinite-scroll="getItems"
          :infinite-scroll-disabled="busy"
          :infinite-scroll-distance="10"
          v-show="maps.length"
        >
          <li
            v-for="(item, index) in maps"
            @click="addEditorEl(item)"
            :key="index"
          >
            <img v-lazy="getImg(item)" />
          </li>
        </ul> -->
        <div class="text-content" v-if="loading" v-loading="loading"></div>
        <div class="text-content" v-if="!maps.length && !loading">
          暂无更多数据
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import vueScrollbar from 'vue2-scrollbar'
export default {
  name: 'watermarkEditorSlider',
  props: {
    mode: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      content: '',
      maps: [],
      busy: false,
      pageNo: 1,
      loading: false,
      pageSize: 20,
      modes: []
    }
  },
  created() {
    this.modes = this.$route.query.modes.split(',')
    // this.getItems()
  },
  computed: {
    watermarkMode: {
      get() {
        return this.$store.state.poster.watermarkMode
      },
      set(watermarkMode) {
        this.$store.commit({
          type: 'poster/setWatermarkMode',
          watermarkMode
        })
      }
    },
    chunks: {
      get() {
        return this.$store.state.poster.chunks
      },
      set(chunks) {
        this.$store.commit({
          type: 'poster/setChunks',
          chunks
        })
      }
    }
  },
  methods: {
    // addEditorEl(item) {
    //   axios
    //     .get('/itemManage/watermark/getChunks.get', {
    //       params: {
    //         id: item.wmID,
    //         modes: this.watermarkMode + 1
    //       }
    //     })
    //     .then(res => {
    //       if (res.data.status === 1) {
    //         let chunksOld = this.$store.state.poster.chunks
    //         let chunksNow = []
    //         let priceTagTotal = 0
    //         if (chunksOld.length > 0) {
    //           chunksOld.forEach(item => {
    //             chunksNow.push(item)
    //             if (item.priceTag) {
    //               priceTagTotal++
    //             }
    //           })
    //         }
    //         res.data.data.modeDatas[0].chunks.forEach(item => {
    //           if (!item.xFontSpacing && item.type === 'text') {
    //             item.xFontSpacing = item.xFontSpacing || 0
    //             item.yFontSpacing = item.yFontSpacing || 1
    //             item.src = ''
    //           }
    //           if (!item.opacity) {
    //             item.opacity = 1
    //           }
    //           // 方正黑体
    //           item.fontFamily =
    //             item.fontFamily === 'Microsoft YaHei'
    //               ? 'FZHei-B01'
    //               : item.fontFamily
    //           item.fontFamily =
    //             item.fontFamily === '思源黑体'
    //               ? 'SourceHanSansSC-Regular'
    //               : item.fontFamily
    //           item.adsorbing = ['false', 'false']
    //           item.transformX = item.transformX || 1
    //           item.transformY = item.transformY || 1
    //           item.rotate = item.rotate || 0
    //           item.textDecoration = item.textDecoration || '' //下划线、删除线
    //           chunksNow.push(item)
    //           if (item.priceTag) {
    //             priceTagTotal++
    //           }
    //         })
    //         if (priceTagTotal > 1) {
    //           this.$message({
    //             message: '注意，当前存在多个价签，请修改',
    //             type: 'warning'
    //           })
    //         }
    //         this.$store.commit({
    //           type: 'poster/setChunks',
    //           chunks: chunksNow
    //         })
    //         let storageRecordTemp = this.$store.state.poster.storageRecord

    //         let cache = {
    //           bgc: '',
    //           canvasHeight: this.$store.state.poster.canvasHeight,
    //           canvasWidth: this.$store.state.poster.canvasWidth,
    //           chunks: chunksNow
    //         }
    //         storageRecordTemp.push(cache)
    //         this.$store.commit({
    //           type: 'poster/setStorageRecordByWaterMark',
    //           storageRecord: storageRecordTemp
    //         })

    //         // this.$emit('add-editor-el', res.data.data.modeDatas[0].chunks)
    //       } else {
    //         this.$notify.error({
    //           title: '加载水印失败！',
    //           message: res.data.msg
    //         })
    //       }
    //     })
    //     .catch(err => {
    //       console.warn(err)
    //     })
    // },
    searchWaterMark() {
      this.pageNo = 1
      this.pageSize = 20
      this.maps = []
      this.getItems()
    },
    // getItems() {
    //   this.busy = true
    //   this.loading = true

    //   axios
    //     .get('/itemManage/watermark/watermarkList.get', {
    //       params: {
    //         pageNo: this.pageNo,
    //         pageSize: this.pageSize,
    //         name: this.content
    //       }
    //     })
    //     .then(res => {
    //       if (res.data.status === 1) {
    //         this.maps.push(...res.data.data.items)
    //         this.pageNo += 1
    //         this.busy = this.pageNo > res.data.data.totalPage
    //         this.loading = false
    //       } else {
    //         this.$notify.error({
    //           title: '获取水印失败！',
    //           message: res.data.message
    //         })
    //       }
    //     })
    // },
    closeMaps() {
      this.$emit('close')
    },
    getImg(item) {
      if (this.watermarkMode == 1) {
        return item.img34
      } else if (this.watermarkMode == 2) {
        return item.img23
      } else {
        return item.img
      }
    }
  },
  components: {
    // eslint-disable-next-line
    // vueScrollbar
  }
}
</script>
