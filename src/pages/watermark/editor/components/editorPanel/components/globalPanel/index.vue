<template>
  <div
    class="editor-panel-content editor-global-panel"
    v-if="feature === 'poster'"
  >
    <size></size>
    <bg v-if="isShowBgPanel && feature === 'poster'"></bg>
  </div>
</template>

<script>
import size from './components/canvasView'
import bg from './components/bg'
export default {
  name: 'globalPanel',
  components: {
    size,
    bg
  },
  computed: {
    isShowBgPanel() {
      return this.$store.state.poster.isShowBgPanel
    },
    feature() {
      return this.$route.params.feature
    }
  }
}
</script>
