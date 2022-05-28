<template>
  <el-dialog
    custom-class="tip"
    title="价格规则说明"
    v-model="isShow"
    append-to-body
    width="45%"
    top="20vh"
    @update:visible="(val) => $emit('update:visible', val)"
    :close-on-press-escape="false"
  >
    <div>
      <p>
        <strong>单件优惠价，</strong>
        购买单件商品时使用优惠后的到手价。
      </p>
      <p>
        1、系统计算的优惠类型有：单品优惠（前N价、预售价、活动报名价等）店铺宝、优惠券、品类购物券、跨店满减。
      </p>
      <p>
        2、计算方式：根据平行满减规则计算可直减优惠。如：商品活动报名价100元，有优惠券满100减10，优惠券满200减30，则单件
        优惠价为100-10=90元。
      </p>
    </div>

    <div>
      <p>
        <strong>多件凑单价，</strong>
        购买多件同店/跨店商品时使用优惠后的单件平均到手价。
      </p>
      <p>
        1、系统计算的优惠类型有：单品优惠（前N价、预售价、活动报名价等）店铺宝、优惠券、品类购物券、跨店满减。
      </p>
      <p>2、计算方式：</p>
      <p style="padding-left: 15px">
        1）选择凑多件时，根据填写件数的总价格作为门槛，计算可用优惠。如：商品价格100元，有优惠券满100减10，优惠券满200
        减30。选择凑2件，则多件凑单价为(200-30)/2=85元。
      </p>
      <p style="padding-left: 15px">
        2）选择凑跨店满减时，跨店满减优惠按折扣计算，其他优惠按单件可直减计算。如：商品价格100元，有优惠券满100减10，优
        惠券满200减30，跨店满减满300减40，选择凑跨店满减，则多件凑单价为100-10-(40/300*100)=76.67元
      </p>
      <div>
        <p>
          <strong>活动报名价，</strong>
          商品当前生效的单品优惠价格（前N价、预售价、活动报名价等）
        </p>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="() => $emit('update:visible', false)">
        我知道了
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'priceTagTip',
  components: {},
  emits: ['update:visible'],
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return { isShow: false }
  },
  computed: {},
  watch: {
    visible: {
      handler(val) {
        this.isShow = val
      },
      immediate: true
    }
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>
<style lang="scss">
.tip {
  .el-dialog__body {
    div {
      p {
        line-height: 25px;
        &:not(:first-child) {
          margin-top: 5px;
        }
      }
      &:not(:first-child) {
        margin-top: 30px;
      }
    }
  }
  .el-dialog__footer {
    text-align: left;
  }
}
</style>
