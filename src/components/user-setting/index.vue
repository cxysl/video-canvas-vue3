<!--
 * @Author: Nahco.Huang
 * @Date: 2020-09-28 14:26:53
 * @LastEditTime: 2022-05-10 14:05:17
 * @LastEditors: chengsl
 * @Description: 个性化设置
-->

<template>
  <div class="user-setting">
    <div class="mask" :class="isOpen ? 'open' : 'close'" @click="closeButton" />
    <div class="drawer" :class="isOpen ? 'open' : 'close'">
      <div class="content">
        <el-scrollbar view-style="overflow-x:hidden;">
          <div class="button">
            <el-button type="primary" @click="saveSettingData">
              保存设置
            </el-button>
            <el-button type="text" @click="restoreDefault">
              <el-icon><refresh /></el-icon>
              恢复默认
            </el-button>
          </div>
          <el-divider />
          <div class="theme">
            <p class="title">颜色主题</p>
            <div class="color-list">
              <color-item
                v-for="item in colorOpitons"
                :key="item.code"
                :select="item.code === settingForm.themeCode"
                :color="item.color"
                @click.native="onSelectColorTheme(item)"
              />
            </div>
            <div class="color-input">
              <el-input
                v-model="customColor"
                placeholder="输入自定义颜色"
                clearable
                @keyup.native.enter="onSelectColorTheme(customColor, true)"
              ></el-input>
              <el-button
                type="primary"
                :disabled="!/^[#]{0,1}[0-9a-fA-F]{6}$/.test(customColor)"
                @click="onSelectColorTheme(customColor, true)"
              >
                确定
              </el-button>
            </div>
          </div>
          <el-divider />
          <div class="font-size">
            <p class="title">字体大小</p>
            <el-select
              v-model="settingForm.fontSize"
              :popper-append-to-body="false"
              placeholder="请选择字体大小"
              style="width: 244px"
              @change="onSelectFontSize"
            >
              <el-option
                v-for="item in fontSizeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </el-scrollbar>
      </div>

      <div v-if="isOpen" class="visible-button">
        <i class="el-icon-close" @click="closeButton" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ColorItem from './ColorItem.vue'
