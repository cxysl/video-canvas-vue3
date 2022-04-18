<template>
  <div class="editor-sub-panel bg-panel">
    <div class="sub-panel-title">
      画布背景
      <el-button
        size="small"
        v-if="originalBg && originalBg.img"
        @click="restoreBg"
        type="text"
      >
        恢复原图
      </el-button>
    </div>
    <div class="bg-wrap" v-if="bg && bg.img">
      <div
        class="bg-preview-wrap"
        :style="{
          width: `${previewWrapStyles.width}px`,
          height: `${previewWrapStyles.height}px`
        }"
      >
        <img
          class="bg-preview-img"
          :src="bg.img"
          :style="{
            width: `${previewImgStyles.width}px`,
            height: `${previewImgStyles.height}px`,
            top: `${previewImgStyles.top}px`,
            left: `${previewImgStyles.left}px`,
            transform: `matrix(${bg.transformX}, 0, 0, ${bg.transformY}, 0, 0)`
          }"
        />
      </div>
    </div>
    <div class="bgc-wrap" v-else>
      <div class="sub-panel-title">背景颜色</div>
      <el-color-picker v-model="bgc" :class="{ empty: !bgc }"></el-color-picker>
    </div>
    <div class="handler-wrap" v-if="bg && bg.img">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-button class="full-btn" @click="turn('v')">水平翻转</el-button>
        </el-col>
        <el-col :span="12">
          <el-button class="full-btn" @click="turn('h')">垂直翻转</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top:10px;">
        <el-col :span="12">
          <el-button
            class="full-btn"
            :disabled="isShowClipBg"
            @click="openClipPanel"
          >
            裁剪
          </el-button>
        </el-col>
        <el-col :span="12">
          <el-button
            :disabled="isShowClipBg"
            @click="delBgImg"
            class="full-btn"
          >
            删除
          </el-button>
        </el-col>
      </el-row>
    </div>
    <el-button
      class="full-btn"
      :disabled="isShowClipBg"
      @click="isShowUpload = true"
    >
      上传背景图
    </el-button>
    <img-upload
      :visible="isShowUpload"
      :limit="1"
      @add-img="addImg"
    ></img-upload>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('poster')
import imgUpload from 'pages/itemsManage/watermark/editor/upload'
export default {
  name: 'editorBg',
  components: {
    imgUpload
  },
  data() {
    return {
      zoom: 1,
      isShowUpload: false
    }
  },
  computed: {
    bgc: {
      get() {
        return this.$store.state.poster.bgc
      },
      set(color) {
        let isChange = color !== this.bgc
        this.$store.commit({
          type: 'poster/setBgc',
          color
        })
        if (isChange) {
          this.$store.commit('poster/setStorageRecord')
        }
      }
    },
    ...mapState([
      'bg',
      'originalBg',
      'canvasWidth',
      'canvasHeight',
      'isShowClipBg'
    ]),
    previewWrapStyles() {
      let containerWidth = 240
      let containerHeight = 150
      let previewHeiht = 0
      let previewWidth = 0
      let scale = this.canvasWidth / this.canvasHeight
      if (this.canvasHeight > this.canvasWidth) {
        previewHeiht = containerHeight
        previewWidth = previewHeiht * scale
      } else {
        previewWidth = containerWidth
        previewHeiht = previewWidth / scale
      }
      // eslint-disable-next-line
      this.zoom = previewWidth / this.canvasWidth
      return {
        width: previewWidth,
        height: previewHeiht
      }
    },
    previewImgStyles() {
      // let zoom1 = this.previewImgStyles.width / this.canvasWidth
      let zoom = this.zoom
      let { width, height, top, left } = this.bg
      return {
        width: width * zoom,
        height: height * zoom,
        top: top * zoom,
        left: left * zoom
      }
    }
  },
  methods: {
    openClipPanel() {
      this.$store.commit({
        type: 'poster/switchClipBg',
        value: true
      })
    },
    delBgImg() {
      this.$store.commit({
        type: 'poster/setBg',
        bg: {},
        isModifyOrigin: true
      })
    },
    restoreBg() {
      this.$store.commit({
        type: 'poster/setBg',
        bg: this.originalBg,
        isModifyOrigin: false
      })
    },
    turn(type) {
      if (type === 'v') {
        this.bg.transformX = this.bg.transformX == 1 ? -1 : 1
      }
      if (type === 'h') {
        this.bg.transformY = this.bg.transformY == 1 ? -1 : 1
      }
      this.$store.commit({
        type: 'poster/setBg',
        bg: this.bg,
        isModifyOrigin: true
      })
    },
    addImg(img) {
      let image = new Image()
      image.addEventListener('load', () => {
        pushImg()
      })
      image.src = img
      let pushImg = () => {
        let data = {
          img,
          width: '',
          height: '',
          left: '',
          top: '',
          scale: 1,
          opacity: 1,
          transformX: 1,
          transformY: 1
        }
        if (this.canvasWidth > this.canvasHeight) {
          let scale = this.canvasWidth / image.width
          data.width = this.canvasWidth
          data.height = image.height * scale
          data.left = 0
          data.top = (this.canvasHeight - data.height) / 2
        } else {
          let scale = this.canvasHeight / image.height
          data.height = this.canvasHeight
          data.width = image.width * scale
          data.top = 0
          data.left = (this.canvasWidth - data.width) / 2
        }
        this.$store.commit({
          type: 'poster/setBg',
          bg: data,
          isModifyOrigin: true
        })
        // this.$store.commit({
        //   type: 'poster/setBg',
        //   bg: {
        //     width: image.width,
        //     height: image.height,
        //     left: 0,
        //     top: 0,
        //     scale: 1
        //   },
        //   isModifyOrigin: true
        // })
      }
    }
  }
}
</script>

<style lang="scss">
@import './styles';
</style>
