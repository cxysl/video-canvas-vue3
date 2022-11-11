<!--
 * @Author: Nahco.Huang
 * @Date: 2020-11-09 14:52:45
 * @LastEditTime: 2022-10-28 19:06:17
 * @LastEditors: chengsl
 * @Description: 颜色选项子组件
-->

<template>
	<div class="color-item" :style="`background: ${color}`">
		<i v-if="select" class="el-icon-check" />
	</div>
</template>
<script>
export default {
  name: 'ColorItem',

  props: {
    select: {
      type: Boolean,
      default: false,
      require: true
    },
    color: {
      type: String,
      default: ''
    }
  },

  // render() {
  //   return (
  //     <div class="color-item" style={{ background: this.color }}>
  //       {this.select ? <i class="el-icon-check" /> : null}
  //     </div>
  //   )
  // }
}
</script>

<style lang="scss" scoped>
.color-item {
  position: relative;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  i {
    position: absolute;
    top: 2px;
    left: 2px;
    font-size: 16px;
    color: #ffffff;
  }
  &:hover {
    transform: scale(1.1);
  }
}
</style>
