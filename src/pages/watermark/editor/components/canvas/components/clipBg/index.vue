<template>
  <div class="clip-editor-bg" :style="clipWrapStyles">
    <div class="handler-bar">
      <span class="bar-title">缩放</span>
      <el-slider
        v-model="scale"
        :step="0.02"
        :max="3"
        :min="1"
        :format-tooltip="formatTooltip"
        @input="scaleChnage"
      ></el-slider>
      <div class="handler-btns">
        <span class="handler-btn" @click="reset">重置</span>
        <span class="handler-btn" @click="cancel">取消</span>
        <span class="handler-btn primary" @click="confirm">完成</span>
      </div>
    </div>
    <div class="bg-preview-wrap">
      <img :src="bg.img" class="bg-preview-img" :style="styles" />
      <div
        class="bg-preview-img-light"
        :style="{ backgroundColor: bgc || '#fff' }"
      >
        <img :src="bg.img" :style="styles" />
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('poster')
import throttle from 'lodash/throttle'
export default {
  name: 'ClipEditorBg',
  props: {
    clipWrapStyles: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      scale: 1,
      origin: {
        x: 0,
        y: 0
      },
      lastX: '',
      lastY: '',
      outImg: {},
      innerImg: {},
      currentBg: {}
    }
  },
  computed: {
    ...mapState([
      'bg',
      'bgc',
      'originalBg',
      'size',
      'canvasWidth',
      'canvasHeight'
    ]),
    zoom() {
      return this.size / 100
    },
    styles() {
      let { width, height, top, left } = this.currentBg
      // console.log(top, left)
      return {
        width: `${width * this.zoom}px`,
        height: `${height * this.zoom}px`,
        top: `${top * this.zoom}px`,
        left: `${left * this.zoom}px`,
        transform: `matrix(${this.bg.transformX}, 0, 0, ${this.bg.transformY}, 0, 0)`
      }
    }
  },
  created() {
    this.reset()
  },
  mounted() {
    this.innerImg = document.querySelector('.bg-preview-img-light')
    this.outImg = document.querySelector('.bg-preview-img')
    this.innerImg.addEventListener('mousedown', this.moveWrapDown)
    this.outImg.addEventListener('mousedown', this.moveWrapDown)
  },
  beforeUnmount() {
    this.innerImg.removeEventListener('mousedown', this.moveWrapDown)
    this.outImg.removeEventListener('mousedown', this.moveWrapDown)
  },
  methods: {
    formatTooltip(val) {
      return `${parseInt(val * 100)}%`
    },
    scaleChnage(value) {
      // console.log('缩放')
      this.scale = value
      let { width, height } = this.originalBg
      let differentScale = (value * 100 - this.currentBg.scale * 100) / 100
      this.currentBg.width = width * value
      this.currentBg.height = height * value
      let newLeft =
        (this.currentBg.left - (this.canvasWidth * differentScale) / 2).toFixed(
          2
        ) * 1
      let newTop =
        (this.currentBg.top - (this.canvasHeight * differentScale) / 2).toFixed(
          2
        ) * 1
      if (newLeft > 0) {
        this.currentBg.left = 0
      } else if (this.currentBg.width + newLeft < this.canvasWidth) {
        this.currentBg.left = this.canvasWidth - this.currentBg.width
      } else {
        this.currentBg.left = newLeft
      }
      if (newTop > 0) {
        this.currentBg.top = 0
      } else if (this.currentBg.height + newTop < this.canvasHeight) {
        this.currentBg.top = this.canvasHeight - this.currentBg.height
      } else {
        this.currentBg.top = newTop
      }
      this.currentBg.scale = value
    },
    moveWrapDown(e) {
      this.lastX = e.clientX
      this.lastY = e.clientY
      document.addEventListener('mousemove', this.onMouseMove)
      document.addEventListener('mouseup', this.moveWrapUp)
    },
    onMouseMove(e) {
      this.moveWrapMove(e, this)
    },
    moveWrapMove: throttle((e, self) => {
      let distanceX = e.clientX - self.lastX
      let distanceY = e.clientY - self.lastY
      self.lastX = e.clientX
      self.lastY = e.clientY
      let newLeft = distanceX / self.zoom + self.currentBg.left
      let newTop = distanceY / self.zoom + self.currentBg.top
      self.currentBg.left = newLeft
      self.currentBg.top = newTop
      if (newLeft > 0) {
        self.currentBg.left = 0
      } else if (newLeft + self.currentBg.width < self.canvasWidth) {
        self.currentBg.left = self.canvasWidth - self.currentBg.width
      } else {
        self.currentBg.left = newLeft
      }
      if (newTop > 0) {
        self.currentBg.top = 0
      } else if (newTop + self.currentBg.height < self.canvasHeight) {
        self.currentBg.top = self.canvasHeight - self.currentBg.height
      } else {
        self.currentBg.top = newTop
      }
    }, 30),
    // eslint-disable-next-line
    moveWrapUp(e) {
      document.removeEventListener('mousemove', this.onMouseMove)
      document.removeEventListener('mouseup', this.moveWrapUp)
    },
    // 确定裁剪
    confirm() {
      this.$store.commit({
        type: 'poster/setBg',
        bg: this.currentBg
      })
      this.$store.commit({
        type: 'poster/switchClipBg',
        value: false
      })
    },
    cancel() {
      this.$store.commit({
        type: 'poster/switchClipBg',
        value: false
      })
    },
    reset() {
      console.log('初始化')
      this.scale = this.bg.scale
      this.currentBg = JSON.parse(JSON.stringify(this.bg))
    }
  }
}
</script>

<style lang="scss">
@import './styles';
</style>
