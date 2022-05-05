<template>
  <div
    class="edit-text"
    style="display: inline-block; width: 130px; vertical-align: top; padding: 0;"
  >
    <el-select
      v-model="font"
      :size="size"
      placeholder="请选择字体"
      @change="fontChange"
      popper-class="editor-fonts-selector"
    >
      <el-option
        v-for="(item, index) in items"
        :key="index"
        :label="item.label"
        :value="isTbWm ? item.tbValue : item.value"
      >
        <!-- <img :src="`${path}/${item.value}/${item.value}.png`" /> -->
        <img :src="isTbWm ? item.tbPicUrl || item.picUrl : item.picUrl" />
      </el-option>
    </el-select>
  </div>
</template>

<script>
import fonts from './data'
// import tbFonts from './tbFontData'
// 现在字体地址再云存储，地址会变，后台返回 再组件 poster/editor/index.vue
// import './styles.scss'
export default {
  name: 'fonts',
  props: {
    name: String,
    size: {
      type: String,
      default: 'small'
    }
  },
  data() {
    return {
      font: '思源黑体',
      items: []
    }
  },
  computed: {
    isTbWm() {
      return this.$route.query.isTbWm == 'true'
    }
  },
  created() {
    /**
     * 千牛端字体上传到云存储，很多上传失败或者返回的地址不可以
     * 这里需要筛选一下
     * 另外官方字体和我们字体不一样 使用官方水印时 又是一套字体
     */
    if (!this.$isQn) {
      // this.items = this.isTbWm ? tbFonts : fonts
      fonts.forEach(item => {
        if (this.isTbWm && item.tbValue) {
          this.items.push(item)
        } else if (!this.isTbWm && item.value) {
          this.items.push(item)
        }
      })
    } else {
      fonts.forEach(item => {
        if (item.qnCanUse) {
          if (this.isTbWm && item.tbValue) {
            this.items.push(item)
          } else if (!this.isTbWm && item.value) {
            this.items.push(item)
          }
        }
      })
      // if (this.isTbWm) {
      //   tbFonts.forEach(font => {
      //     if (font.qnCanUse) {
      //       this.items.push(font)
      //     }
      //   })
      // } else {
      //   fonts.forEach(font => {
      //     if (font.qnCanUse) {
      //       this.items.push(font)
      //     }
      //   })
      // }
    }
    this.font = this.name
  },
  methods: {
    fontChange(value) {
      this.$emit('change', value)
      this.$emit('update:name', value)
    }
  },
  watch: {
    name(val) {
      this.font = val
    }
  }
}
</script>

<style lang="scss">
.editor-fonts-selector {
  .el-select-dropdown__item {
    height: 44px;
    padding: 0px;
  }
}
</style>
