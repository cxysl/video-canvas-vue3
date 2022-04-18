<template>
  <div style="text-align: center; margin-top: 10px">
    <el-button type="primary" @click="addHotArea">添加热区</el-button>
  </div>
</template>

<script>
export default {
  name: 'addHotArea',
  methods: {
    addHotArea() {
      this.$parent.addHotArea()
    }
  }
}
</script>
