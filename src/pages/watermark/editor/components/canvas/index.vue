<template>
  <div
    :class="[
      feature === 'watermark' ? 'position-top-canvas-container-outer-ring' : '',
      isCompatible ? 'canvas-containe-add-margin' : '',
      'canvas-container-outer-ring'
    ]"
  >
    <div
      class="poster-canvas-wrap"
      :style="{ paddingTop: `${feature === 'watermark' ? 0 : paddingTop}px` }"
      v-loading="loading"
    >
      <!--
        // 模式切换 移至 topBar
        <div class="chunk-btn" v-if="feature === 'watermark' && !isTbWm">
        <el-radio-group v-model="mode" @change="switchMode">
          <el-radio-button
            v-for="(item, idx) in modeList"
            :key="'mode' + idx"
            :label="idx"
          >
            {{ item.name }}
          </el-radio-button>
        </el-radio-group>
      </div> -->
      <div
        :class="
          feature === 'watermark' ? 'canvas-wrap-watermark' : 'canvas-wrap'
        "
        :style="styles"
      >
        <div
          class="canvas-container"
          :style="{ backgroundImage: editorBg ? `url(${editorBg})` : '' }"
        >
          <div class="editor-canvas" :class="{ lock: isLocked }">
            <div
              class="editor-bg"
              :class="{ active: isShowBgPanel }"
              @click="showBgPanel"
              :style="{
                backgroundColor:
                  feature === 'poster' ? bgc || 'transparent' : 'transparent'
              }"
            >
              <img
                :class="['bg-img', 'whh']"
                v-if="feature === 'watermark' && editorBg !== ''"
                :src="editorBg"
                :style="styles"
              />
              <img
                class="bg-img"
                v-else-if="feature === 'poster' && bg && bg.img"
                :src="bg.img"
                :style="bgStyles"
              />
            </div>
            <chunk
              :chunk="chunk"
              :index="index"
              v-for="(chunk, index) in chunks"
              :class="{
                drag: isDrag && index === active,
                active: selection.indexOf(index) > -1,
                editable: isLocked ? false : !chunk.locked
              }"
              v-show="
                (['controlTextLine1', 'controlTextLine2'].indexOf(chunk.kind) ==
                  -1 ||
                  priceSwitch) &&
                  (chunk.linkId == 0 || isShowGift)
              "
              :key="'chunk' + index"
              :ref="`chunk${index}`"
              @mousedown.native="chunkMousedown($event, index, true)"
            ></chunk>
            <span
              v-for="item in vLine"
              :key="'vline' + item.id"
              v-show="item.display"
              class="ref-line v-line"
              :style="{
                left: item.position,
                top: item.origin,
                height: item.lineLength
              }"
            />
            <span
              v-for="item in hLine"
              :key="'hline' + item.id"
              v-show="item.display"
              class="ref-line h-line"
              :style="{
                top: item.position,
                left: item.origin,
                width: item.lineLength
              }"
            />
            <!-- 间距 -->
            <div
              v-for="item in vBlock"
              :key="'vblock' + item.id"
              class="ref-block v-block"
              :style="{
                left: item.left + 'px',
                top: item.top + 'px',
                width: item.width + 'px',
                height: item.height + 'px'
              }"
            >
              <div class="topDiv"></div>
              <div class="bottomDiv"></div>
            </div>
            <div
              v-for="item in hBlock"
              :key="'hblock' + item.id"
              class="ref-block h-block"
              :style="{
                top: item.top + 'px',
                left: item.left + 'px',
                width: item.width + 'px',
                height: item.height + 'px'
              }"
            >
              <div class="leftDiv"></div>
              <div class="rightDiv"></div>
            </div>
            <!-- 智能价签提示 -->
            <div
              class="tooltip left"
              role="tooltip"
              v-if="isShowPriceTagTips"
              :style="{
                top: priceTagTipsStyle.top + 'px',
                left: priceTagTipsStyle.left + 'px'
              }"
              v-cloak
            >
              <div class="tooltip-arrow"></div>
              <div class="tooltip-inner">
                {{
                  bbtPriceType == 1 ? '智能价签' : '价签计算器'
                }}：投放时会同步宝贝实际活动价
              </div>
            </div>
          </div>
          <transform-tool
            v-if="isShowTransformTool"
            ref="transform"
            :is-multiple-drag="isMultipleDrag"
            @dragStart="transFormDragStart"
            @transform="transform"
            @transformHandleUp="transformHandleUp"
          ></transform-tool>
          <clip-bg :clip-wrap-styles="styles" v-if="isShowClipBg"></clip-bg>
        </div>
      </div>
      <!-- 底部操作按钮 -->
      <div class="inset-item-img" v-if="feature === 'watermark'">
        <el-button class="clear-editor-bg" @click="clearEditorBg">
          清除预览图
        </el-button>
        <el-button type="primary" @click="showItemList">
          插入宝贝主图预览
        </el-button>
      </div>
      <!-- 商品主图列表 -->
      <item-list
        v-if="feature === 'watermark'"
        ref="itemList"
        @confirm="insetItem"
        :modes="modes"
        :mode="watermarkMode + 1"
        :current="selectedInsetItems"
        :show.sync="isShowInsetItemList"
      ></item-list>

      <div
        v-if="isShowSelector"
        class="poster-selector"
        :style="selectorStyles"
      ></div>
    </div>
  </div>
</template>