export default {
  name: 'UserSetting',
  components: {
    ColorItem
  },

  mixins: [],

  props: {},

  data() {
    return {
      positionY: 0,
      settingForm: {
        themeColor: '#008BFF',
        fontSize: '14'
      },
      colorOpitons: [
        { code: '01', color: '#008BFF', default: true },
        { code: '02', color: '#F1504A' },
        { code: '03', color: '#F1964A' },
        { code: '04', color: '#D8A056' },
        { code: '05', color: '#5ABA4A' },
        { code: '06', color: '#14C2C2' },
        { code: '07', color: '#7822ED' },
        { code: '08', color: '#222226' },
        { code: '09', color: '#E56C96' }
        // { code: '10', color: '#A268F2' }
      ],
      fontSizeOptions: [
        { label: '12px', value: '12' },
        { label: '14px（默认）', value: '14' },
        { label: '16px', value: '16' },
        { label: '18px', value: '18' },
        { label: '20px', value: '20' }
      ],
      customColor: ''
    }
  },

  computed: {
    ...mapState({
      themeColor: (state) => state.setting.themeColor,
      fontSize: (state) => state.setting.fontSize,
      isOpenSysConfig: (state) => state.setting.isOpenSysConfig
    }),
    isOpen: {
      get() {
        return this.$store.state.setting.isOpenSysConfig || false
      },
      set(val) {
        this.$store.commit('setting/SET_IS_OPEN_SYSCONFIG', !!val)
      }
    }
  },

  // V3 小型修复下，后面有空再优化需要大改： actions 里掉接口获取设置信息， 删掉反复查设置信息的接口极其业务实现的代码，settingForm放computed里
  watch: {
    themeColor(val) {
      this.settingForm.themeColor = val
    }
  },

  created() {
    this.getSettingData()
  },

  mounted() {},

  destroyed() {},

  methods: {
    // 更换字体大小
    updateFontSize(newSize) {
      document.body.style.setProperty('--font-size', newSize + 'px')
    },
    /**
     * @description: 获取个人设置数据
     */
    getSettingData() {
      document.body.style.setProperty('--font-size', this.fontSize + 'px')
      window.VM.$updateThemeColor(this.themeColor)
    },

    /**
     * @description: 处理主题选择
     * @param {object} item 选项对象
     */
    onSelectColorTheme(item, isCustom) {
      if (isCustom && !/^[#]{0,1}[0-9a-fA-F]{6}$/.test(item)) {
        return
      }
      // 更新表单对象
      let colorStr = isCustom ? item : item.color
      colorStr = colorStr.includes('#') ? colorStr : '#' + colorStr
      this.settingForm.themeColor = colorStr
      window.VM.$updateThemeColor(colorStr)

      // 提交到vuex
      this.$store.commit('setting/SET_THEME_COLOR', item.color)
    },

    /**
     * @description: 处理字体大小选择
     * @param {string} value 字体大小
     */
    onSelectFontSize(value) {
      this.updateFontSize(value)
      this.$store.commit('setting/SET_FONT_SIZE', value)
    },

    /**
     * @description: 恢复默认
     */
    restoreDefault() {
      // 复制默认配置
      this.$message('待开发')
    },

    /**
     * @description: 保存setting
     */
    async saveSettingData() {
      try {
        const data = {
          defaultIndexPage: this.settingForm.homePage,
          defaultTheme: this.settingForm.themeCode,
          defaultColorType: this.settingForm.themeColor,
          defaultTextStyle: this.settingForm.fontSize
        }
        localStorage.setItem('save-setting-data', JSON.stringify(data))
        this.isOpen = false
        this.$store.commit('setting/SAVE_SETTING_DATA')
      } catch (error) {
        //
      }
    },

    /**
     * 点击关闭按钮的监听事件
     */
    closeButton() {
      this.isOpen = false
    }
  }
}
</script>

<style lang="scss" scoped>
.user-setting {
  // z-index: 10;
  .mask {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.15);
    transition: all 0.5s;
    z-index: 10;
    &.close {
      display: none;
    }
    &.open {
      display: inline-block;
    }
  }
  .drawer {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    background-color: #ffffff;
    transition: all 0.5s;
    z-index: 9999;
    &.close {
      transform: translateX(100%);
    }
    .content {
      display: inline-block;
      width: 276px;
      height: 100vh;
      box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
      .title {
        font-size: 14px;
        margin-top: 0;
        margin-bottom: 8px;
      }
    }
    .visible-button {
      position: absolute;
      display: inline-block;
      top: 200px;
      left: -32px;
      width: 32px;
      height: 32px;
      background-color: var(--theme-color);
      border-radius: 4px 0 0 4px;
      color: #ffffff;
      font-size: 24px;
      line-height: 32px;
      text-align: center;
      // transition      : all 0.5s;
      cursor: pointer;
      i {
        line-height: 32px;
        display: inherit;
      }
    }
  }
}
.button {
  margin-bottom: 24px;
  .el-button {
    width: 116px;
  }
  .el-button + .el-button {
    margin-left: 12px;
  }
}
.color-list {
  display: flex;
  margin-bottom: 24px;
  .color-item + .color-item {
    margin-left: 8px;
  }
}
.color-input {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  .el-button {
    margin-left: 10px;
  }
}
.theme-list {
  display: flex;
  .theme-item + .theme-item {
    margin-left: 8px;
  }
}
.layout-list {
  display: flex;
  .layout-item:not(:first-child) {
    margin-left: 8px;
  }
}
::v-deep .el-scrollbar {
  height: 100%;
  .el-scrollbar__wrap {
    overflow-x: hidden;
    overflow-y: auto;
  }
  .el-scrollbar__view {
    padding: 16px;
  }
}
</style>
