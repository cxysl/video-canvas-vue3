<template>
  <div class="poster-editor-top-bar">
    <el-row>
      <el-col :span="6" class="left-wrap">
        <logo-icon @click="logoClick"></logo-icon>
        <!-- <div class="logo" @click="logoClick"></div> -->
        <div class="undo-redo-wrap">
          <div
            class="icon-wrap"
            :class="{ disabled: currentStorageIndex === 0 }"
            @click="undo"
          >
            <div class="icon">
              <svg class="bbt-icon">
                <use xlink:href="#bbt-chexiao1"></use>
              </svg>
            </div>
            <div class="icon-text">撤销</div>
          </div>
          <div
            class="icon-wrap"
            :class="{
              disabled: currentStorageIndex === storageRecord.length - 1
            }"
            @click="redo"
          >
            <div class="icon">
              <svg class="bbt-icon">
                <use xlink:href="#bbt-fanhui"></use>
              </svg>
            </div>
            <div class="icon-text">返回</div>
          </div>
        </div>
        <div class="scale-wrap">
          <div class="scale">
            <i class="icon el-icon-minus" @click="setSize(0)"></i>
            <div v-if="feature === 'watermark'" class="scale-value-wrap">
              <span>{{ size }}%</span>
            </div>
            <el-tooltip
              v-else
              class="item"
              effect="dark"
              content="实际大小"
              placement="bottom"
            >
              <div class="scale-value-wrap" @click="setSize(2)">
                <span class="scale-value">{{ size }}%</span>
                <div class="full-screen-icon">
                  <svg class="bbt-icon">
                    <use xlink:href="#bbt-fullscreen"></use>
                  </svg>
                </div>
              </div>
            </el-tooltip>
            <i class="icon el-icon-plus" @click="setSize(1)"></i>
          </div>
          <div class="scale-title">缩放窗口</div>
        </div>
      </el-col>
      <el-col :span="12" class="mid-wrap">
        <!-- <template v-if="isShowHotAreas">
          <div class="hot-areas-tips">
            <el-button type="text" @click="toEdit">
              <i class="el-icon-arrow-left"></i>
              返回编辑海报
            </el-button>
            已添加的热区和链接将会自动保存，点击返回按钮或者收起热区边栏可继续编辑海报
          </div>
        </template> -->
        <div class="poster-title-wrap">
          <!-- {{
            modes[0] == 1
              ? '1:1尺寸'
              : modes[0] == 2
              ? '2:3尺寸'
              : modes[0] == 3
              ? '3:4尺寸'
              : ''
          }} -->
          <div v-if="feature === 'watermark'" class="chunk-btn">
            <el-radio-group v-model="mode" @change="switchMode">
              <el-radio-button
                v-for="(item, idx) in modeList"
                :key="'mode' + idx"
                :label="idx"
              >
                {{ item.name }}
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <!-- <template v-else-if="feature === 'poster'">
          <div class="poster-title-wrap" v-if="!isEditTitle">
            <span class="title">{{ title }}</span>
            <i class="edit-title-icon" @click="editTitle">
              <svg class="bbt-icon">
                <use xlink:href="#bbt-bianji1"></use>
              </svg>
            </i>
          </div>
          <el-input
            class="poster-title-input"
            @blur="isEditTitle = false"
            ref="posterTitle"
            v-model="title"
            v-else
          ></el-input>
        </template> -->
      </el-col>
      <el-col :span="6" class="right-wrap">
        <!-- <el-button style="margin-right:10px" @click="logoClick" v-if="$isQn">
          {{ feature === 'watermark' ? '返回水印选择页' : '返回海报选择页' }}
        </el-button> -->
        <!-- <el-popover
          placement="bottom-end"
          width="410"
          popper-class="poster-editor-top-bar-load-preview"
          trigger="hover"
          @show="getTbPreview"
          @hide="restTbPreview"
        >
          <el-image
            width="400px"
            v-loading="!Boolean(tbPreview)"
            :src="tbPreview"
          />

          <el-button style="margin-right: 10px" slot="reference" v-if="isTbWm">
            预览
          </el-button>
        </el-popover> -->
        <el-button
          v-loading.fullscreen.lock="loading"
          type="primary"
          element-loading-text="正在保存"
          @click="save(wmType === '0' ? 2 : 1)"
        >
          {{
            activityId
              ? isTbWm
                ? '确认替换'
                : '保存水印并替换'
              : isTbWm
              ? '下一步'
              : '保存'
          }}
        </el-button>
        <el-button
          v-if="feature === 'watermark' && wmType === '0' && !activityId"
          class="btn fr save mr20"
          @click="save(1)"
        >
          另存一份
        </el-button>
      </el-col>
    </el-row>
    <!-- <el-dialog
      :custom-class="`poster-editor-create-state-dialog ${
        posterType === '2' ? 'large' : ''
      }`"
      v-model:visible="isShowDialog"
      :close-on-click-modal="false"
    >
      <div class="poster-editor-create-state">
        <div :class="['state-icon', createState === 1 ? 'success' : 'failed']">
          <i
            :class="
              createState === 1 ? 'el-icon-circle-check' : 'el-icon-warning'
            "
          ></i>
        </div>
        <div class="state-title">
          {{ createState === 1 ? '保存成功' : '保存失败' }}
        </div>
        <div class="state-tips">{{ createMessage }}</div>
        <template v-if="createState === 1">
          <template v-if="posterType === '1' || posterType === '3'">
            <el-input
              type="textarea"
              v-model="code"
              @mouseover.native="$event.target.select"
              :autosize="{ minRows: 2, maxRows: 8 }"
            ></el-input>
            <div class="btn-wrap">
              <el-button
                @click="
                  open(
                    'https://isv09.bbs.taobao.com/detail.html?postId=8498942'
                  )
                "
              >
                查看投放教程
              </el-button>
              <el-button
                type="primary"
                v-clipboard="code"
                @success="onCopySuccess"
                @error="onCopyError"
              >
                复制代码并装修
              </el-button>
            </div>
          </template>
          <template v-else-if="posterType === '2'">
            <div class="btn-wrap">
              <el-button
                @click="
                  open(
                    '/helpdocdetail/categoryid=113&helpDocId=206&categroyparent=69'
                  )
                "
              >
                查看投放教程
              </el-button>
              <el-button
                type="primary"
                @click="
                  open(
                    'https://wangpu.taobao.com/wpFramework.htm#/wpdecorate/wpPageList/shop_index/index2/basic/1?tabId=0'
                  )
                "
              >
                装修店铺
              </el-button>
            </div>
            <div style="width: 1000px; height: 458px">
              <img
                src="https://img.alicdn.com/imgextra/i3/813529278/O1CN01gwBg8X2IPNK6vitLm_!!813529278.png"
              />
            </div>
          </template>
          <div class="btn-wrap" v-else>
            <el-button @click="open('/template/poster/myDesign', 'self')">
              我的海报
            </el-button>
            <el-button type="primary" @click="release">
              {{ activityId ? '返回活动' : '投放活动' }}
            </el-button>
          </div>
        </template>
      </div>
    </el-dialog> -->
    <div
      v-loading.fullscreen="showLoading"
      :element-loading-text="isTbWm ? '合成官方水印中' : '水印保存中'"
    ></div>
    <!-- <el-dialog
      title="提示"
      v-model:visible="showModal"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="msg-box"
      size="tiny"
      width="30%"
    >
      <div class="msg">
        <i
          :class="
            saveWaterMarkStatus === 1
              ? 'el-icon-circle-check'
              : 'el-icon-circle-cross'
          "
        ></i>
        <span
          class="msg"
          v-text="saveWaterMarkStatus === 1 ? '水印编辑成功' : saveMsg"
        ></span>
      </div>
      <div class="tips" v-if="saveWaterMarkStatus === 1">
        点击下面投放按钮可以投放到宝贝
      </div>
      <span slot="footer">
        <el-button
          type="primary"
          @click="publish"
          v-if="saveWaterMarkStatus === 1"
        >
          马上投放
        </el-button>
        <el-button
          type="primary"
          @click="toMyDesign"
          v-if="saveWaterMarkStatus === 1 && !$route.query.acId"
        >
          我的水印
        </el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
// import buildCode from '../../../utils/buildCode'
// import unawailWords from '../../../../../itemsManage/watermark/editor/unavailWords'
// import { convertToTbLayers } from '../canvas/components/convert/convert'
import { createNamespacedHelpers } from 'vuex'
import html2canvas from 'html2canvas'
const { mapState } = createNamespacedHelpers('poster')
export default {
  name: 'PosterEditorTopBar',
  props: {
    isShowHotAreas: Boolean
  },
  emits: ['toEdit'],
  data() {
    return {
      isEditTitle: false,
      loading: false,
      // isShowDialog: false,
      createState: 1,
      createMessage: '海报已经保存，快去投放吧',
      posterId: '',
      activityId: '',
      code: '',
      showModal: false,
      saveWaterMarkStatus: 0,
      saveMsg: '',
      publishData: {},
      // unavailWords: unawailWords,
      mode: 0,
      modes: [],
      modeList: [],
      showLoading: false,
      wmType: '',
      wmID: '',
      tbPreview: ''
    }
  },
  computed: {
    ...mapState([
      'size',
      'chunks',
      'currentSizeRange',
      'posterType',
      'canvasWidth',
      'canvasHeight',
      'bgc',
      'bg',
      'hotAreas',
      'storageRecord',
      'currentStorageIndex',
      'watermarkMode',
      'chunksWaterMarkArr',
      'tbDslInitData',
      'priceSwitch',
      'luBanBg',
      'isShowGift'
    ]),
    title: {
      get() {
        return this.$store.state.poster.title
      },
      set(val) {
        this.$store.commit({
          type: 'poster/setTitle',
          title: val
        })
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
    }
  },
  created() {
    this.activityId = this.$route.query.activityId
    this.wmType = this.$route.query.type
    this.wmID = this.$route.query.id
    if (this.feature === 'watermark') {
      this.modes = this.$route.query.modes.split(',')
      this.modes.forEach((mode) => {
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
    }
  },
  methods: {
    switchMode(ids) {
      console.log('ids', ids)
      this.$store.commit({
        type: 'poster/setChangeWmMode',
        changeWmMode: ids
      })
    },
    logoClick() {
      // if (this.$isQn) {
      //   let routeUrl = '/template/poster/all'
      //   if (this.$route.params.feature == 'watermark') {
      //     routeUrl = '/itemsManage/watermark/all'
      //   }
      //   this.$router.push(routeUrl)
      //   setTimeout(() => {
      //     location.reload()
      //   }, 300)
      // } else {
      window.location.href = '/'
      // }
    },
    editTitle() {
      this.isEditTitle = true
      this.$nextTick(() => {
        this.$refs.posterTitle.$el.nextSibling
          .querySelector('.el-input__inner')
          .focus()
        // console.log(this.$refs.posterTitle.$el.querySelector('.el-input__inner'))
      })
    },
    getWantDsl(dsl) {
      /**
       * 说明：
       * 编辑内容里面默认显示 价格公式
       * 预览和保存 显示兜底文案
       *
       * 赠品是否显示 isShowGift
       */
      let tbPriceTag = JSON.parse(window.sessionStorage.getItem('tbPriceTag'))
      console.log(dsl.layers.length)
      let chunks = []
      dsl.layers.forEach((item) => {
        if (!this.isShowGift && item.linkId != 0) {
          return
        }
        if (item.kind == 'controlTextLine1') {
          item.text = this.priceSwitch ? tbPriceTag.sellProfitString1 : ''
          item.textContent = this.priceSwitch
            ? tbPriceTag.sellProfitString1
            : ''
        } else if (item.kind == 'controlTextLine2') {
          item.text = this.priceSwitch ? tbPriceTag.sellProfitString2 : ''
          item.textContent = this.priceSwitch
            ? tbPriceTag.sellProfitString2
            : ''
        }
        chunks.push(item)
      })
      dsl.layers = chunks
      return dsl
    },
    // getTbPreview(optionType) {
    //   console.log('预览水印')
    //   let tbPriceTag = JSON.parse(window.sessionStorage.getItem('tbPriceTag'))
    //   let dsl = convertToTbLayers(this.tbDslInitData, this.chunks)
    //   let params = {
    //     templateDsl: JSON.stringify(this.getWantDsl(dsl)),
    //     taskType: 1
    //   }
    //   if (tbPriceTag) {
    //     /**
    //      * 1 普通合图，只把主图itemMajorPic+dynamicDatas合成；   (看兜底文案)
    //      * 2 自动价格合图，会合成itemMajorPic+dynamicDatas和自动价格图层。   (看价格公式)
    //      */
    //     params.taskType = 1 //tbPriceTag.priceMode == 3 ? 1 : 2
    //     if (tbPriceTag.priceMode == 2) {
    //       params.makeUpNum = tbPriceTag.priceRule.makeUpNum
    //       params.makeUpType = tbPriceTag.priceRule.makeUpType
    //       let num = Number(tbPriceTag.priceMode)
    //       params.priceExpressType =
    //         num == 1 ? 2 : num == 2 ? 3 : num == 3 ? 1 : 0
    //       params.sellProfitString1 = tbPriceTag.sellProfitString1
    //       params.sellProfitString2 = tbPriceTag.sellProfitString2
    //     }
    //   }
    //   // sessionStorage.setItem('wmPreviewImg', JSON.stringify(params))
    //   if (optionType == 'next') {
    //     return new Promise((resolve, reject) => {
    //       axios
    //         .post('/itemManage/watermark/previewImg.post', params)
    //         .then((res) => {
    //           resolve(res.data.data.previewUrl || '')
    //         })
    //         .catch((err) => {
    //           reject(err)
    //         })
    //     })
    //   } else {
    //     axios
    //       .post('/itemManage/watermark/previewImg.post', params)
    //       .then((res) => {
    //         this.tbPreview = res.data.data.previewUrl || ''
    //       })
    //       .catch((err) => {
    //         console.log('err', err)
    //         this.tbPreview = ''
    //       })
    //   }
    // },

    restTbPreview() {
      this.tbPreview = ''
    },
    setSize(type) {
      let currentSizeRange = 4
      if (type === 2) {
        currentSizeRange = 4
      } else {
        currentSizeRange =
          type === 1 ? this.currentSizeRange + 1 : this.currentSizeRange - 1
      }
      if (currentSizeRange <= 0) {
        currentSizeRange = 0
      }
      if (currentSizeRange >= 8) {
        currentSizeRange = 8
      }
      this.$store.commit({
        type: 'poster/setSize',
        index: currentSizeRange
      })
    },
    save(type) {
      console.log('保存', type)
      const rect = document
        .querySelector('.editor-canvas')
        .getBoundingClientRect()
      html2canvas(document.querySelector('.editor-canvas'), {
        width: rect.width,
        height: rect.height
      }).then(function (canvas) {
        setTimeout(() => {
          const pageData = canvas.toDataURL('image/jpeg', 1.0)
          const imgData = pageData.replace('image/jpeg', 'image/octet-stream')
          const imgName = '生成图片.jpg'
          const save_link = document.createElementNS(
            'http://www.w3.org/1999/xhtml',
            'a'
          )
          save_link.href = imgData
          save_link.download = imgName
          const event = document.createEvent('MouseEvents')
          event.initMouseEvent(
            'click',
            true,
            false,
            window,
            0,
            0,
            0,
            0,
            0,
            false,
            false,
            false,
            false,
            0,
            null
          )
          save_link.dispatchEvent(event)
        }, 5000)
      })

      // if (this.feature === 'poster') {
      //   this.savePoster()
      // } else if (this.feature === 'watermark') {
      //   if (this.isTbWm) {
      //     this.showLoading = true
      //     let flag = true
      //     this.chunks.forEach((item) => {
      //       if (
      //         this.luBanBg &&
      //         item.algoType == 'majorobject' &&
      //         item.kind == 'submajorobject'
      //       ) {
      //         item.src = this.luBanBg
      //       }
      //       // 官方水印先不做违禁词检测
      //       // if (item.type === 'text') {
      //       //   let i = this.unavailWords.length
      //       //   while (i--) {
      //       //     if (item.textContent.indexOf(this.unavailWords[i]) > -1) {
      //       //       flag = false
      //       //       this.showLoading = false
      //       //       return this.$message.error({
      //       //         showClose: true,
      //       //         message: `您编辑的水印含有淘宝违禁词：“${this.unavailWords[i]}”`
      //       //       })
      //       //     }
      //       //   }
      //       // }
      //     })
      //     if (!flag) {
      //       return
      //     }
      //     let tbWmActivity = JSON.parse(
      //       window.sessionStorage.getItem('tbWmActivity')
      //     )
      //     let tbPriceTag = JSON.parse(
      //       window.sessionStorage.getItem('tbPriceTag')
      //     )
      //     let params = {
      //       startTime: tbWmActivity.startTime,
      //       endTime: tbWmActivity.endTime,
      //       templateTagId: tbWmActivity.templateTagId,
      //       baseTemplateId: Number(this.wmID),
      //       priceMode: 1,
      //       priceExpressType: 1,
      //       sellProfitString1: '',
      //       sellProfitString2: '',
      //       mode: Number(this.$route.query.modes),
      //       outId: Number(tbWmActivity.outId),
      //       templateDsl: JSON.stringify(
      //         this.getWantDsl(
      //           convertToTbLayers(this.tbDslInitData, this.chunks)
      //         )
      //       )
      //     }
      //     if (tbPriceTag) {
      //       let num = Number(tbPriceTag.priceMode)
      //       params.priceMode = num
      //       params.priceRule = tbPriceTag.priceRule
      //       params.sellProfitString1 = tbPriceTag.sellProfitString1
      //       params.sellProfitString2 = tbPriceTag.sellProfitString2
      //       params.priceExpressType =
      //         num == 2
      //           ? 3
      //           : num == 3
      //           ? 0
      //           : num == 1
      //           ? this.priceSwitch
      //             ? 2
      //             : 0
      //           : 1
      //     }
      //     if (this.editAgain) {
      //       params.taskId = Number(this.wmID)
      //     } else if (this.isReplace) {
      //       params.taskId = Number(this.activityId)
      //     }
      //     if (this.isReplace) {
      //       axios
      //         .put('/itemManage/watermark/replaceV2.post', params)
      //         .then((res) => {
      //           if (res.data.status === 1) {
      //             this.$message.success({
      //               showClose: true,
      //               message: '操作成功，水印将在后台替换，请耐心等待'
      //             })
      //             this.$store.commit({
      //               type: 'watermark/setActivityId',
      //               activityId: ''
      //             })
      //             window.open('/itemsManage/watermark/activityList', '_self')
      //           }
      //         })
      //         .catch((err) => {
      //           console.log(err)
      //         })
      //     } else {
      //       axios
      //         .post('/itemManage/watermark/savePictagTask.post', params)
      //         .then(async (res) => {
      //           let taskId = res.data.data.taskId
      //           let imgTemp = await this.getTbPreview('next')
      //           let watermark = {
      //             modeDatas: [
      //               {
      //                 mode: Number(this.$route.query.modes),
      //                 id: taskId,
      //                 type: 'tbWm',
      //                 img: imgTemp,
      //                 startTime: tbWmActivity.startTime,
      //                 endTime: tbWmActivity.endTime
      //               }
      //             ]
      //           }
      //           this.showLoading = false
      //           sessionStorage.setItem('watermark', JSON.stringify(watermark))
      //           // this.$store.commit({
      //           //   type: 'SET_KEEPALIVE_ROUTE',
      //           //   keepAliveRoute: 'watermarkActivity'
      //           // })
      //           this.$store.commit({
      //             type: 'setSeparatedState',
      //             state: false
      //           })
      //           this.$router.push(
      //             `/itemsManage/watermark/create/index?modes=${this.$route.query.modes}&isTbWm=true`
      //           )
      //         })
      //         .catch((err) => {
      //           console.log('err', err)
      //           this.showLoading = false
      //         })
      //     }
      //   } else {
      //     this.saveWaterMark(type)
      //   }
      // }
    },
    saveWaterMark(type) {
      console.log('保存水印', type)
      // let modeDatas = []
      // let flag = true
      // if (!this.chunksWaterMarkArr || this.chunksWaterMarkArr.length === 0) {
      //   this.$message({
      //     message: '您的水印模板没有元素，无法投放',
      //     type: 'warning'
      //   })
      //   flag = false
      //   return false
      // }
      // if (!flag) {
      //   return
      // }
      // let modes = this.$route.query.modes.split(',')
      // let mesFlag = false
      // let isFirst = 0
      // let mes = ''
      // modes.forEach((item) => {
      //   let index = item - 1
      //   let name =
      //     item == 1
      //       ? '1:1主图'
      //       : item == 2
      //       ? '3:4主图'
      //       : item == 3
      //       ? '宝贝长图'
      //       : ''
      //   if (
      //     !this.chunksWaterMarkArr[index] ||
      //     this.chunksWaterMarkArr[index].length === 0
      //   ) {
      //     isFirst++
      //     mesFlag = true
      //     mes = isFirst == 1 ? name : mes + '、' + name
      //   }
      //   let priceTagTotal = 0
      //   this.chunksWaterMarkArr[index].forEach((item) => {
      //     if (item.priceTag) {
      //       priceTagTotal++
      //     }
      //   })
      //   if (priceTagTotal > 1) {
      //     this.$message({
      //       message: `您的 ${name} 模式存在多个价签，请修改`,
      //       type: 'warning'
      //     })
      //     flag = false
      //     return false
      //   }
      // })
      // if (mesFlag) {
      //   this.$message({
      //     message: `您的${mes}模式没有元素，无法投放`,
      //     type: 'warning'
      //   })
      //   flag = false
      //   return false
      // }
      // if (!flag) {
      //   return
      // }
      // this.chunksWaterMarkArr.forEach((chunks) => {
      //   chunks.forEach((item) => {
      //     if (item.type === 'text') {
      //       let i = this.unavailWords.length
      //       while (i--) {
      //         if (item.textContent.indexOf(this.unavailWords[i]) > -1) {
      //           flag = false
      //           return this.$message.error({
      //             showClose: true,
      //             message: `您编辑的水印含有淘宝违禁词：“${this.unavailWords[i]}”`
      //           })
      //         }
      //       }
      //     }
      //   })
      // })
      // if (!flag) {
      //   return
      // }
      // this.showLoading = true
      // // 透明度转换
      // this.chunksWaterMarkArr.forEach((chunks) => {
      //   chunks.forEach((item) => {
      //     item.opacity =
      //       item.opacity > 1
      //         ? parseFloat(item.opacity / 100.0).toFixed(2)
      //         : item.opacity
      //   })
      // })
      // modes.forEach((item) => {
      //   modeDatas.push({
      //     mode: parseInt(item),
      //     watermark: { chunks: this.chunksWaterMarkArr[item - 1] }
      //     // watermarkImageData: ''
      //   })
      // })
      // // console.log('modeDatas', modeDatas)
      // let params = {}
      // params.modeDatas = modeDatas
      // if (type === 2) {
      //   params.id = Number(this.wmID)
      // }
      // if (this.wmType == 1) {
      //   params.baseTemplateId = Number(this.wmID)
      // }
      // axios
      //   .post('/itemManage/watermark/createCustomziedWatermark.post', params)
      //   .then((res) => {
      //     this.showLoading = false
      //     this.saveWaterMarkStatus = res.data.status
      //     this.publishData = res.data.data
      //     if (res.data.status === 1) {
      //       let id = res.data.data.items[0].id
      //       this.$store.commit({
      //         type: 'watermark/setPriceTagWmId',
      //         wmId: id
      //       })
      //       if (this.activityId) {
      //         this.replace(id)
      //       } else {
      //         this.showModal = true
      //         this.saveMsg = res.data.msg
      //         this.publishData = res.data.data
      //       }
      //     } else {
      //       this.$notify.error({
      //         offset: 80,
      //         title: '保存水印失败！',
      //         message: res.data.msg
      //       })
      //     }
      //   })
      //   .catch((err) => {
      //     this.showLoading = false
      //     console.error(err)
      //   })
    },
    // replace(id) {
    //   axios
    //     .put('/itemManage/watermark/replace.put', {
    //       activityId: this.activityId,
    //       wmID: id,
    //       promoteType: 26
    //     })
    //     .then((res) => {
    //       if (res.data.status === 1) {
    //         this.$message.success({
    //           showClose: true,
    //           message: '操作成功，水印将在后台替换，请耐心等待'
    //         })
    //         this.$store.commit({
    //           type: 'watermark/setActivityId',
    //           activityId: ''
    //         })
    //         window.open('/itemsManage/watermark/activityList', '_self')
    //       }
    //     })
    //     .catch((err) => {
    //       this.isReplacing = false
    //       console.log(err)
    //     })
    // },
    // 保存海报
    savePoster() {
      console.log('保存海报')
      // eslint-disable-next-line
      // let { id, type, activityType, activityId } = this.$route.query
      // let posterContent = {
      //   chunks: this.chunks,
      //   width: this.canvasWidth,
      //   height: this.canvasHeight,
      //   backgroundColor: this.bgc,
      //   bg: this.bg
      // }
      // let data = {
      //   posterTitle: this.title,
      //   posterType: this.posterType,
      //   hotAreas: this.hotAreas,
      //   posterContent: JSON.stringify(posterContent)
      // }
      // if (activityType === '0') {
      //   data.posterId = id
      // } else {
      //   data.posterCustomId = id
      // }
      // if (activityId) {
      //   data.activityId = activityId
      // }
      // this.loading = true
      // axios
      //   .post('/template/poster/saveCustomPoster.post', data)
      //   .then((res) => {
      //     let data = res.data.data
      //     this.loading = false
      //     this.isShowDialog = true
      //     this.posterId = data.posterCustomId
      //     this.createState = 1
      //     this.createMessage = '海报已经保存，快去投放吧'
      //     this.posterPreview = data.posterPreview
      //     if (this.posterType === '1' || this.posterType === '3') {
      //       this.code = buildCode({
      //         id: data.posterCustomId,
      //         width: this.canvasWidth,
      //         height: this.canvasHeight,
      //         isFull: this.posterType === '1',
      //         img: data.posterPreview,
      //         hotAreas: this.hotAreas
      //       })
      //     }
      //   })
      //   .catch((err) => {
      //     this.loading = false
      //     this.isShowDialog = true
      //     this.createState = 0
      //     this.createMessage =
      //       err.data && err.data.msg ? err.data.msg : '保存失败'
      //     throw err
      //   })
    },
    //  投放
    publish() {
      sessionStorage.removeItem('watermark')
      let data = {
        modeDatas: this.publishData.items
      }
      sessionStorage.setItem('watermark', JSON.stringify(data))
      this.$store.commit({
        type: 'SET_KEEPALIVE_ROUTE',
        keepAliveRoute: 'watermarkActivity'
      })
      this.$store.commit({
        type: 'setSeparatedState',
        state: false
      })
      this.$router.push(
        `/itemsManage/watermark/create/index?modes=${this.$route.query.modes}${
          this.$route.query.acId ? '&option=restart' : ''
        }`
      )
    },

    //  我的设计
    toMyDesign() {
      // if (!this.$isQn) {
      window.location.href = '/itemsManage/watermark/myDesign'
      // } else {
      //   open('/itemsManage/watermark/myDesign')
      // }
    },
    open(link, target) {
      if (target === 'self' && !this.$isQn) {
        window.location.href = link
      } else {
        window.open(link)
      }
    },
    // 复制代码成功
    onCopySuccess() {
      this.open('https://wangpu.taobao.com/pcPageList.htm#/basic')
    },
    // 复制代码失败
    onCopyError() {
      this.$message.warning('复制失败，请手动复制')
    },
    release() {
      let path = ''
      let { type } = this.$route.query
      if (this.activityId) {
        path = `/poster/review?activityId=${this.activityId}&imgURL=${this.posterPreview}&type=${type}&posterId=${this.posterId}`
      } else {
        path = `/poster/apply?posterId=${this.posterId}&type=${type}`
      }
      // jump(
      //             `/poster/${
      //               activityId ? 'review' : 'apply'
      //             }?posterId=${posterId}&type=1&activityType=${posterType}&createType=1${
      //               activityId ? '&activityId=' + activityId : ''
      //             }`
      //           )
      this.open(path, 'self')
    },
    toEdit() {
      this.$emit('toEdit')
    },
    redo() {
      this.$store.commit('poster/redo')
    },
    undo() {
      this.$store.commit('poster/undo')
    }
  }
}
</script>

<style lang="scss">
@import './styles';
</style>
