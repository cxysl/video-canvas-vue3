<template>
  <div class="editor-sub-panel editor-opacity-panel">
    <div class="sub-panel-title">不透明度</div>
    <div class="slider-wrap">
      <span class="opacity-value">0</span>
      <el-slider v-model="opacity" @change="opacityChange"></el-slider>
      <span class="opacity-value">100</span>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('poster')
export default {
  name: 'OpacitySubpanel',
  data() {
    return {
      opacity: 100
    }
  },
  computed: {
    ...mapState(['currentChunkIndex', 'chunks'])
  },
  watch: {
    currentChunkIndex(val) {
      try {
        // TODO 有error未处理
        // console.log('val', val, ' ,chunk: ', this.chunks[val])
        val && (this.opacity = this.chunks[val].opacity * 100)
      } catch (error) {
        console.log('error，', error)
      }
    }
  },
  mounted() {
    this.opacity = this.chunks[this.currentChunkIndex].opacity * 100
  },
  methods: {
    opacityChange(val) {
      console.log('opacity - this - ', this)
      this.opacity = val
      this.chunks[this.currentChunkIndex].opacity = val / 100
      this.$store.commit('poster/setStorageRecord')
    }
  }
}
</script>

<style lang="scss">
.editor-opacity-panel {
  .slider-wrap {
    display: flex;
    align-items: center;
    .opacity-value {
      display: inline-block;
      flex: 1 1 50px;
      width: 50px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      background-color: #f9f9f9;
    }
    .el-slider {
      flex: 1 1 160px;
      padding: 0 20px;
    }
  }
}
</style>
