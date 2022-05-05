<template>
  <div class="editor-panel-content editor-image-panel">
    <el-tooltip
      content="仅支持2M以内的jpg、png格式的图片"
      placement="top"
      :enterable="false"
    >
      <el-button class="change-img" @click="openUpload">替换图片</el-button>
    </el-tooltip>
    <!-- <upload :visible.sync="isShowUpload" @add-img="addImg"></upload> -->
    <div class="editor-sub-panel turn-img" v-if="!isTbWm">
      <div class="sub-panel-title">图片翻转</div>
      <el-button @click="turn('v')">水平翻转</el-button>
      <el-button @click="turn('h')">垂直翻转</el-button>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
// import upload from 'pages/itemsManage/watermark/editor/upload'
const { mapState } = createNamespacedHelpers('poster')
export default {
  name: 'imagePanel',
  data() {
    return {
      loading: false,
      isShowUpload: false
    }
  },
  components: {
    // upload
  },
  computed: {
    ...mapState([
      'size',
      'chunks',
      'canvasWidth',
      'canvasHeight',
      'currentChunkIndex'
    ]),
    isShowTransformTool: {
      get() {
        return this.$store.state.poster.isShowTransformTool
      },
      set(isShowTransformTool) {
        this.$store.commit({
          type: 'poster/setShowTransformTool',
          isShowTransformTool
        })
      }
    },
    isTbWm() {
      return this.$route.query.isTbWm == 'true'
    }
  },
  methods: {
    openUpload() {
      console.log('none')
      this.isShowUpload = true
    },
    turn(type) {
      let chunk = this.chunks[this.currentChunkIndex]
      if (type === 'v') {
        chunk.transformX = chunk.transformX == 1 ? -1 : 1
      }
      if (type === 'h') {
        chunk.transformY = chunk.transformY == 1 ? -1 : 1
      }
      this.$store.commit('poster/setStorageRecord')
    },
    addImg(img) {
      let image = new Image()
      image.addEventListener('load', () => {
        pushImg()
      })
      image.src = img
      // eslint-disable-next-line
      let scale = this.size / 100
      let pushImg = () => {
        let chunk = this.chunks[this.currentChunkIndex]
        chunk.width = image.width
        chunk.height = image.height
        chunk.src = img
        this.$store.state.poster.resetCanvasState()
        this.$store.commit('poster/setStorageRecord')
        this.$store.commit({
          type: 'poster/setShowTransformTool',
          isShowTransformTool: false
        })
      }
    }
  }
}
</script>

<style lang="scss">
.editor-image-panel {
  .el-upload,
  .change-img {
    width: 100%;
  }
  .turn-img {
    width: 100%;
    margin-top: 20px;
    .el-button {
      width: 45%;
    }
  }
}
</style>
