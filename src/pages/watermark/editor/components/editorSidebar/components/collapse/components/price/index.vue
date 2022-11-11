<template>
  <div class="wm-price">
    <div class="header">
      <p v-if="!isTbWm">老程价签</p>
      <div v-else class="tb">
        官方自动价签
        <p class="question" @click="openTips">?</p>
        <span class="tb-tip" @click="openTbTip">查看详细解释</span>
      </div>
    </div>
    <div class="content">
      <div v-if="!isTbWm" class="bbt-price">
        <div class="price-group">
          <div
            :class="[priceRadio == '1' ? 'is-checked' : '', 'pointer']"
            border
            @click="automaticPriceTag"
          >
            <p class="title">智能价签</p>
            <p class="tip">自动获取宝贝活动最低价</p>
          </div>
          <div
            :class="[priceRadio == '2' ? 'is-checked' : '', 'pointer']"
            border
            @click="openPriceTag"
          >
            <p class="title">价签计算器</p>
            <p class="tip">针对跨店满减，优惠券等计算价格</p>
          </div>
        </div>
      </div>
    </div>
    <!--
      @update:visible="(val) => (showPriceTip = val)"
      append-to-body
       -->
    <!-- <div class="wm-price-change-tip"> -->
    <el-dialog
      v-model="showPriceTip"
      custom-class="wm-price-change-tip"
      title="价格规则切换说明"
      append-to-body
      width="30%"
      top="25vh"
      :close-on-press-escape="false"
    >
      <p>1. 凑单价大于等于单件优惠价（劵后价）时，表达劵后价</p>
      <p>
        2.若商品为限购商品，且限购件数小于凑单件数时，表达单件优惠价（劵后价）
      </p>
      <p>3.当前商品无可用优惠时，表达活动报名价</p>
      <p>4.商品当前有前n优惠时，表达单件优惠价（劵后价）</p>
      <p>5.优惠变更时，系统会重新计算价格</p>
			<template #footer>
      <span style="text-align: left">
        <el-button type="primary" @click="() => (showPriceTip = false)">
          我知道了
        </el-button>
      </span>
		</template>
    </el-dialog>
    <!-- </div> -->
    <price-tag-tip v-model:visible="showTip"></price-tag-tip>
    <price-tag v-model:visible="showPriceTag"></price-tag>
  </div>
</template>

