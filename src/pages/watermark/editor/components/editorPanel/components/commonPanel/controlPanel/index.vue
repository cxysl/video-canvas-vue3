<template>
  <div
    class="editor-sub-panel editor-control-panel"
    v-if="!isTbWm || selection.length === 0"
  >
    <el-popover
      ref="popover"
      placement="top"
      popper-class="editor-chunk-sequence-popper"
      @show="popoverShow"
      width="80"
      trigger="click"
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
          @change="sequenceChange"
          height="200px"
        ></el-slider>
        <div class="sequence-btn handle-down" @click="handleOffset('down')">
          下移
        </div>
      </div>
    </el-popover>
    <el-tooltip
      v-for="icon in icons"
      :key="icon.value"
      :content="icon.label"
      :open-delay="200"
      placement="top"
    >
      <i
        class="control-icon"
        v-popover:popover
        v-if="icon.value === 'bbt-tuceng' && selection.length === 0"
      >
        <svg class="bbt-icon">
          <use :xlink:href="`#${icon.value}`"></use>
        </svg>
      </i>
      <i
        class="control-icon"
        @click="handle(icon)"
        v-if="icon.value === 'bbt-shanchu1'"
      >
        <svg class="bbt-icon">
          <use :xlink:href="`#${icon.value}`"></use>
        </svg>
      </i>
    </el-tooltip>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import hotkeys from 'hotkeys-js'
const { mapState } = createNamespacedHelpers('poster')
export default {
  name: 'controlPanel',

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
  destroyed() {
    hotkeys.unbind('backspace, delete, ctrl+c, ctrl+x')
  },
  computed: {
    ...mapState([
      'currentChunkIndex',
      'chunks',
      'copyChunk',
      'resetCanvasState',
      'isShowEditText',
      'selection'
    ]),
    isTbWm() {
      return this.$route.query.isTbWm == 'true'
    }
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
        this.selection.forEach(item => {
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
