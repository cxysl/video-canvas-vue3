<template>
  <div class="editor-panel-content editor-text-panel">
    <!-- <div
      class="editor-sub-panel"
      v-if="
        chunks[currentChunkIndex].type == 'text' &&
        !chunks[currentChunkIndex].priceTag
      "
    >
      <div class="sub-panel-title">编辑文字</div>
      <div class="editor-control-panel">
        <div>
          <i class="control-icon" @click="editText">
            <i class="el-icon-edit fl"></i>
          </i>
        </div>
      </div>
    </div> -->
    <div class="editor-sub-panel">
      <div class="sub-panel-title">字体</div>
      <div class="fonts-wrap">
        <fonts
          v-model:name="fontFamily"
          size="large"
          style="width: 100%"
        ></fonts>
        <el-autocomplete
          class="inline-input"
          v-model.number="fontSize"
          :fetch-suggestions="suggestions"
          size="large"
          placeholder="请输入内容"
          @select="handleSelect"
        >
          <template slot="prepend">
            <i
              class="handle-size-btn el-icon-minus"
              @click="stepFontSize(0)"
            ></i>
          </template>
          <template slot="append">
            <i
              class="handle-size-btn el-icon-plus"
              @click="stepFontSize(1)"
            ></i>
          </template>
        </el-autocomplete>
      </div>
    </div>
    <div class="editor-sub-panel">
      <div class="sub-panel-title">颜色</div>
      <el-color-picker v-model="bgc" :class="{ empty: !bgc }"></el-color-picker>
    </div>
    <div class="editor-sub-panel">
      <div class="sub-panel-title">样式</div>
      <div class="font-style-wrap">
        <el-tooltip
          :content="item.label || ''"
          v-for="(item, index) in alignList"
          :enterable="false"
          placement="top"
          :key="item.value"
        >
          <div
            class="icon-wrap"
            @click="handleFontStyle(item)"
            :class="[
              {
                active:
                  chunks[currentChunkIndex][item.attribute] ===
                  item.attributeValue
              },
              {
                'no-border': index === 4
              }
            ]"
          >
            <i class="ebitor-icon">
              <svg class="bbt-icon">
                <use :xlink:href="`#${item.value}`"></use>
              </svg>
            </i>
          </div>
        </el-tooltip>
        <el-popover
          ref="jianju"
          placement="bottom"
          popper-class="zi-jian-hang-ju-popover"
          @hide="onHandlerBarHide"
          trigger="hover"
        >
          <div class="popover-handler-bar">
            <span class="label-wrap">字间距</span>
            <el-slider
              @change="isFontSpaceChange = true"
              :min="-40"
              :max="50"
              v-model="xFontSpacing"
            ></el-slider>
            <span class="vaule-wrap">{{ xFontSpacing }}px</span>
          </div>
        </el-popover>
        <el-popover
          ref="hangju"
          placement="bottom"
          popper-class="zi-jian-hang-ju-popover"
          @hide="onHandlerBarHide"
          trigger="hover"
        >
          <div class="popover-handler-bar">
            <span class="label-wrap">字行距</span>
            <el-slider
              @change="isFontSpaceChange = true"
              :step="0.02"
              :min="0.5"
              :max="2.5"
              v-model="yFontSpacing"
            ></el-slider>
            <span class="vaule-wrap">{{ yFontSpacing }}</span>
          </div>
        </el-popover>
        <div class="icon-wrap" v-popover:jianju>
          <i class="ebitor-icon">
            <svg class="bbt-icon">
              <use xlink:href="#bbt-zijianju"></use>
            </svg>
          </i>
        </div>
        <!-- //官方的只有行高 没有行间距 -->
        <div class="icon-wrap" v-popover:hangju>
          <i class="ebitor-icon">
            <svg class="bbt-icon">
              <use xlink:href="#bbt-zihangju"></use>
            </svg>
          </i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import fonts from '../../../../common/fonts'
