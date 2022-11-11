<template>
  <div
    :class="[
      feature === 'watermark' ? 'position-top-editor-panel' : '',
      'editor-panel'
    ]"
  >
    <div class="editor-panel-title">{{ title }}</div>
    <global-panel
      v-if="panelType === 'global' && selection.length === 0"
    ></global-panel>
    <image-panel v-else-if="panelType === 'img'"></image-panel>
    <text-panel v-else-if="panelType === 'text'"></text-panel>
    <common-panel
      v-if="panelType !== 'global' || selection.length > 0"
      :panel-type="panelType"
    ></common-panel>
  </div>
</template>

<script>
import globalPanel from './components/globalPanel'
import imagePanel from './components/imagePanel'
import textPanel from './components/textPanel'
import commonPanel from './components/commonPanel'
export default {
  name: 'EditorPanel',
  components: {
    globalPanel,
    imagePanel,
    textPanel,
    commonPanel
  },
  computed: {
    panelType() {
      return this.$store.getters['poster/selectedChunkType']
    },
    feature() {
      return this.$route.params.feature
    },
    selection() {
      return this.$store.state.poster.selection
    },
    title() {
      let title = ''
      switch (this.panelType) {
        case 'global':
          if (this.selection.length > 1) {
            title = '组合'
          } else {
            title = '全局'
          }
          break
        case 'img':
          title = '图片'
          break
        default:
          title = '文字'
          break
      }
      return title
    }
  }
}
</script>

<style lang="scss">
@import './styles';
</style>
