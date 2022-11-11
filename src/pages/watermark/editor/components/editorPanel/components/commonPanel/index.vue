<template>
  <div class="editor-panel-content">
    <opacity-panel v-if="panelType !== 'global'"></opacity-panel>
    <control-panel></control-panel>
  </div>
</template>

<script>
import controlPanel from './controlPanel'
import opacityPanel from './opacityPanel'
export default {
  name: 'CommonPanel',
  components: {
    controlPanel,
    opacityPanel
  },
  props: {
    panelType: {
			type: String,
			default: ''
		}
  },
  computed: {
    selection() {
      return this.$store.state.poster.selection
    }
  }
}
</script>