<script>
import chunk from './components/chunk'
import { snapCheckLine, snapCheckBlock } from './components/snapCheck/snapCheck'
import { convertToChunks } from './components/convert/convert'
import throttle from 'lodash/throttle'
import transformTool from './components/transformTool'
import clipBg from './components/clipBg'
import itemList from '../../../../../itemsManage/watermark/editor/components/itemList'
// import tbChunks from './tbWatermark3'
import { createNamespacedHelpers } from 'vuex'
import hotkeys from 'hotkeys-js'
const { mapState } = createNamespacedHelpers('poster')
export default {
  name: 'posterCanvas',
  components: {
    chunk,
    transformTool,
    clipBg,
    itemList
  },
  props: {
    defaultLockedState: {
      type: Boolean,
      default: false
    },
    isShowOriginalSize: {
      type: Boolean,
      default: false
    },
    defaultChunks: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      paddingTop: 0,
      // isShowTransformTool: false,
      transformStyles: {},
      clickPostion: {},
      isMoving: false,
      lastX: '',
      lastY: '',
      isDrag: false,
      isSelect: false,
      isShowSelector: false,
      dragType: '',
      chunksPosition: [], //所有元素的位置
      isMultipleDrag: false,
      isLocked: false,
      selectorStyles: {
        width: '',
        height: '',
        left: '',
        top: ''
      },
      loading: false,
      rectCaches: [],
      //-----------兼容水印-----------------------------------------------------------
      wmID: '', //水印id
      wmType: '', //操作类型 0修改  1新增
      activityId: '', // 判断当前为编辑水印还是替换水印
      mode: 0, // 当前模式
      modeCopy: 0,
      modes: '',
      modeList: [], // 需要编辑的模式列表
      isShowInsetItemList: false,
      selectedInsetItems: [],
      isShowControls: false, // 控制显示变换工具
      isShowToolbar: false, // 控制显示元素工具条
      regionSelIndex: [], // 框选选中的元素的index值组成的数组
      fontFamily: 'SourceHanSansSC-Regular',
      editorChunks: [], // 画布里的元素
      cache: [], // 存放用户操作记录
      currentCache: [], // 用户当前的操作记录下标
      isShowPriceTagTips: false,
      editorBg: '',
      priceTagTipsStyle: {
        top: 0,
        left: 0,
        width: 236,
        height: 27
      },
      // chunksWaterMark: []
      //------- 辅助线--------------------------------------------------------------------
      vLine: [],
      hLine: [],
      mouseClickPositionTemp: {}, //解决吸附和元素移动产生冲突而引入
      //------- 等间距--------------------------------------------------------------------
      vBlock: [],
      hBlock: []
    }
  },
  created() {
    this.isLocked = this.defaultLockedState
    if (this.feature === 'poster') {
      if (this.defaultChunks.length > 0) {
        this.chunks = JSON.parse(JSON.stringify(this.defaultChunks))
        this.$store.commit({
          type: 'poster/setCurrentCanvasSize', // 设置可见区域的画布大小
          width: this.originalWidth,
          height: this.originalHeight
        })
      } else {
        window.addEventListener('resize', this.onWindowResize)
        this.$store.commit({
          type: 'poster/setResetCanvasState', //重置画布状态
          fn: this.setCanvasSize
        })
        this.setDefaultSize(this)
        // eslint-disable-next-line
        this.subscribeMutation = this.$store.subscribe((mutation, state) => {
          if (mutation.type === 'poster/setCanvasSize') {
            this.setDefaultSize(this)
          }
        })
        this.getChunks()
      }
      this.$store.commit({
        type: 'poster/switchBgPanel', // 切换背景编辑面板
        value: false
      })
      this.$store.commit({
        type: 'poster/setEditorCanvasInstance', // 设置画布的组件实例，有些地方会用到
        instance: this
      })
    } else if (this.feature === 'watermark') {
      this.wmID = this.$route.query.id
      this.wmType = this.$route.query.type
      this.modes = this.$route.query.modes
      let modes = this.modes.split(',')
      this.activityId = this.$route.query.activityId
      modes.forEach(mode => {
        if (mode == 1) {
          this.modeList.push({
            type: 1,
            name: '1:1主图',
            width: 800,
            height: 800
          })
        }
        if (mode == 2) {
          this.modeList.push({
            type: 2,
            name: '3:4主图',
            width: 750,
            height: 1000
          })
        }
        if (mode == 3) {
          this.modeList.push({
            type: 3,
            name: '宝贝长图',
            width: 800,
            height: 1200
          })
        }
      })
      this.$store.commit({
        type: 'poster/setWatermarkMode',
        watermarkMode: this.modes[0] - 1
      })
      this.$store.commit({
        type: 'poster/setSize',
        size: 90
      })
      if (this.isTbWm) {
        this.initTbWaterMark()
      } else {
        this.initWaterMark()
      }
    }
  },
  mounted() {
    document.documentElement.addEventListener('mousedown', this.posterWrapDown)
  },
  destroyed() {
    window.removeEventListener('resize', this.onWindowResize)
    document.documentElement.addEventListener('mousemove', this.move)
    document.documentElement.addEventListener('mouseup', this.handleMouseUp)
    document.documentElement.removeEventListener(
      'mousedown',
      this.posterWrapDown
    )
    if (this.subscribeMutation) {
      this.subscribeMutation()
    }
    hotkeys.unbind('up, down, left, right')
  },
  computed: {
    styles() {
      return {
        width: `${this.canvasWidth}px`,
        height: `${this.canvasHeight}px`
      }
    },
    feature() {
      return this.$route.params.feature
    },
    isTbWm() {
      return this.$route.query.isTbWm == 'true'
    },
    editAgain() {
      return this.$route.query.editAgain == 'true'
    },
    isReplace() {
      return this.$route.query.activityId
    },
    bgStyles() {
      let zoom = this.size / 100
      let { width, height, top, left } = this.bg
      return {
        width: `${width * zoom}px`,
        height: `${height * zoom}px`,
        top: `${top * zoom}px`,
        left: `${left * zoom}px`,
        transform: `matrix(${this.bg.transformX}, 0, 0, ${this.bg.transformY}, 0, 0)`
      }
    },
    ...mapState({
      isShowTransformTool: state => state.isShowTransformTool,
      sizeRange: state => state.sizeRange,
      originalWidth: state => state.canvasWidth,
      originalHeight: state => state.canvasHeight,
      canvasWidth: state => state.currentCanvasWidth,
      canvasHeight: state => state.currentCanvasHeight,
      bgc: state => state.bgc,
      bg: state => state.bg,
      active: state => state.currentChunkIndex,
      isShowBgPanel: state => state.isShowBgPanel,
      isShowClipBg: state => state.isShowClipBg,
      isCompatible: state => state.isCompatible,
      selection: state => state.selection,
      snapTolerance: state => state.snapTolerance,
      snapToleranceByBlock: state => state.snapToleranceByBlock,
      priceSwitch: state => state.priceSwitch,
      isShowGift: state => state.isShowGift,
      changeWmMode: state => state.changeWmMode
    }),
    bbtPriceType() {
      return this.$store.state.watermark.priceTag.priceTagType
    },
    isShowTransformTool: {
      get() {
        return this.$store.state.poster.isShowTransformTool
      },
      set(isShowTransformTool) {
        this.$store.commit({
          type: 'poster/setShowTransformTool',
          isShowTransformTool
        })
      }
    },
    luBanBg: {
      get() {
        return this.$store.state.poster.luBanBg
      },
      set(luBanBg) {
        this.$store.commit({
          type: 'poster/setLuBanBg',
          luBanBg: luBanBg
        })
      }
    },
    currentStorageIndex: {
      get() {
        return this.$store.state.poster.currentStorageIndex
      },
      set(currentStorageIndex) {
        this.$store.commit({
          type: 'poster/setCurrentStorageIndex',
          chunks: currentStorageIndex
        })
      }
    },
    chunksWaterMarkArr: {
      get() {
        return this.$store.state.poster.chunksWaterMarkArr
      },
      set(watermarkMode, chunks) {
        this.$store.commit({
          type: 'poster/setChunksWaterMarkArr',
          watermarkMode: watermarkMode,
          chunks: chunks
        })
      }
    },
    watermarkMode: {
      get() {
        return this.$store.state.poster.watermarkMode
      },
      set(watermarkMode) {
        this.$store.commit({
          type: 'poster/setWatermarkMode',
          watermarkMode
        })
      }
    },
    chunks: {
      get() {
        return this.$store.state.poster.chunks
      },
      set(chunks) {
        this.$store.commit({
          type: 'poster/setChunks',
          chunks
        })
      }
    },
    size() {
      if (this.isShowOriginalSize) {
        return 100
      } else {
        return this.$store.state.poster.size
      }
    }
  },
  methods: {
    //  计算智能价签的定位
    priceTagPostion() {
      let parentBounds = document
        .querySelector('.editor-canvas')
        .getBoundingClientRect()
      let chunkTemp = this.chunks[this.active]
      this.priceTagTipsStyle.left =
        (chunkTemp.left * this.size) / 100 -
        this.priceTagTipsStyle.width -
        9 +
        parentBounds.left
      this.priceTagTipsStyle.top =
        (chunkTemp.top * this.size) / 100 +
        chunkTemp.height / 2 -
        this.priceTagTipsStyle.height -
        2 +
        parentBounds.top
    },
    // 辅助线回调事件
    getRefLineParams(params) {
      const { vLine, hLine } = params
      let id = 0
      this.vLine = vLine.map(item => {
        item['id'] = ++id
        return item
      })
      this.hLine = hLine.map(item => {
        item['id'] = ++id
        return item
      })
    },

    // 等间距回调事件
    getRefBlockParams(params) {
      let zoom = this.size / 100
      const { vBlock, hBlock } = params
      let id = 0
      this.vBlock = vBlock.map(item => {
        item['id'] = ++id
        item.width *= zoom
        item.top *= zoom
        item.left *= zoom
        item.height *= zoom
        return item
      })
      this.hBlock = hBlock.map(item => {
        item['id'] = ++id
        item.width *= zoom
        item.height *= zoom
        item.left *= zoom
        item.top *= zoom
        return item
      })
    },

    onWindowResize() {
      this.setDefaultSize(this)
    },
    setDefaultSize: throttle(self => {
      let ch = window.innerHeight - 60 - 80
      let cw = window.innerWidth - 80 - 80
      let hs =
        ch / self.originalHeight >= 1
          ? 100
          : Math.floor((ch / self.originalHeight) * 100)
      hs = hs <= 20 ? 20 : hs
      let ws =
        cw / self.originalWidth >= 1
          ? 100
          : Math.floor((cw / self.originalWidth) * 100)
      ws = ws >= 400 ? 400 : ws
      let size = Math.min(hs, ws)
      let index = 0
      self.sizeRange.sort((a, b) => {
        if (size < a && size >= b) {
          index = self.sizeRange.indexOf(b)
        } else if (size === a) {
          index = self.sizeRange.indexOf(a)
        }
      })
      self.$store.commit({
        type: 'poster/setSize',
        size,
        index
      })
    }, 500),
    getTbWmActivity(params) {
      /**
       * 查活动的dsl 和 价签信息
       */
      return new Promise((resolve, reject) => {
        axios
          .get('/itemManage/watermark/editPicTagTaskWatermark.get', {
            params
          })
          .then(res => {
            console.log('res', res)
            let result = res.data.data.result
            let dsl = JSON.parse(result.templateDsl)

            let tbPriceTag = {}
            tbPriceTag.priceMode = result.priceMode
            tbPriceTag.sellProfitString1 = result.sellProfitString1
            tbPriceTag.sellProfitString2 = result.sellProfitString2
            tbPriceTag.makeUpType = result.makeUpType
            tbPriceTag.makeUpNum = result.makeUpNum
            sessionStorage.setItem(
              'initPirceTagInfo',
              JSON.stringify(tbPriceTag)
            )
            resolve(dsl)
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
      })
    },
    getTbWmChunks(params) {
      /**
       * 查模板的dsl
       */
      return new Promise((resolve, reject) => {
        axios
          .get('/itemManage/watermark/getOfficialChunks.get', { params })
          .then(res => {
            let dsl = res.data.data.DslObject
            resolve(dsl)
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
      })
    },
    async initTbWaterMark() {
      // console.log('tbChunks', tbChunks)
      if (this.wmID) {
        let dsl = {}
        if (this.editAgain) {
          // 重新编辑 通过 task 查
          let params = {
            taskId: this.wmID
          }
          dsl = await this.getTbWmActivity(params)
        } else if (this.isReplace) {
          /**
           * 替换水印
           * 水印内容通过 水印id查
           * 活动价签模式通过 活动id查
           */
          await this.getTbWmActivity({ taskId: this.$route.query.activityId })
          let params = {
            id: this.wmID,
            mode: this.modes
          }
          dsl = await this.getTbWmChunks(params)
        } else {
          // 创建官方水印
          let params = {
            id: this.wmID,
            mode: this.modes
          }
          dsl = await this.getTbWmChunks(params)
        }
        this.$store.commit({
          type: 'poster/setTbDslInitData',
          tbDslInitData: dsl
        })
        dsl.mode = this.modes
        let tbchunksNow = []
        tbchunksNow[this.modes - 1] = dsl
        this.convertToChunks(tbchunksNow)
      }
    },
    initWaterMark() {
      if (this.wmID) {
        axios
          .get('/itemManage/watermark/getChunks.get', {
            params: {
              [this.wmType === '1' ? 'id' : 'customizedId']: this.wmID,
              modes: this.modes
            }
          })
          .then(res => {
            if (res.data.status === 1) {
              this.formatChunks(res.data.data.modeDatas)
              this.editorChunks = this.chunksWaterMarkArr[this.watermarkMode]
            } else {
              this.$notify.error({
                title: '获取水印模块失败',
                message: res.data.msg
              })
            }
            this.$store.commit({
              // 设置可见区域的画布大小
              type: 'poster/setCurrentCanvasSize',
              width: this.modeList[this.mode].width * (this.size / 100),
              height: this.modeList[this.mode].height * (this.size / 100)
            })
            this.$store.commit({
              // 设置画布的原始大小
              type: 'poster/setCanvasSize',
              width: this.modeList[this.mode].width,
              height: this.modeList[this.mode].height
            })
            this.$store.commit({
              // 设置海报元素
              type: 'poster/setChunks',
              chunks: this.editorChunks
            })
            this.$store.commit('poster/setStorageRecord') // 存操作记录
            this.cache[this.mode] = this.$store.state.poster.storageRecord
          })
          .catch(err => {
            console.warn(err)
          })
      } else {
        //自定义水印
        this.editorChunks = []
        this.chunksWaterMarkArr = new Array(this.modeList.length).fill([])
        // this.cache = new Array(this.modeList.length).fill([[]])
        this.modeList.forEach(item => {
          let obj = {
            bgc: '',
            canvasHeight: item.height,
            canvasWidth: item.width,
            chunks: []
          }
          this.chunksWaterMarkArr[item.type - 1] = []

          this.cache.push([obj])
        })
        this.$store.commit({
          // 设置可见区域的画布大小
          type: 'poster/setCurrentCanvasSize',
          width: this.modeList[this.mode].width * (this.size / 100),
          height: this.modeList[this.mode].height * (this.size / 100)
        })
        this.$store.commit({
          // 设置画布的原始大小
          type: 'poster/setCanvasSize',
          width: this.modeList[this.mode].width,
          height: this.modeList[this.mode].height
        })
        this.$store.commit({
          // 设置海报元素
          type: 'poster/setChunks',
          chunks: this.editorChunks
        })
        let cache = {
          bgc: '',
          canvasHeight: this.modeList[0].height,
          canvasWidth: this.modeList[0].width,
          chunks: []
        }
        this.$store.commit({
          type: 'poster/setStorageRecordByWaterMark',
          storageRecord: [cache]
        })
      }
    },
    //获取海报内容
    getChunks() {
      let { id, type, activityType } = this.$route.query
      if (id) {
        let params = {
          posterId: id,
          posterType: type,
          isCustom: activityType === '1'
        }
        this.loading = true
        axios
          .get('/template/poster/getTemplatePosterSeriesContent.get', {
            params
          })
          .then(res => {
            this.loading = false
            let {
              backgroundColor,
              bg,
              chunks,
              height,
              width,
              hotAreas,
              posterTitle
            } = res.data.data
            if (type == 3) {
              height = parseInt(height * (950.0 / 750.0))
            }
            chunks.forEach(item => {
              item.adsorbing = ['false', 'false']
              if (!this.isTbWm) {
                item.canBeOption = true
              }
              item.transformX = item.transformX || 1
              item.transformY = item.transformY || 1
              item.xFontSpacing = item.xFontSpacing || 0
              item.yFontSpacing = item.yFontSpacing || 1
              item.rotate = item.rotate || 0
            })
            this.$store.commit({
              // 设置可见区域的画布大小
              type: 'poster/setCurrentCanvasSize',
              width: width * (this.size / 100),
              height: height * (this.size / 100)
            })
            this.$store.commit({
              // 设置画布的原始大小
              type: 'poster/setCanvasSize',
              width,
              height
            })
            if (bg && bg.img) {
              bg.scale = bg.scale || 1
              bg.opacity = bg.opacity || 1
              this.$store.commit({
                type: 'poster/setBg',
                bg: bg,
                isModifyOrigin: true
              })
            }
            this.$store.commit({
              // 设置背景颜色
              type: 'poster/setBgc',
              color: backgroundColor
            })
            this.$store.commit({
              // 设置海报标题
              type: 'poster/setTitle',
              title: posterTitle
            })
            this.$store.commit({
              // 设置海报元素
              type: 'poster/setChunks',
              chunks
            })
            this.$store.commit({
              // 设置热区信息
              type: 'poster/setHotAreas',
              hotAreas
            })
            this.$store.commit('poster/setStorageRecord') // 存操作记录
          })
          .catch(err => {
            this.loading = false
            throw err
          })
      } else {
        let viewSizeOptions = this.$store.state.poster.viewSizeOptions
        let { width, height } = viewSizeOptions[type || 0]
        this.$store.commit({
          type: 'poster/setCanvasSize',
          width,
          height
        })
        let bgTemp = this.bg
        bgTemp.width = width
        bgTemp.height = height
        this.$store.commit({
          type: 'poster/setBg',
          bg: bgTemp,
          isModifyOrigin: true
        })
      }
      this.$store.commit({
        type: 'poster/setPosterType',
        posterType: type
      })
    },
    //鼠标点下
    posterWrapDown(e) {
      if (
        [
          'poster-canvas-wrap',
          'canvas-wrap',
          'canvas-container',
          'editor-canvas',
          'editor-bg',
          'bg-img'
        ].indexOf(e.target.className) > -1 &&
        !this.isLocked
      ) {
        this.isDrag = false
        this.isShowTransformTool = false
        this.lastX = e.pageX
        this.lastY = e.pageY
        this.chunksPosition = [...document.querySelectorAll('.editor-el')].map(
          item => {
            let parentBounds = item.parentNode.getBoundingClientRect()
            return {
              width: item.offsetWidth,
              height: item.offsetHeight,
              top: item.offsetTop + parentBounds.top,
              left: item.offsetLeft + parentBounds.left
            }
          }
        )
        document.documentElement.addEventListener('mousemove', this.move)
        document.documentElement.addEventListener('mouseup', this.handleMouseUp)
      }
    },
    chunkMousedown(e, index, isSingle) {
      if (
        this.isLocked ||
        (index &&
          Object.hasOwnProperty.call(this.chunks[index], 'canBeOption') &&
          !this.chunks[index].canBeOption)
      ) {
        let item = this.chunks[index]
        console.log(
          '该模块不能操作--',
          index,
          '--',
          item.algoType,
          '--',
          item.kind
        )
        this.$store.commit({
          type: 'poster/setCurrentChunkIndex',
          index: ''
        })
        this.isShowTransformTool = false
        return false
      }
      this.$store.commit({
        type: 'poster/setCurrentChunkIndex',
        index
      })
      this.$store.commit({
        type: 'poster/switchBgPanel',
        value: false
      })
      this.lastX = e.clientX
      this.lastY = e.clientY
      this.isDrag = true
      if (isSingle) {
        this.isMultipleDrag = false
      }
      if (this.selection.length <= 1) {
        this.mouseClickPositionTemp.left = this.chunks[index].left
        this.mouseClickPositionTemp.top = this.chunks[index].top
        if (this.chunks[index].type == 'text' && this.chunks[index].priceTag) {
          this.isShowPriceTagTips = true
          this.priceTagPostion()
        } else {
          this.isShowPriceTagTips = false
        }
      }
      document.documentElement.addEventListener('mousemove', this.move)
      document.documentElement.addEventListener('mouseup', this.handleMouseUp)
    },
    move(e) {
      this.isPenetrate = false
      if (this.isDrag) {
        this.chunkMove(e, this) //拖拽
        if (
          this.active >= 0 &&
          this.selection.length <= 1 &&
          this.chunks[this.active].type == 'text' &&
          this.chunks[this.active].priceTag
        ) {
          this.isShowPriceTagTips = true
          this.priceTagPostion()
        }
      } else {
        this.selectChunks(e, this)
      }
    },
    // 框选
    selectChunks: throttle((e, self) => {
      self.isShowSelector = true //显示框选的蓝色背景框
      self.isSelect = true
      self.isShowTransformTool = false //显示矩阵（旋转）框
      // top减去顶部bar高度，left要减去sidebar的宽度
      let selectorTop = Math.min(e.pageY, self.lastY) - 60,
        selectorLeft = Math.min(e.pageX, self.lastX) - 80,
        selectorWidth = Math.abs(e.pageX - self.lastX),
        selectorHeight = Math.abs(e.pageY - self.lastY)
      self.selectorStyles = {
        top: `${
          self.feature === 'watermark' ? selectorTop - 31 : selectorTop
        }px`, //watermark多了一个提示占了31px高度
        left: `${self.isCompatible ? selectorLeft - 280 : selectorLeft}px`,
        width: `${selectorWidth}px`,
        height: `${selectorHeight}px`
      }
      self.chunksPosition.forEach((item, index) => {
        let top = Math.max(item.top, selectorTop + 60),
          right = Math.min(
            selectorLeft + 80 + selectorWidth,
            item.left + item.width
          ),
          bottom = Math.min(
            selectorTop + 60 + selectorHeight,
            item.top + item.height
          ),
          left = Math.max(selectorLeft + 80, item.left)
        if (bottom > top && right > left) {
          if (self.selection.indexOf(index) === -1) {
            self.selection.push(index)
          }
        } else {
          // 删除regionSelIndex数组里的index
          let elIndex = self.selection.indexOf(index)
          elIndex > -1 && self.selection.splice(elIndex, 1)
        }
      })
    }, 10),

    isAdsorbing(adsorbing, type) {
      return adsorbing.indexOf(type) > -1
    },
    moveByKey: throttle((self, moveType) => {
      self.isMoving = true
      self.isShowTransformTool = false
      self.isDrag = true
      let setPosition = index => {
        let isLevel = false,
          isVertical = false,
          step = 0
        isLevel = moveType && (moveType == 'left' || moveType == 'right') //水平微调移动
        isVertical = moveType && (moveType == 'up' || moveType == 'down') //竖直微调移动
        step = moveType == 'right' || moveType == 'down' ? 1 : -1
        // console.log('moveType:', moveType,'  isLevel:',isLevel,'  isVertical:',isVertical,'  step:',step)
        self.chunks[index].left = isLevel
          ? self.chunks[index].left + step
          : self.chunks[index].left

        self.chunks[index].top = isVertical
          ? self.chunks[index].top + step
          : self.chunks[index].top
      }
      if (self.isMultipleDrag) {
        self.selection.forEach(setPosition)
      } else {
        if (self.active !== '') {
          setPosition(self.active)
        }
      }
    }, 10),
    // 拖拽
    chunkMove: throttle((e, self) => {
      self.isMoving = true
      self.isShowTransformTool = false
      self.isDrag = true
      let distanceX = e.clientX - self.lastX
      let distanceY = e.clientY - self.lastY
      self.lastX = e.clientX
      self.lastY = e.clientY
      let zoom = self.size / 100
      let setPosition = index => {
        let adsorbing = self.chunks[index].adsorbing
        let leftAdsorbing = self.isAdsorbing(adsorbing, 'left')
        let topAdsorbing = self.isAdsorbing(adsorbing, 'top')
        // console.log("left:",leftAdsorbing,'~',self.mouseClickPositionTemp.left,"  top:",topAdsorbing,'~',self.mouseClickPositionTemp.top)

        self.chunks[index].left = !leftAdsorbing
          ? self.chunks[index].left + distanceX / zoom
          : self.chunks[index].left
        self.chunks[index].top = !topAdsorbing
          ? self.chunks[index].top + distanceY / zoom
          : self.chunks[index].top
        self.mouseClickPositionTemp.left =
          self.mouseClickPositionTemp.left + distanceX / zoom
        self.mouseClickPositionTemp.top =
          self.mouseClickPositionTemp.top + distanceY / zoom

        if (self.isMultipleDrag && self.rectCaches[index]) {
          self.rectCaches[index].left = self.chunks[index].left
          self.rectCaches[index].top = self.chunks[index].top
        }
      }
      // console.log(typeof setPosition)
      // 元素只有一个 || 框选  时不进行对齐检测
      if (self.chunks.length !== 1 && self.selection.length < 2) {
        snapCheckLine(self) // 对齐辅助线
        snapCheckBlock(self) // 等间距
      }
      if (self.isMultipleDrag) {
        self.selection.forEach(setPosition)
        self.rectCaches.selector.left += distanceX
        self.rectCaches.selector.top += distanceY
      } else {
        if (self.active !== '') {
          setPosition(self.active)
        }
      }
    }, 10),

    calcLineValues(arr) {
      // console.log('arr',arr)
      let zoom = this.size / 100
      const length = (Math.max(...arr) - Math.min(...arr)) * zoom + 'px'
      const origin = Math.min(...arr) * zoom + 'px'
      return { length, origin }
    },

    // 点击变换工具拖拽
    transFormDragStart(e) {
      this.isPenetrate = true
      this.chunkMousedown(e, this.active)
    },
    chunkMouseUp() {
      let el = this.chunks[this.active]
      let zoom = this.size / 100
      this.rectCaches = {}
      let transformStyles = {
        width: el.width * zoom,
        height: el.height * zoom,
        left: el.left * zoom,
        top: el.top * zoom,
        rotate: el.rotate
      }
      this.isShowTransformTool = true
      this.$store.commit({
        type: 'poster/setCurrentChunkIndex',
        index: this.active
      })
      this.$nextTick(() => {
        this.$refs.transform.setStyles(transformStyles)
        this.rectCaches.selector = { ...transformStyles }
      })
    },
    // 计算框选后的元素和变换工具的信息
    selectorMouseUp() {
      this.isShowSelector = false
      if (this.selection.length === 1) {
        this.$store.commit({
          type: 'poster/setCurrentChunkIndex',
          index: this.selection[0]
        })
        this.chunkMouseUp()
      } else {
        if (this.selection.length > 1) {
          let position = {
            width: [],
            height: [],
            top: [],
            left: []
          }
          if (this.isSelect) {
            this.rectCaches = {}
            this.selection.forEach(item => {
              let bounds = this.$refs[
                `chunk${item}`
              ][0].$el.getBoundingClientRect()
              position.width.push(bounds.width + bounds.left)
              position.height.push(bounds.height + bounds.top)
              position.top.push(bounds.top)
              position.left.push(bounds.left)
              let chunk = this.chunks[item]
              this.rectCaches[item] = {
                width: chunk.width,
                height: chunk.height,
                left: chunk.left,
                top: chunk.top,
                rotate: chunk.rotate
              }
            })
            let parentBounds = document
              .querySelector('.editor-canvas')
              .getBoundingClientRect()
            this.isShowTransformTool = true
            this.isMultipleDrag = true
            this.$nextTick(() => {
              let top = Math.min(...position.top) - parentBounds.top
              let left = Math.min(...position.left) - parentBounds.left
              let width = Math.max(...position.width) - parentBounds.left - left
              let height = Math.max(...position.height) - parentBounds.top - top
              let reactInfo = {
                top,
                left,
                width,
                height
              }
              this.$refs.transform.setStyles(reactInfo)
              this.rectCaches.selector = { ...reactInfo, rotate: 0 }
            })
          } else {
            this.isShowTransformTool = true
            this.isMultipleDrag = true
            this.$nextTick(() => {
              this.$refs.transform.setStyles({ ...this.rectCaches.selector })
            })
          }
        } else {
          this.isMultipleDrag = false
        }
        this.$store.commit({
          type: 'poster/setCurrentChunkIndex',
          index: ''
        })
      }
      this.$store.commit({
        type: 'poster/switchBgPanel',
        value: false
      })
    },
    // 鼠标松开
    handleMouseUp(e) {
      if (this.isMoving) {
        this.$store.commit('poster/setStorageRecord')
      }
      if (this.isPenetrate && !this.isMultipleDrag) {
        this.penetrateLayer(e)
      } else if (this.isDrag) {
        if (this.isMultipleDrag) {
          this.selectorMouseUp()
        } else if (this.active >= 0) {
          this.chunkMouseUp()
        }
      } else if (this.isSelect) {
        this.selectorMouseUp()
      } else {
        this.$store.commit({
          type: 'poster/setCurrentChunkIndex',
          index: ''
        })
        this.$store.commit({
          type: 'poster/switchBgPanel',
          value: false
        })
        this.$store.commit({
          type: 'poster/switchClipBg',
          value: false
        })
        this.isShowTransformTool = false
        this.$store.commit({
          type: 'poster/setSelection',
          selection: []
        })
      }
      this.isDrag = false
      this.isSelect = false
      this.isMoving = false
      this.isShowSelector = false
      // 初始化辅助线数据
      const temArr = new Array(3).fill({
        display: false,
        position: '',
        origin: '',
        lineLength: ''
      })
      const refLine = { vLine: [], hLine: [] }
      for (let i in refLine) {
        refLine[i] = JSON.parse(JSON.stringify(temArr))
      }
      // 初始化等间距数据
      const temArrBlock = new Array(
        this.chunks.length > 0 ? this.chunks.length - 1 : 0
      ).fill({
        left: '',
        top: '',
        width: '',
        height: ''
      })
      const refBlock = { vBlock: [], hBlock: [] }
      for (let i in refBlock) {
        refBlock[i] = JSON.parse(JSON.stringify(temArrBlock))
      }
      this.getRefBlockParams(refBlock) //鼠标松开 去掉 等间距
      this.chunks.forEach(item => {
        item.adsorbing = ['false', 'false']
      })
      this.vBlock = []
      this.hBlock = []
      this.getRefLineParams(refLine) //鼠标松开 去掉 辅助线
      document.documentElement.removeEventListener('mousemove', this.move)
      document.documentElement.removeEventListener(
        'mouseup',
        this.handleMouseUp
      )
    },
    // 穿透选择图层
    penetrateLayer(e) {
      let x = e.pageX
      let y = e.pageY
      let isFound = false
      for (let i = this.chunks.length - 1; i >= 0; i--) {
        if (i > this.active) {
          let targeBound = this.$refs[
            `chunk${i}`
          ][0].$el.getBoundingClientRect()
          let { left, top, width, height } = targeBound
          if (left <= x && left + width >= x && top <= y && top + height >= y) {
            this.$store.commit({
              type: 'poster/setCurrentChunkIndex',
              index: i
            })
            isFound = true
            break
          }
        }
      }
      if (isFound) {
        this.chunkMouseUp()
      }
      this.isPenetrate = false
    },
    transformHandleUp(selectorRect) {
      if (this.isMultipleDrag) {
        this.rectCaches = {}
        this.selection.forEach(item => {
          let chunk = this.chunks[item]
          this.rectCaches[item] = {
            width: chunk.width,
            height: chunk.height,
            left: chunk.left,
            top: chunk.top,
            rotate: chunk.rotate
          }
        })
        this.rectCaches.selector = { ...selectorRect }
      }
    },
    // 变换工具
    transform(postion, type, resizeScale, originalLeft, originalTop) {
      let { width, height, left, top, rotate } = postion
      let setChunkBound = item => {
        let currentChunk = this.chunks[item]
        let rect = this.rectCaches[item]
        let zoom = this.size / 100
        // 框选的变换操作
        if (this.isMultipleDrag) {
          if (type === 'rotate') {
            this.multipleRotate(currentChunk, rect, zoom, postion)
          } else {
            currentChunk.top =
              (currentChunk.top - originalTop / zoom) * resizeScale + top / zoom
            currentChunk.left =
              (currentChunk.left - originalLeft / zoom) * resizeScale +
              left / zoom
            currentChunk.width = currentChunk.width * resizeScale
            currentChunk.height = currentChunk.height * resizeScale
            if (currentChunk.type === 'text') {
              currentChunk.fontSize = (
                resizeScale * currentChunk.fontSize
              ).toFixed(1)
            }
          }
        } else {
          // 单选元素的变换操作
          if (
            (type === 'nesw-resize' || type === 'nwse-resize') &&
            currentChunk.type === 'text'
          ) {
            // let sizeScale = width / currentChunk.width
            currentChunk.fontSize = (
              resizeScale * currentChunk.fontSize
            ).toFixed(1)
          }
          currentChunk.top = top / zoom
          currentChunk.left = left / zoom
          currentChunk.rotate = rotate
          currentChunk.width = width / zoom
          currentChunk.height = height / zoom
        }
      }
      if (this.isMultipleDrag) {
        this.selection.forEach(setChunkBound)
      } else {
        setChunkBound(this.active)
      }
    },
    // 框选旋转
    multipleRotate(
      currentChunk,
      rect,
      zoom,
      { width, height, left, top, rotate }
    ) {
      // 框选的圆心坐标
      let x0 = (left + width / 2) / zoom
      let y0 = (top + height / 2) / zoom
      // 各元素的圆心坐标
      let x1 = rect.left + rect.width / 2
      let y1 = rect.top + rect.height / 2
      let moveRotate = rotate - this.rectCaches.selector.rotate
      let radian = (moveRotate * Math.PI) / 180
      let x = (x1 - x0) * Math.cos(radian) - (y1 - y0) * Math.sin(radian) + x0
      let y = (x1 - x0) * Math.sin(radian) + (y1 - y0) * Math.cos(radian) + y0
      currentChunk.top = rect.top + (y - y1)
      currentChunk.left = rect.left + (x - x1)
      currentChunk.rotate = (moveRotate + rect.rotate) % 360
    },
    setCanvasSize(size = this.size) {
      let zoom = size / 100
      this.$store.commit({
        type: 'poster/setCurrentCanvasSize',
        width: parseInt(this.originalWidth * zoom),
        height: parseInt(this.originalHeight * zoom)
      })
      // this.canvasWidth = parseInt(this.originalWidth * zoom)
      // this.canvasHeight = parseInt(this.originalHeight * zoom)
      let space = this.$el.offsetHeight - 80 - this.canvasHeight
      this.paddingTop = space <= 0 ? 0 : space / 2
      this.isShowTransformTool = false
      this.isDrag = false
      this.isSelect = false
      this.isMultipleDrag = false
    },
    setLockedState(val) {
      this.isLocked = val
    },
    showBgPanel() {
      if (this.feature == 'watermark') {
        return
      }
      if (!this.isLocked) {
        this.$store.commit({
          type: 'poster/switchBgPanel',
          value: true
        })
        this.$store.commit({
          type: 'poster/setCurrentChunkIndex',
          index: ''
        })
        this.isDrag = false
        this.isShowTransformTool = false
        this.isMultipleDrag = false
      }
    },
    // 兼容水印 开始
    // 切换当前编辑模式
    switchMode(idx) {
      //操作记录    由于水印是三个操作记录（cache）  store中只有一个
      // this.active = ''
      this.$store.commit({
        type: 'poster/setCurrentChunkIndex',
        index: ''
      })
      this.cache[this.modeCopy] = this.$store.state.poster.storageRecord
      this.$store.commit({
        type: 'poster/setStorageRecordByWaterMark',
        storageRecord: this.cache[idx]
      })
      //操作记录下标
      let storageIndex = this.$store.state.poster.storageRecord.length - 1
      this.$store.commit({
        type: 'poster/setCurrentStorageIndex',
        currentStorageIndex: storageIndex
      })

      // 元素块数组
      // this.chunksWaterMark[this.modeCopy] = this.$store.state.poster.chunks

      //去除焦点
      this.editBlur()
      this.mode = idx
      this.$store.commit({
        type: 'poster/setWatermarkMode',
        watermarkMode: this.modes.split(',')[idx] - 1
      })
      this.modeCopy = this.mode
      this.editorChunks = JSON.parse(
        JSON.stringify(this.chunksWaterMarkArr[this.watermarkMode])
      )
      this.$store.commit({
        // 设置海报元素
        type: 'poster/setChunks',
        chunks: this.editorChunks
      })
      this.$store.commit({
        // 设置可见区域的画布大小
        type: 'poster/setCurrentCanvasSize',
        width: this.modeList[this.mode].width * (this.size / 100),
        height: this.modeList[this.mode].height * (this.size / 100)
      })
      this.$store.commit({
        // 设置画布的原始大小
        type: 'poster/setCanvasSize',
        width: this.modeList[this.mode].width,
        height: this.modeList[this.mode].height
      })
      if (this.selectedInsetItems.length > 0) {
        this.insetItem(this.selectedInsetItems)
      }

      if (this.isTbWm && this.editorBg) {
        this.addItemBgByTb('add')
      }
    },
    // 使当前编辑的元素失焦
    editBlur() {
      this.$store.commit({
        type: 'poster/setShowTransformTool',
        isShowTransformTool: false
      })
    },
    showItemList() {
      this.$refs.itemList.getData()
      this.isShowInsetItemList = true
    },
    //  插入宝贝主图预览
    insetItem(items) {
      if (Array.isArray(items) && items[0]) {
        this.selectedInsetItems = items
        if (this.modeList[this.mode].type === 2) {
          this.editorBg = items[0].itemImgs[6]
            ? items[0].itemImgs[6].url
            : 'https://img.alicdn.com/imgextra/i2/17157061/O1CN01RWLfaK221zBGRdMLU_!!17157061.jpg'
        } else if (this.modeList[this.mode].type === 3) {
          this.editorBg = items[0].itemImgs[5]
            ? items[0].itemImgs[5].url
            : 'https://img.alicdn.com/imgextra/i4/17157061/O1CN01zmJfXj221zBFvVH53_!!17157061.jpg'
        } else {
          this.editorBg = items[0].itemImgs[0]
            ? items[0].itemImgs[0].url
            : items[0].img
        }
      }
      if (this.isTbWm) {
        this.addItemBgByTb('add')
      }
    },
    addItemBgByTb(type) {
      if (type == 'add') {
        //注意这里为了兼容看商品图片改了 图片地址 后面保存时需要改回来
        if (
          this.chunks[1].algoType == 'majorobject' &&
          this.chunks[1].kind == 'submajorobject'
        ) {
          this.luBanBg = this.chunks[1].src
          this.chunks[1].src = this.editorBg
        } else {
          this.chunks.forEach(chunk => {
            if (
              chunk.algoType == 'majorobject' &&
              chunk.kind == 'submajorobject'
            ) {
              this.luBanBg = chunk.src
              chunk.src = this.editorBg
            }
          })
        }
      } else if (type == 'clear') {
        if (
          this.chunks[1].algoType == 'majorobject' &&
          this.chunks[1].kind == 'submajorobject'
        ) {
          this.chunks[1].src = this.luBanBg
        } else {
          this.chunks.forEach(chunk => {
            if (
              chunk.algoType == 'majorobject' &&
              chunk.kind == 'submajorobject'
            ) {
              chunk.src = this.luBanBg
            }
          })
        }
      }
    },
    // 清除预览图
    clearEditorBg() {
      this.editorBg = ''
      this.selectedInsetItems = []
      if (this.isTbWm) {
        this.addItemBgByTb('clear')
      }
    },
    //官方水印转成我们的
    convertToChunks(modeData) {
      let modeDataTemp = convertToChunks(modeData)
      this.formatChunks(modeDataTemp)
      this.editorChunks = this.chunksWaterMarkArr[this.watermarkMode]
      this.$store.commit({
        type: 'poster/setCurrentCanvasSize',
        width: this.modeList[this.mode].width * (this.size / 100),
        height: this.modeList[this.mode].height * (this.size / 100)
      })
      this.$store.commit({
        type: 'poster/setCanvasSize',
        width: this.modeList[this.mode].width,
        height: this.modeList[this.mode].height
      })
      this.$store.commit({
        type: 'poster/setChunks',
        chunks: this.editorChunks
      })
      this.$store.commit('poster/setStorageRecord') // 存操作记录
      this.cache[this.mode] = this.$store.state.poster.storageRecord
    },
    formatChunks(modeData) {
      console.log('formatChunks --- modeData', modeData)
      modeData.forEach((data, idx) => {
        // let controlText = {}  //初始化兜底文案

        let chunks = data.chunks.map(item => {
          if (!item.xFontSpacing && item.type === 'text') {
            item.xFontSpacing = item.xFontSpacing || 0
            item.yFontSpacing = item.yFontSpacing || 1
            item.src = ''
          }
          if (!item.opacity) {
            item.opacity = 1
          }
          // if (this.isTbWm) {
          //   if (item.kind == 'controlTextLine1') {
          //     controlText.controlTextLine1 = item.textContent
          //   } else if (item.kind == 'controlTextLine2') {
          //     controlText.controlTextLine2 = item.textContent
          //   }
          // }
          item.textDecoration = item.textDecoration || '' //下划线、删除线
          // 方正黑体
          item.transformX = item.transformX || 1
          item.transformY = item.transformY || 1
          item.rotate = item.rotate || 0
          item.fontFamily =
            item.fontFamily === 'Microsoft YaHei'
              ? 'FZHei-B01'
              : item.fontFamily
          item.fontFamily =
            item.fontFamily === '思源黑体'
              ? 'SourceHanSansSC-Regular'
              : item.fontFamily
          item.adsorbing = ['false', 'false']
          if (!this.isTbWm) {
            item.canBeOption = true
          }
          return item
        })

        // this.$store.commit({
        //   type: 'poster/setControlTextLineArr',
        //   controlText: controlText,
        //   watermarkMode: data.mode - 1
        // })

        // // chunk数据
        // this.chunksWaterMark.push(chunks)

        //水印元素数组(初始化)
        this.$store.commit({
          type: 'poster/setChunksWaterMarkArr',
          watermarkMode: data.mode - 1,
          chunks: chunks
        })
        // 操作纪录
        let cache = {
          bgc: '',
          canvasHeight: this.modeList[idx].height,
          canvasWidth: this.modeList[idx].width,
          chunks: this.$store.state.poster.chunksWaterMarkArr[data.mode - 1]
        }
        let arr = []
        arr[0] = cache
        this.cache[idx] = arr
      })
    },
    bingKey() {
      let that = this
      console.log('重新绑定按键')
      hotkeys('up, down, left, right', function(event, handler) {
        switch (handler.key) {
          case 'left':
            that.moveByKey(that, 'left')
            break
          case 'up':
            that.moveByKey(that, 'up')
            break
          case 'right':
            that.moveByKey(that, 'right')
            break
          case 'down':
            that.moveByKey(that, 'down')
            break
          default:
          // console.log('you pressed other! ', event)
        }
      })
    }
  },
  watch: {
    size(val) {
      this.setCanvasSize(val)
    },
    changeWmMode(val) {
      this.switchMode(val)
    },
    active(val) {
      let that = this
      if (val === '') {
        this.isShowPriceTagTips = false
        console.log('解除按键绑定')
        hotkeys.unbind('up, down, left, right')
        if (this.selection.length >= 2) {
          that.bingKey()
        }
      } else {
        that.bingKey()
      }
      this.$store.commit({
        type: 'poster/setIsShowEditText',
        isShow: false
      })
      this.$store.commit({
        type: 'poster/setEditTextByicon',
        editTextByicon: false
      })
    }
  }
}
</script>

<style lang="scss">
@import './styles';
</style>
