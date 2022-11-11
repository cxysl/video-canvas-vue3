<template>
  <div>
    <el-input
      v-model="content"
      placeholder="输入关键字搜索"
      icon="search"
      @change="searchPoster"
      @blur="searchPoster"
      @keyup.enter="searchPoster"
    ></el-input>
    <!-- <el-select
      v-model="templatetype"
      placeholder="请选择"
      @change="searchPoster"
    >
      <el-option
        v-for="item in options"
        :key="item.templatetype"
        :label="item.label"
        :value="item.templatetype"
      ></el-option>
    </el-select> -->
    <div class="contain-box">
      <div class="contain">
        <!-- <vue-scrollbar class="maps-container" > -->
        you want change chunks?
        <!-- <ul
          class="maps"
          v-infinite-scroll="getPoster"
          :infinite-scroll-disabled="busy"
          :infinite-scroll-distance="10"
          v-show="list.length"
        >
          <li
            v-for="(item, index) in list"
            @click="confirmContent(item.posterId, item.posterType)"
            :key="index"
          >
            <img
              v-lazy="
                `${item.posterPreview}${
                  $isQn ? '' : '?x-oss-process=image/resize,w_240'
                }`
              "
            />
          </li>
        </ul> -->
        <div v-if="loading" v-loading="loading" class="text-content"></div>
        <div v-if="!list.length && !loading" class="text-content">
          暂无更多数据
        </div>
        <!-- </vue-scrollbar> -->
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('poster')
export default {
  components: {
    // vueScrollbar
  },
  props: {},
  data() {
    return {
      pageNo: 1,
      pageSize: 20,
      loading: false,
      busy: false,
      content: '',
      list: [],
      currentPoster: {},
      options: [
        {
          templatetype: '',
          label: '全部'
        },
        {
          templatetype: 0,
          label: '详情页海报'
        },
        {
          templatetype: 1,
          label: 'PC全屏海报'
        },
        {
          templatetype: 2,
          label: '手机首页海报'
        },
        {
          templatetype: 3,
          label: 'PC首页海报'
        }
      ],
      templatetype: ''
    }
  },
  computed: {
    ...mapState(['resetCanvasState', 'chunks'])
  },
  created() {
    let params = this.getUrlData()
    this.templatetype = params.type
    // this.getPoster()
  },
  methods: {
    getUrlData() {
      let url = window.location.search
      url = url.substring(1)
      let dataObj = {}
      if (url.indexOf('&') > -1) {
        url = url.split('&')
        for (let i = 0; i < url.length; i++) {
          let arr = url[i].split('=')
          dataObj[arr[0]] = arr[1]
        }
      } else {
        url = url.split('=')
        dataObj[url[0]] = url[1]
      }
      return dataObj
    },
    searchPoster() {
      this.pageNo = 1
      this.pageSize = 20
      this.list = []
      // this.getPoster()
    }
    // getPoster() {
    //   this.busy = true
    //   this.loading = true
    //   axios
    //     .post('/template/poster/posterList.post', {
    //       key: this.content,
    //       pageNo: this.pageNo,
    //       pageSize: this.pageSize,
    //       posterType: this.templatetype
    //     })
    //     .then(res => {
    //       if (!res.data.data.total) {
    //         this.list = []
    //         this.pageNo = 1
    //       } else {
    //         this.list.push(...res.data.data.list)
    //         this.pageNo += 1
    //         // this.moban.busy = false
    //       }
    //       this.busy = this.pageNo > res.data.data.totalPage
    //       this.loading = false
    //     })
    //     .catch(err => {
    //       this.loading = false
    //       console.log(err)
    //     })
    // },
    // confirmContent(posterId, posterType) {
    //   if (posterType == 0 && this.$route.query.type == 3) {
    //     posterType = 3
    //   }
    //   if (this.chunks.length) {
    //     this.$confirm(
    //       '替换后将不保存本次编辑的内容，是否确认替换？',
    //       '替换当前模板？',
    //       {
    //         confirmButtonText: '替换模板',
    //         cancelButtonText: '取消'
    //       }
    //     )
    //       .then(() => {
    //         this.currentPoster = { posterId, posterType }
    //         this.getPosterContent()
    //       })
    //       .catch(() => {})
    //   } else {
    //     this.currentPoster = { posterId, posterType }
    //     this.getPosterContent()
    //   }
    // }

    // getPosterContent() {
    //   axios
    //     .get('/template/poster/getTemplatePosterSeriesContent.get', {
    //       params: {
    //         posterId: this.currentPoster.posterId,
    //         posterType: this.currentPoster.posterType,
    //         isCustom: false
    //       }
    //     })
    //     .then(res => {
    //       this.resetCanvasState()
    //       if (this.currentPoster.posterType == 3) {
    //         res.data.data.height = parseInt(
    //           res.data.data.height * (950.0 / 750.0)
    //         )
    //       }
    //       this.$store.commit({
    //         type: 'poster/setCanvasSize',
    //         width: res.data.data.width,
    //         height: res.data.data.height
    //       })
    //       res.data.data.chunks.forEach(item => {
    //         item.adsorbing = ['false', 'false']
    //         item.transformX = item.transformX || 1
    //         item.transformY = item.transformY || 1
    //         item.xFontSpacing = item.xFontSpacing || 0
    //         item.yFontSpacing = item.yFontSpacing || 1
    //         item.rotate = item.rotate || 0
    //       })
    //       this.$store.commit({
    //         type: 'poster/setChunks',
    //         chunks: res.data.data.chunks
    //       })
    //       this.$store.commit({
    //         type: 'poster/setBgc',
    //         color: res.data.data.backgroundColor
    //       })
    //     })
    //     .catch(err => {
    //       console.log(err)
    //     })
    // }
  }
}
</script>
