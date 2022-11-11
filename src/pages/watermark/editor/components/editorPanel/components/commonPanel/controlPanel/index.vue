<template>
  <div
    v-if="selection.length === 0"
    class="editor-sub-panel editor-control-panel"
  >
    <el-popover
      ref="popover"
      placement="top"
      popper-class="editor-chunk-sequence-popper"
      width="80"
      trigger="click"
      @show="popoverShow"
    >
      <div class="sequence-handle-wrap">
        <div class="sequence-btn handle-up" @click="handleOffset('up')">
          上移
        </div>
        <el-slider
          v-model="chunkIndex"
          vertical
          show-stops
          :show-tooltip="false"
          :max="chunks.length - 1"
          height="200px"
          @change="sequenceChange"
        ></el-slider>
        <div class="sequence-btn handle-down" @click="handleOffset('down')">
          下移
        </div>
      </div>
    </el-popover>
    <el-tooltip
      v-for="(icon, index) in icons"
      :key="index"
      :content="icon.label || ''"
      :open-delay="200"
      placement="top"
    >
      <span>
        <i
          v-if="icon.value === 'bbt-tuceng' && selection.length === 0"
          v-popover:popover
          class="control-icon"
        >
          <svg class="bbt-icon">
            <use :xlink:href="`#${icon.value}`"></use>
          </svg>
        </i>
        <i
          v-if="icon.value === 'bbt-shanchu1'"
          class="control-icon"
          @click="handle(icon)"
        >
          <svg class="bbt-icon">
            <use :xlink:href="`#${icon.value}`"></use>
          </svg>
        </i>
      </span>
    </el-tooltip>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import hotkeys from 'hotkeys-js'
const { mapState } = createNamespacedHelpers('poster')
export default {
  name: 'ControlPanel',

  data() {
    return {
      icons: [
        {
          value: 'bbt-tuceng',
          label: '图层顺序'
        },
        {
          value: 'bbt-shanchu1',
          label: '删除',
          handle: 'delChunk'
        }
      ],
      chunkIndex: 0,
      isDisabledRecord: false
    }
  },
  computed: {
    ...mapState([
      'currentChunkIndex',
      'chunks',
      'copyChunk',
      'resetCanvasState',
      'isShowEditText',
      'selection'
    ])
  },
  created() {
    // eslint-disable-next-line
    hotkeys('backspace, delete, ctrl+c, ctrl+x', (event, handler) => {
      if (handler.key === 'ctrl+c') {
        this.copy()
      } else if (handler.key === 'ctrl+x') {
        this.copy()
        this.delChunk()
      } else if (
        (handler.key === 'backspace' || handler.key === 'delete') &&
        !this.isShowEditText
      ) {
        this.delChunk(this.currentChunkIndex)
      }
    })
  },
  unmounted() {
    hotkeys.unbind('backspace, delete, ctrl+c, ctrl+x')
  },
  methods: {
    copy() {
      let choiceChunk = this.chunks[this.currentChunkIndex]
      choiceChunk.originalIndex = this.currentChunkIndex
      this.$store.commit({
        type: 'poster/setCopyChunk',
        copyChunk: choiceChunk
      })
    },
    delChunk() {
      if (this.selection.length > 0) {
        this.selection.sort((a, b) => {
          return b - a
        })
        this.selection.forEach((item) => {
          this.chunks.splice(item, 1)
        })
        this.$store.commit({
          type: 'poster/setSelection',
          selection: []
        })
      } else {
        this.chunks.splice(this.currentChunkIndex, 1)
      }
      this.$store.commit({
        type: 'poster/setCurrentChunkIndex',
        index: ''
      })
      this.$store.commit({
        type: 'poster/setShowTransformTool',
        isShowTransformTool: false
      })
      this.resetCanvasState()
      this.$store.commit('poster/setStorageRecord')
    },
    sequenceChange(val) {
      console.log('this --- ', this)
      let currentChunk = this.chunks[this.currentChunkIndex]
      let chunks = JSON.parse(JSON.stringify(this.chunks))
      chunks.splice(this.currentChunkIndex, 1)
      chunks.splice(val, 0, currentChunk)
      this.$store.commit({
        type: 'poster/setCurrentChunkIndex',
        index: val
      })
      this.$store.commit({
        type: 'poster/setChunks',
        chunks
      })
      if (!this.isDisabledRecord) {
        this.$store.commit('poster/setStorageRecord')
      }
      this.isDisabledRecord = false
    },
    handleOffset(type) {
      if (type === 'up') {
        this.chunkIndex =
          this.currentChunkIndex + 1 >= this.chunks.length
            ? this.currentChunkIndex
            : this.currentChunkIndex + 1
      } else {
        this.chunkIndex =
          this.currentChunkIndex - 1 <= 0 ? 0 : this.currentChunkIndex - 1
      }
    },
    popoverShow() {
      this.chunkIndex = this.currentChunkIndex
      this.isDisabledRecord = true
    },
    handle(icon) {
      if (icon.handle) {
        this[icon.handle]()
      }
    }
  }
}
</script>

<style lang="scss">
@import './styles';
</style>
