<template>
  <div class="editor-sub-panel editor-canvas-view-panel">
    <div class="sub-panel-title">
      海报尺寸
      <el-button size="small" type="text" @click="selectSize">
        选择尺寸
      </el-button>
    </div>
    <el-row :gutter="20" class="canvas-view-size">
      <el-col :span="12">
        <div class="view-size-item" @click="selectSize">
          <span>{{ width }}px</span>
          <span class="size-label">宽</span>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="view-size-item" @click="selectSize">
          <span>{{ height }}px</span>
          <span class="size-label">高</span>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      v-model:visible="isShowDialog"
      custom-class="canvas-view-size-options"
      :close-on-click-modal="false"
      ref="canvasViewSize"
    >
      <div class="canvas-preview">
        <div
          class="clip-content clip-bg"
          :style="{
            width: `${clipBoxStyles.width}px`,
            height: `${clipBoxStyles.height}px`
          }"
        ></div>
        <canvas-preview
          :default-locked-state="true"
          :is-show-original-size="true"
          :default-chunks="chunks"
          v-if="isShowDialog"
          :style="previewStyles"
        ></canvas-preview>
        <div
          class="clip-content clip-box"
          :style="{
            width: `${clipBoxStyles.width}px`,
            height: `${clipBoxStyles.height}px`
          }"
        ></div>
      </div>
      <div class="view-options">
        <div class="options-header">
          <span class="title">调整画布尺寸</span>
          <i class="el-icon-close" @click="isShowDialog = false"></i>
        </div>
        <ul class="size-select-wrap">
          <li
            :class="{ active: currentSize === index }"
            v-for="(item, index) in sizeOptions"
            :key="index"
          >
            <div @click="sizeChange(index)">
              {{ item.label }} {{ `${item.width}px × ${item.height}px` }}
            </div>
          </li>
        </ul>
        <div class="custom-size">
          <span class="custom-size-label">自定义尺寸</span>
          <el-input
            :class="{ error: isError }"
            v-model.number="customSizeWidth"
            @change="customSizeChange(customSizeWidth, 'width')"
            @blur="customSizeValidate(customSizeWidth, 'width')"
          >
            <template slot="append">宽</template>
          </el-input>
          <el-tooltip
            :content="isLockWithHeight ? '锁定宽高比例' : '自定义宽高'"
            placement="top"
          >
            <span
              class="lock-icon"
              @click="switchWidthHeightPattern"
              :class="{ locked: isLockWithHeight }"
            >
              <svg class="bbt-icon">
                <use
                  :xlink:href="`#bbt-${
                    isLockWithHeight ? 'suo-hebing' : 'suo'
                  }`"
                ></use>
              </svg>
            </span>
          </el-tooltip>
          <el-input
            :class="{ error: isError }"
            v-model.number="customSizeHeight"
            @change="customSizeChange(customSizeHeight, 'height')"
            @blur="customSizeValidate(customSizeHeight, 'height')"
          >
            <template slot="append">高</template>
          </el-input>
          <div class="error-msg" v-if="isError">{{ errorMsg }}</div>
        </div>
        <el-button
          class="confirm-btn"
          size="large"
          type="primary"
          @click="confirm"
        >
          调整尺寸
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import canvasPreview from '../../../../../canvas'
import debounce from 'lodash/debounce'
import { mapState } from 'vuex'
export default {
  name: 'sizePanel',
  components: {
    canvasPreview
  },
  data() {
    return {
      customSizeWidth: 800,
      customSizeHeight: 800,
      isShowDialog: false,
      currentSize: 0,
      sizeOptions: [
        {
          label: 'PC端详情海报',
          width: 750,
          height: 400,
          type: 0
        },
        {
          label: 'PC端全屏海报',
          width: 1920,
          height: 600,
          type: 1
        },
        {
          label: '手机详情店铺首页',
          width: 1200,
          height: 1500,
          type: 2
        },
        {
          label: 'PC首页',
          width: 950,
          height: 400,
          type: 3
        }
        // {
        //   label: '主图图标',
        //   width: 800,
        //   height: 800,
        //   type: 4
        // }
      ],
      isLockWithHeight: false,
      isError: false,
      lockedScale: 1,
      errorMsg: ''
    }
  },
  created() {
    if (this.user.isTmall) {
      this.sizeOptions[0].width = 790
      this.sizeOptions[3].width = 990
    }
  },
  mounted() {
    document.body.append(this.$refs.canvasViewSize.$el)
  },
  computed: {
    ...mapState(['user']),
    width() {
      return this.$store.state.poster.canvasWidth
    },
    height() {
      return this.$store.state.poster.canvasHeight
    },
    chunks() {
      return this.$store.state.poster.chunks
    },
    previewStyles() {
      let { width, height } = this.clipBoxStyles
      let scale = 1
      if (this.width >= this.height) {
        scale = width / this.width
      } else {
        scale = height / this.height
      }
      // let scale = Math.min(width, height) / Math.max(this.width, this.height)
      return {
        width: `${this.width}px`,
        height: `${this.height}px`,
        transform: `scale(${scale})`,
        marginLeft: `${(580 - this.width) / 2}px`,
        marginTop: `${(500 - this.height) / 2}px`
      }
    },
    clipBoxStyles() {
      let referenceWidth = 580
      let referenceHeight = 500
      let scale = this.customSizeWidth / this.customSizeHeight
      let result = {
        width: 500,
        height: 500
      }
      if (scale > 1) {
        result.width = referenceWidth
        result.height = referenceWidth / scale
      }
      if (scale < 1) {
        result.height = referenceHeight
        result.width = referenceHeight * scale
      }
      return result
    }
  },
  methods: {
    selectSize() {
      this.customSizeWidth = this.width
      this.customSizeHeight = this.height
      let originalSize = {
        label: '原尺寸',
        width: this.width,
        height: this.height
      }
      if (this.sizeOptions[0].label === '原尺寸') {
        this.sizeOptions[0] = originalSize
      } else {
        this.sizeOptions.unshift(originalSize)
      }
      this.currentSize = 0
      this.isShowDialog = true
    },
    sizeChange(index) {
      let { width, height } = this.sizeOptions[index]
      this.customSizeWidth = width
      this.customSizeHeight = height
      this.currentSize = index
      this.isError = false
      if (this.isLockWithHeight) {
        this.lockedScale = this.customSizeWidth / this.customSizeHeight
      }
    },
    switchWidthHeightPattern() {
      this.isLockWithHeight = !this.isLockWithHeight
      if (this.isLockWithHeight) {
        this.lockedScale = this.customSizeWidth / this.customSizeHeight
      }
    },
    // eslint-disable-next-line
    customSizeValidate(val, type) {
      if (!/^[1-9]\d*$/.test(val) || !(val >= 20)) {
        this.isError = true
        this.errorMsg = '请输入整数，且最小尺寸限制20px × 20px'
        return false
      }
      this.isError = false
    },
    setCustomSize: debounce((val, type, self) => {
      if (self.isLockWithHeight) {
        // eslint-disable-next-line
        let scale = self.customSizeWidth / self.customSizeHeight
        if (type === 'width') {
          self.customSizeHeight = Math.round(val / self.lockedScale)
        } else {
          self.customSizeWidth = Math.round(val * self.lockedScale)
        }
      }
    }, 300),
    customSizeChange(val, type) {
      this.setCustomSize(val, type, this)
    },
    confirm() {
      if (this.isError) {
        return this.$message.warning('请输入整数，且最小尺寸限制20px × 20px')
      }
      this.isShowDialog = false
      this.updateChunks()
      this.$store.commit({
        type: 'poster/setCanvasSize',
        width: this.customSizeWidth,
        height: this.customSizeHeight
      })
      this.$store.state.poster.resetCanvasState()
      this.$store.commit('poster/setStorageRecord')
    },
    updateChunks() {
      let scale = 1
      let offsetLeft = 0
      let offsetTop = 0
      if (this.width - this.height > 0) {
        scale = this.customSizeWidth / this.width
        offsetTop = this.customSizeHeight / 2 - (this.height * scale) / 2
      } else {
        scale = this.customSizeHeight / this.height
        offsetLeft = this.customSizeWidth / 2 - (this.width * scale) / 2
      }
      this.chunks.forEach((item) => {
        // eslint-disable-next-line
        let { width, height, left, top, fontSize } = item
        item.width = width * scale
        item.height = height * scale
        item.left = left * scale + offsetLeft
        item.top = top * scale + offsetTop
        if (item.type === 'text') {
          item.fontSize = Math.round(item.fontSize * scale)
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import './styles';
</style>