import fontSizeSuggestions from './fontSizeSuggestions'
import { createNamespacedHelpers } from 'vuex'
import debounce from 'lodash/debounce'
const { mapState } = createNamespacedHelpers('poster')
export default {
  name: 'textPanel',
  components: {
    fonts
  },
  data() {
    return {
      alignList: [
        {
          label: '左对齐',
          value: 'bbt-juzuo',
          attribute: 'textAlign',
          attributeValue: 'left'
        },
        {
          label: '居中对齐',
          value: 'bbt-juzhong',
          attribute: 'textAlign',
          attributeValue: 'center'
        },
        {
          label: '右对齐',
          value: 'bbt-juyou',
          attribute: 'textAlign',
          attributeValue: 'right'
        },
        {
          label: '加粗',
          value: 'bbt-jiacu1',
          attribute: 'fontWeight',
          attributeValue: true
        },
        {
          label: '斜体',
          value: 'bbt-xieti',
          attribute: 'italic',
          attributeValue: true
        },
        {
          label: '下划线',
          value: 'bbt-xiahuaxian',
          attribute: 'textDecoration',
          attributeValue: 'underline'
        },
        {
          label: '删除线',
          value: 'bbt-shanchuxian',
          attribute: 'textDecoration',
          attributeValue: 'line-through'
        }
      ],
      currentPopover: 'jianju',
      isFontSpaceChange: false
    }
  },
  computed: {
    ...mapState(['chunks', 'currentChunkIndex']),
    fontFamily: {
      get() {
        return this.chunks[this.currentChunkIndex].fontFamily
      },
      set(fontFamily) {
        this.chunks[this.currentChunkIndex].fontFamily = fontFamily
        this.$store.commit('poster/setStorageRecord')
      }
    },
    bgc: {
      get() {
        return `#${this.chunks[this.currentChunkIndex].color}`
      },
      set(color) {
        if (color) {
          let isChange = color !== this.bgc
          this.chunks[this.currentChunkIndex].color = color.replace('#', '')
          if (isChange) {
            this.$store.commit('poster/setStorageRecord')
          }
        }
      }
    },
    fontSize: {
      get() {
        // console.log(this.currentChunkIndex, ' - ', this)
        return this.currentChunkIndex
          ? this.chunks[this.currentChunkIndex].fontSize + ''
          : ''
      },
      set(val) {
        this.chunks[this.currentChunkIndex].fontSize = val
      }
    },
    xFontSpacing: {
      get() {
        return this.chunks[this.currentChunkIndex].xFontSpacing
      },
      set(val) {
        this.chunks[this.currentChunkIndex].xFontSpacing = val
      }
    },
    yFontSpacing: {
      get() {
        return this.chunks[this.currentChunkIndex].yFontSpacing
      },
      set(val) {
        this.chunks[this.currentChunkIndex].yFontSpacing = val
      }
    }
  },
  methods: {
    editText() {
      this.$store.commit({
        type: 'poster/setEditTextByicon',
        editTextByicon: true
      })
    },
    suggestions(query, cb) {
      cb(fontSizeSuggestions)
      this.fontSizeValidate(query)
    },
    handleSelect(item) {
      this.chunks[this.currentChunkIndex].fontSize = item.label
    },
    handleFontStyle(item) {
      let chunk = this.chunks[this.currentChunkIndex]
      let { attribute, attributeValue } = item
      if (attribute === 'textAlign') {
        chunk[attribute] = attributeValue
      } else {
        if (attribute === 'fontWeight' || attribute === 'italic') {
          chunk[attribute] = !chunk[attribute]
        } else {
          chunk[attribute] =
            chunk[attribute] === attributeValue ? '' : attributeValue
        }
      }
      this.$store.commit('poster/setStorageRecord')
    },
    stepFontSize(type) {
      if (type === 1) {
        this.fontSize++
      } else {
        if (this.fontSize <= 12) {
          this.fontSize = 12
        } else {
          this.fontSize--
        }
      }
    },
    fontSizeValidate: debounce(function (val) {
      if (!/^\d+(\.\d{1,2})?$/.test(val)) {
        this.fontSize = 12
      }
    }, 1000),
    onHandlerBarHide() {
      if (this.isFontSpaceChange) {
        this.$store.commit('poster/setStorageRecord')
      }
      this.isFontSpaceChange = false
    }
  },
  watch: {
    fontSize: {
      handler: debounce(function () {
        this.$store.commit('poster/setStorageRecord')
      }, 500)
    }
  }
}
</script>

<style lang="scss">
@import 'src/assets/scss/common';
.editor-text-panel {
  .editor-control-panel {
    padding: 10px;
    width: 40px;
    background-color: #f9f9f9;
    border-radius: 4px;
    border: 1px solid #ddd;
  }
  .fonts-wrap {
    .el-select {
      width: 100%;
      margin-bottom: 10px;
    }
    .el-autocomplete {
      .el-input__inner {
        padding-right: 40px;
      }
      .el-input {
        &::after {
          content: 'px';
          position: absolute;
          right: 46px;
          top: 12px;
        }
      }
    }
    .handle-size-btn {
      cursor: pointer;
    }
  }
  .font-style-wrap {
    display: flex;
    flex-wrap: wrap;
    padding: 8px 10px;
    border-radius: 4px;
    border: 1px solid #ddd;
    line-height: 2;
    .icon-wrap {
      box-sizing: border-box;
      width: 20%;
      text-align: center;
      border-right: 1px solid #ddd;
      line-height: 1;
      margin: 10px 0;
      font-size: 16px;
      cursor: pointer;
      &.no-border {
        border: 0;
      }
      &.active {
        color: $primary;
      }
    }
  }
}
.zi-jian-hang-ju-popover {
  .popover-handler-bar {
    display: flex;
    align-items: center;
    .el-slider {
      width: 100px;
      margin-right: 10px;
    }
    .label-wrap {
      margin-right: 10px;
    }
    .vaule-wrap {
      display: inline-block;
      width: 40px;
      text-align: center;
    }
  }
}
</style>
