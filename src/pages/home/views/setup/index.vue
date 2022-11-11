<template>
  <div class="vue3-setup">城南花未开，老程已不在; {{ data }}</div>
</template>

<script setup name="setup">
import { ref } from 'vue'
// eslint-disable-next-line no-unused-vars
const data = ref(' ---世林')
</script>
<style lang="scss" scoped>
.vue3-setup {
  height: 100%;
  padding: 20px;
}
</style>
