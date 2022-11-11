<template>
  <i
    class="laocheng-icon-wrap"
    :style="{ fontSize: `${size}px`, color: `${color}` }"
    @click="handleClick"
  >
    <svg class="laocheng-icon" aria-hidden="true">
      <use :xlink:href="`#${icon}`"></use>
    </svg>
  </i>
</template>

<script>
/**
 * @name 图表组件
 * @prop {String} icon 图表的编码，在iconfont的项目上查看
 * @prop {Number, String} size 图表的字体大小
 * @prop { String} color 图表的字体颜色
 */
export default {
  name: 'LaochengIcon',
  props: {
    icon: {
			type: String,
			default: ''
		},
    color: {
			type: String,
			default: ''
		},
    size: {
			type: [Number, String],
			default: ''
		}
  },
	emits: ['click'],
  methods: {
    handleClick() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss">
@import './styles';
</style>
