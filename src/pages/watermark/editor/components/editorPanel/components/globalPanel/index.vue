<template>
  <div
    v-if="feature === 'poster'"
    class="editor-panel-content editor-global-panel"
  >
    <size></size>
    <bg v-if="isShowBgPanel && feature === 'poster'"></bg>
  </div>
</template>

<script>
import size from './components/canvasView'
import bg from './components/bg'
export default {
  name: 'GlobalPanel',
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