<script>
import priceTagTip from './components/priceTagTip'
import priceTag from './components/priceTag.vue'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('poster')
export default {
  name: 'PeiceTag',
  // inject: ['openUpgrade', 'isLimitFeature'],
  components: { priceTagTip, priceTag },
  props: {},
  emits: ['add-text'],
  data() {
    return {
      showTip: false,
      priceRadio: '1',
      priceRadioTb: '1',
      showPriceTag: false,
      multipleType: '0',
      itemsCount: 1,
      textLine1: '',
      textLine2: '',
      showPriceTip: false,
      priceSwitch: true,
      firstIn: true,
      pollStatus: null,
      timeout: 0,
      timeout2: 0,
      // showGiftTipDialog: false,
      noControlTextLine: false,
      haveGift: false
    }
  },
  computed: {
    isTbWm() {
      return this.$route.query.isTbWm == 'true'
    },
    ...mapState(['chunks', 'watermarkMode', 'isShowGift']),
    editAgain() {
      return this.$route.query.editAgain == 'true'
    },
    isReplace() {
      return this.$route.query.activityId
    },
    showGift: {
      get() {
        return this.isShowGift
      },
      set(val) {
        this.$store.commit({
          type: 'poster/setIsShowGift',
          isShowGift: val
        })
      }
    }
  },
  watch: {
    priceRadio(val) {
      this.$store.commit({
        type: 'watermark/setPriceTagType',
        priceTagType: Number(val)
      })
    },
    priceRadioTb(val) {
      this.updateTbPrice()
      this.$store.commit({
        type: 'poster/setPriceRadioTb',
        priceRadioTb: Number(val)
      })
      this.priceSwitch = val != 3
    },
    priceSwitch(val) {
      this.$store.commit({
        type: 'poster/setPriceSwitch',
        priceSwitch: val
      })
    },
    multipleType() {
      this.updateTbPrice()
    }
  },
  created() {},
  mounted() {
    this.updateTbPrice()
    if (this.editAgain || this.isReplace) {
      this.initDataInfo()
    }
    this.checkDslPrice()
  },
  unmounted() {
    this.pollStatus = null
    clearTimeout(this.timeout)
    clearTimeout(this.timeout2)
  },
  methods: {
    openTbTip() {
      window.open('https://www.yuque.com/lubanzhinengzhutu/rsqn42/vrfvyo')
    },
    checkDslPrice() {
      let pollChunks = () => {
        if (this.chunks.length > 0) {
          let haveControl = false
          this.chunks.some((item) => {
            if (haveControl && this.haveGift) {
              return true
            }
            if (
              item.kind == 'controlTextLine1' ||
              item.kind == 'controlTextLine2'
            ) {
              haveControl = true
            }
            if (item.linkId != '0') {
              this.haveGift = true
            }
          })
          if (!haveControl) {
            this.noControlTextLine = true
            this.priceRadioTb = '3'
          }
        } else {
          this.timeout2 = setTimeout(() => {
            pollChunks()
          }, 200)
        }
      }
      pollChunks()
    },
    openGiftTips() {
      // this.showGiftTipDialog = true
    },
    initDataInfo() {
      this.pollStatus = () => {
        if (JSON.parse(sessionStorage.getItem('initPirceTagInfo'))) {
          let tbPriceTag = JSON.parse(
            sessionStorage.getItem('initPirceTagInfo')
          )
          // console.log('initPirceTagInfo  ,', tbPriceTag)
          this.textLine1 = tbPriceTag.sellProfitString1
          this.textLine2 = tbPriceTag.sellProfitString2
          this.priceRadioTb = tbPriceTag.priceMode + ''
          this.multipleType = tbPriceTag.makeUpType + ''
          this.itemsCount = tbPriceTag.makeUpNum
          sessionStorage.removeItem('initPirceTagInfo')
          clearTimeout(this.timeout)
        } else {
          this.timeout = setTimeout(() => {
            this.pollStatus()
          }, 200)
        }
      }
      this.pollStatus()
    },
    updateTbPrice() {
      let tbPriceTag = {}
      tbPriceTag.priceMode = this.priceRadioTb
      tbPriceTag.sellProfitString1 = this.textLine1
      tbPriceTag.sellProfitString2 = this.textLine2
      if (this.priceRadioTb == 2) {
        tbPriceTag.priceRule = {
          makeUpType: Number(this.multipleType),
          makeUpNum: this.itemsCount
        }
      }
      // console.log('tbPriceTag', tbPriceTag)
      sessionStorage.setItem('tbPriceTag', JSON.stringify(tbPriceTag))
    },
    openTips() {
      this.showTip = true
    },
    automaticPriceTag() {
      this.priceRadio = '1'
      this.checkHavePriceTag()
    },
    openPriceTag() {
      this.checkHavePriceTag()
    },
    openPriceTips() {
      this.showPriceTip = true
    },
    checkHavePriceTag() {
      let flag = false
      this.chunks.some((chunk) => {
        if (chunk.priceTag) {
          flag = true
          return true
        }
      })
      if (!flag) {
        this.$message.info('检测到您未添加价签，已自动为您添加')
        this.$emit('add-text', 'priceTag')
      }
    },
    updateTextLine() {
      this.updateTbPrice()
    }
  }
}
</script>
<style lang="scss">
.wm-price {
  padding: 0 10px;
  .header {
    font-size: 16px;
    margin-bottom: 15px;
    .tb {
      position: relative;
      .question {
        display: inline-block;
        width: 18px;
        height: 18px;
        border: 1px solid #f90;
        border-radius: 50%;
        text-align: center;
        line-height: 18px;
        font-size: 16px;
        color: #f90;
        cursor: pointer;
        &:hover {
          opacity: 0.7;
        }
      }
      .tb-tip {
        position: absolute;
        right: 0;
        color: #409eff;
        font-size: 14px;
        cursor: pointer;
        &:hover {
          opacity: 0.7;
        }
      }
    }
  }
  .content {
    .tb-price,
    .bbt-price {
      .price-group {
        margin-top: 15px;
        .pointer {
          cursor: pointer;
        }
        .price-group-disabled {
          background: #f5f7fa;
        }
        label,
        div {
          width: 100%;
          height: 80px;
          padding: 0 10px;
          margin-left: 0px;
          border: 2px solid #dcdfe6;
          box-sizing: border-box;
          border-width: 2px;

          &.is-checked {
            border-color: #409eff;
          }
          &:not(:last-child) {
            margin-bottom: 10px;
          }
        }
        .el-radio__input {
          display: none;
        }
        .el-radio__label {
          padding: 5px 0;
        }
        .title {
          color: #333;
          line-height: 40px;
        }
        .tip {
          line-height: 30px;
          color: #999;
        }
      }
    }
    .el-form {
      margin-top: 15px;
      .el-form-item__label {
        width: 100%;
        color: #333;
        font-weight: 600;
        text-align: left;
      }
      .multiple-order {
        .el-form-item__content {
          .el-radio {
            margin-right: 0;
            .el-radio__label {
              color: #333;
              padding-left: 5px;
            }
          }
          .el-input {
            display: inline-block;
            margin: 0;
            width: 30px;
            .el-input__inner {
              height: 30px;
              text-align: center;
              padding: 0;
            }
          }
        }
      }

      .price-switch,
      .gift-switch {
        display: flex;
        justify-content: space-between;
        position: relative;
        .question {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 1px solid #999;
          border-radius: 50%;
          text-align: center;
          line-height: 16px;
          font-size: 14px;
          color: #999;
          cursor: pointer;
          z-index: 5;
          &:hover {
            opacity: 0.7;
          }
          margin-top: 9px;
          margin-left: 3px;
        }
        .el-switch {
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          .el-switch__label {
            color: #333;
          }
        }
      }
      .price-formula {
        .one {
          .tip {
            margin-left: 5px;
            color: #999;
          }
          position: relative;
        }
        color: #333;
        .el-input {
          margin-left: 0;
        }
      }
    }
  }
}
.wm-price-change-tip {
  .el-dialog__body {
    padding: 24px;
    p {
      margin: 5px 0;
    }
  }
}
.tb-wm-gift-tip {
  background: #f7f8fa;
  padding: 8px 10px;
  max-width: 246px;
  line-height: 18px;
  p {
    margin-bottom: 8px;
  }
  span {
    color: #1a5bf6;
    cursor: pointer;
    &:hover {
      opacity: 0.7;
    }
  }
}
.wm-gift-tip-dialog {
}
</style>
