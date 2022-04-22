<template>
  <div class="editor-el" :style="wrapStyles">
    <el-popover
      placement="top"
      effect="dark"
      popper-class="chunk-tb-popover"
      :open-delay="100"
      :disabled="!isTbWm || chunk.canBeOption == undefined || chunk.canBeOption"
      width="160"
      trigger="hover"
    >
      <!--
      canBeOption
      官方水印很多图层不允许操作,自己水印不做限制
     -->
      <p>自动填充图层，请勿编辑</p>
      <div
        slot="reference"
        :class="
          chunk.canBeOption != undefined && !chunk.canBeOption
            ? 'chunk-disabled'
            : ''
        "
      >
        <div
          class="editor-el-img"
          :style="imgWrapStyles"
          v-if="chunk.type === 'img'"
        >
          <img
            :src="chunk.src"
            draggable="false"
            :style="{
              width: `${chunk.width}px`,
              height: `${chunk.height}px`,
              transform: `matrix(${chunk.transformX}, 0, 0, ${chunk.transformY}, 0, 0)`
            }"
          />
        </div>
        <div
          class="editor-el-text"
          :class="{
            'editor-el-text-editing':
              isShowEditText && index === currentChunkIndex
          }"
          :style="textWrapStyles"
          v-else
        >
          <span
            :class="{ 'edit-content': isEdit }"
            style="font-weight: inherit"
            :contenteditable="!chunk.priceTag && isEdit"
            v-html="chunk.textContent"
          ></span>
          <span
            v-if="chunk.decimal"
            :style="{
              fontSize: `${chunk.fontSize * 0.7}px`,
              fontWeight: 'inherit'
            }"
          >
            .99
          </span>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import debounce from 'lodash/debounce'
const { mapState } = createNamespacedHelpers('poster')
export default {
  name: 'imgChunk',
  props: {
    chunk: {
      type: Object,
      default() {
        return {}
      }
    },
    index: {
      type: Number,
      default: 0
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      wrapStyles: {},
      imgWrapStyles: {
        width: '',
        height: ''
      },
      textWrapStyles: {
        width: '',
        height: '',
        fontFamily: '',
        fontSize: '',
        fontWeight: '',
        fontStyle: '',
        color: '',
        textAlign: '',
        letterSpacing: '',
        transform: ''
      },
      currentEditTextIndex: 0
    }
  },
  created() {
    let { chunk, scale } = this
    this.wrapStyles = {
      width: `${chunk.width * scale}px`,
      height: `${chunk.height * scale}px`,
      left: `${chunk.left * scale}px`,
      top: `${chunk.top * scale}px`,
      opacity: chunk.opacity,
      transform: `rotate(${chunk.rotate}deg)`,
      index: this.index + 1
    }
  },
  mounted() {
    if (this.isEdit) {
      let editTextEl = this.$el.querySelector('.edit-content')
      editTextEl.addEventListener('blur', this.editTextBlur)
      editTextEl.addEventListener('focus', this.editTextFocus)
      editTextEl.addEventListener('input', this.editTextChange)
    }
  },
  beforeDestroy() {
    if (this.isEdit) {
      let editTextEl = this.$el.querySelector('.edit-content')
      editTextEl.removeEventListener('blur', this.editTextBlur)
      editTextEl.removeEventListener('input', this.editTextChange)
      editTextEl.removeEventListener('focus', this.editTextFocus)
    }
  },
  computed: {
    ...mapState(['size', 'chunks', 'currentChunkIndex', 'isShowEditText']),
    scale() {
      return this.size / 100
    },
    isTbWm() {
      return this.$route.query.isTbWm == 'true'
    }
  },
  methods: {
    // eslint-disable-next-line
    setWrapStyles(size) {
      let { chunk, scale } = this
      this.wrapStyles = {
        width: `${chunk.width * scale}px`,
        height: `${chunk.height * scale}px`,
        left: `${chunk.left * scale}px`,
        top: `${chunk.top * scale}px`,
        opacity: chunk.opacity,
        transform: `rotate(${chunk.rotate}deg)`,
        index: this.index + 1
      }
    },
    editTextFocus() {
      // fouce的时候存下当前的index值，以防切换元素是index指向变了
      this.currentEditTextIndex = this.currentChunkIndex
    },
    editTextBlur() {
      let chunk = this.chunks[this.currentEditTextIndex]
      let editTextEl = this.$el.querySelector('.edit-content')
      let value = editTextEl.innerHTML
      chunk.textContent = value
      this.$store.commit('poster/setStorageRecord')
    },
    editTextChange(e) {
      this.textChange(e, this)
    },
    textChange: debounce((e, self) => {
      let target = e.target
      let width = target.offsetWidth
      let height = target.offsetHeight
      let chunk = self.chunks[self.currentChunkIndex]
      chunk.width = width
      chunk.height = height
      self.$emit('textChange', width, height)
    }, 200)
  },
  watch: {
    index(val) {
      this.wrapStyles.index = val + 1
    },
    chunk: {
      deep: true,
      immediate: true,
      handler(val) {
        let {
          width,
          height,
          top,
          left,
          rotate,
          opacity,
          fontFamily,
          fontSize,
          fontWeight,
          italic,
          color,
          textAlign,
          xFontSpacing,
          yFontSpacing,
          textDecoration
        } = val
        let { scale } = this
        this.wrapStyles = {
          width: `${width * scale}px`,
          height: `${height * scale}px`,
          left: `${left * scale}px`,
          top: `${top * scale}px`,
          opacity: opacity,
          transform: `rotate(${rotate}deg)`,
          index: this.index + 1
        }
        this.imgWrapStyles = {
          width: `${width}px`,
          height: `${height}px`,
          transform: `scale(${scale})`
        }
        this.textWrapStyles = {
          width: `${width}px`,
          height: `${height}px`,
          fontFamily: `${fontFamily}, Arial`,
          fontSize: `${fontSize}px`,
          fontWeight: fontWeight ? 'bold' : 'normal',
          fontStyle: italic ? 'italic' : 'normal',
          color: `#${color}`,
          textAlign: textAlign,
          letterSpacing: `${xFontSpacing}px`,
          lineHeight: yFontSpacing,
          transform: `scale(${scale})`,
          textDecoration
        }
      }
    },
    size: {
      immediate: true,
      handler(val) {
        this.setWrapStyles(val)
        this.imgWrapStyles.transform = `scale(${this.size / 100})`
        this.textWrapStyles.transform = `scale(${this.size / 100})`
      }
    }
  }
}
</script>
<style lang="scss">
.chunk-tb-popover {
  background: #303133;
  border-color: #303133;
  color: #fff;
  padding: 5px 8px;
  .popper__arrow {
    display: none;
  }
}
.editor-el {
  .chunk-disabled {
    cursor: not-allowed;
  }
}
</style>