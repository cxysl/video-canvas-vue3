<template>
  <div class="poster-editor">
    <top-bar
      ref="topBar"
      :is-show-hot-areas="isShowHotAreas"
      @toEdit="toEdit"
    ></top-bar>
    <!-- 上 -->
    <sidebar
      @setCanvasLockedState="setCanvasLockedState"
      ref="sidebar"
    ></sidebar>
    <!-- 左 -->
    <!-- <tb-canvas
      v-if="isTbWm"
      ref="canvas"
      :default-locked-state="isLockedCanvas"
    ></tb-canvas> -->
    <poster-canvas
      ref="canvas"
      :default-locked-state="isLockedCanvas"
    ></poster-canvas>
    <!-- 中 -->
    <editor-panel></editor-panel>
    <!-- 右 -->
  </div>
</template>

<script>
import topBar from './components/editorTopBar'
import sidebar from './components/editorSidebar'
import posterCanvas from './components/canvas'
// import tbCanvas from './components/canvasByTb'
import editorPanel from './components/editorPanel'
import hotkeys from 'hotkeys-js'
import fontStr from '../../../itemsManage/watermark/editor/fonts/styleStr'
import tbFontStr from '../../../itemsManage/watermark/editor/fonts/tbFontStr'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('poster')

export default {
  name: 'posterEditor',
  components: {
    topBar,
    sidebar,
    posterCanvas,
    editorPanel
    // tbCanvas
  },
  provide() {
    return {
      getDefaultChunks: this.getDefaultChunks
    }
  },
  data() {
    return {
      isLockedCanvas: false,
      isShowHotAreas: false,
      fontsUrl: ''
    }
  },
  created() {
    hotkeys(
      'ctrl+z, command+z, ctrl+y, command+shift+z, ctrl+v',
      (event, handler) => {
        if (handler.key === 'ctrl+v') {
          this.paste()
        } else if (handler.key === 'ctrl+z' || handler.key === 'command+z') {
          this.$store.commit('poster/undo')
        } else {
          this.$store.commit('poster/redo')
        }
      }
    )
    /**
     * web端暂定使用oss
     */
    if (this.$isQn) {
      this.getFontsUrl(3)
    } else {
      if (this.isTbWm) {
        //官方字体  水印改造
        let fontStyle = document.createElement('STYLE')
        let fontTextNode = document.createTextNode(tbFontStr)
        fontStyle.appendChild(fontTextNode)
        document.head.appendChild(fontStyle)
      } else {
        let fontStyle = document.createElement('STYLE')
        let fontTextNode = document.createTextNode(fontStr)
        fontStyle.appendChild(fontTextNode)
        document.head.appendChild(fontStyle)
      }
    }
  },
  destroyed() {
    hotkeys.unbind('ctrl+z, command+z, ctrl+y, command+shift+z, ctrl+v')
  },
  computed: {
    isTbWm() {
      return this.$route.query.isTbWm == 'true'
    },
    ...mapState(['currentChunkIndex', 'chunks', 'copyChunk'])
  },
  methods: {
    fontsLoad(pageNo, pageSize) {
      return new Promise((resolve, reject) => {
        let params = {
          pageNo: pageNo,
          pageSize: pageSize
        }
        axios
          .get('/template/activity/v2/allTemplateFontFamily.get', { params })
          .then((res) => {
            let fonts = res.data.data
            fonts.forEach((font) => {
              font.ttfUrl = font.ttfUrl.replace('http:', '')
              font.woffUrl = font.woffUrl.replace('https:', '')
              let type =
                font.fontFormat.substr(0, 3) == 'ttf' ? 'truetype' : 'woff'
              // @font-face{font-family:HappyZcool;src:url(//material.baobeituan.com/font/HappyZcool/HappyZcool.ttf) format("truetype");font-weight:400;font-style:normal}
              this.fontsUrl += ` @font-face{font-family:${
                font.fontFamily
              };src:url(${
                font.fontFormat.substr(0, 3) == 'ttf'
                  ? font.ttfUrl
                  : font.fontFormat.substr(0, 3) == 'otf'
                  ? font.otfUrl
                  : font.woffUrl
              }) format("${type}");font-weight:400;font-style:normal;}`
            })
            resolve()
          })
          .catch((err) => {
            console.log(err)
            reject()
          })
      })
    },
    async getFontsUrl(pageSize) {
      let addStyle = () => {
        console.log('字体加载完毕\n', this.fontsUrl)
        let fontStyle = document.createElement('STYLE')
        let fontTextNode = document.createTextNode(`${this.fontsUrl}`)
        fontStyle.appendChild(fontTextNode)
        document.head.appendChild(fontStyle)
      }
      let loadAllFonts = []
      //如果新增或删除字体，这里需要改
      let fontsTotalCount = 86
      for (let i = 1; i <= Math.ceil(fontsTotalCount / pageSize); i++) {
        loadAllFonts.push(this.fontsLoad(i, pageSize))
      }
      await Promise.all(loadAllFonts)
        .then(() => {
          addStyle()
        })
        .catch(() => {
          addStyle()
          this.$message.warning('部分字体未加载成功')
        })
    },
    paste() {
      console.log('ctrl+v')
      let chunkTemp = JSON.parse(JSON.stringify(this.copyChunk))
      let chunksTemp = JSON.parse(JSON.stringify(this.chunks))
      if (this.copyChunk.type) {
        let choiceIndex = this.currentChunkIndex
        let index = chunkTemp.originalIndex
        if (!choiceIndex || choiceIndex == index) {
          chunkTemp.left += 20
          chunkTemp.top += 20
        } else if (choiceIndex != index) {
          chunkTemp.left = chunksTemp[choiceIndex].left + 20
          chunkTemp.top = chunksTemp[choiceIndex].top + 20
          chunkTemp.originalIndex = choiceIndex
        }
        chunksTemp.push(chunkTemp)
        this.$store.commit({
          type: 'poster/setCopyChunk',
          copyChunk: chunkTemp
        })
        this.$store.commit({
          type: 'poster/setChunks',
          chunks: chunksTemp
        })
        this.$store.commit('poster/setStorageRecord') // 存操作记录
      }
    },
    getDefaultChunks() {
      return JSON.parse(JSON.stringify(this.$refs.canvas.chunks))
    },
    setCanvasLockedState(state) {
      this.isShowHotAreas = state
      this.$refs.canvas.setLockedState(state)
    },
    toEdit() {
      this.$refs.sidebar.isShowHotAreas = false
      this.$refs.sidebar.activeBtn = ''
      this.setCanvasLockedState(false)
    }
  }
}
</script>
