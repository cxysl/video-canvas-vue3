<template>
  <el-dialog
    class="price-tag-discount-edit"
    title="价签计算器"
    :visible.sync="isShow"
    append-to-body
    width="40%"
    top="15vh"
    @update:visible="(val) => $emit('update:visible', val)"
    :close-on-press-escape="false"
  >
    <div class="template-group">
      <template
        v-for="(temp, index) in templateArr"
        :key="'templateRadio' + index"
      >
        <el-radio
          v-model="templateRadio"
          :label="index"
          @click.native.prevent="templateClick(index)"
          border
        >
          <p class="name">{{ temp.name }}</p>
        </el-radio>
      </template>
      <div class="edit-template-name" v-if="templateRadio != -1">
        <span>模板名称：</span>
        <p
          class="template-name-p"
          v-if="!templateArr[templateRadio].editing"
          @dblclick="toEditByFont(templateRadio)"
        >
          {{ templateArr[templateRadio].name }}
          <i class="el-icon-edit" @click="toEditByFont(templateRadio)"></i>
        </p>
        <el-input
          v-else
          type="textarea"
          autosize
          placeholder="备注信息"
          v-model="templateArr[templateRadio].name"
          @blur="editingByFont(templateRadio)"
          @keyup.enter.native="editingByFont(templateRadio)"
        >
          {{ templateArr[templateRadio].name }}
        </el-input>
      </div>
    </div>
    <el-form ref="priceTagForm">
      <el-form-item class="shop-outer">
        <template slot="label">
          <el-checkbox v-model="shopOuter"></el-checkbox>
          <span style="margin: 0 6px">跨店铺优惠</span>
        </template>
        <div class="row">
          <div class="condition">
            <p>每满</p>
            <div class="input">
              <el-input
                placeholder="请输入"
                @input="checkDiscountArr"
                v-model="discountArr[0].condition"
              ></el-input>
              <p class="input-suffix">元</p>
            </div>
          </div>
          <div class="discount">
            <p>减</p>
            <div class="input">
              <el-input
                placeholder="请输入"
                @input="checkDiscountArr"
                v-model="discountArr[0].discount"
              ></el-input>
              <p class="input-suffix">元</p>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item class="shop-inner">
        <template slot="label">
          <el-checkbox v-model="shopInner"></el-checkbox>
          <span style="margin: 0 6px">店铺内优惠</span>
        </template>
        <template v-for="(item, index) in discountArr">
          <div :key="index" v-if="item.range == 1" class="row">
            <div class="condition">
              <p>满</p>
              <div class="input">
                <el-input
                  placeholder="请输入"
                  @input="checkDiscountArr"
                  v-model="item.condition"
                ></el-input>
                <p class="input-suffix">元</p>
              </div>
            </div>
            <div class="discount">
              <p>减</p>
              <div class="input">
                <el-input
                  placeholder="请输入"
                  @input="checkDiscountArr"
                  v-model="item.discount"
                ></el-input>
                <p class="input-suffix">元</p>
              </div>
            </div>
            <span
              v-if="index > 1"
              class="del-discount"
              @click="delDiscount(index)"
            >
              <i class="el-icon-delete"></i>
            </span>
          </div>
        </template>
      </el-form-item>
    </el-form>
    <div class="add-discount" @click="addDiscount">
      <i class="el-icon-plus"></i>
      <span style="color: #999999; margin-left: 4px">添加优惠层级</span>
    </div>

    <div v-if="isToSave" class="template-name">
      <el-input placeholder="请输入模板名称" v-model="templateName">
        <template slot="append">
          <el-button @click="saveTemplate">确定</el-button>
        </template>
      </el-input>
    </div>
    <div class="option-template" v-if="templateRadio != '-1'">
      <el-button
        :disabled="saveDisabled"
        class="update-template"
        @click="updateTemplate"
      >
        保存编辑
      </el-button>
      <el-button class="del-template" @click="delTemplate">删除模板</el-button>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-tooltip
        content="每位用户最多可存5个模板"
        :disabled="templateArr.length < 5"
        placement="top"
        class="item"
        effect="dark"
      >
        <el-button
          v-if="templateRadio == '-1'"
          :disabled="saveDisabled || templateArr.length >= 5"
          class="save-discount"
          @click="toSaveDiscount"
        >
          将此条件存为模板
        </el-button>
      </el-tooltip>
      <el-button @click="() => $emit('update:visible', false)">取 消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'priceTag',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShow: false,
      shopInner: true,
      shopOuter: true,
      discountArr: [
        { range: 0, condition: '', discount: '' },
        { range: 1, condition: '', discount: '' }
      ],
      templateArr: [],
      templateRadio: '-1',
      templateName: '',
      saveDisabled: false,
      isToSave: false
    }
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
  created() {
    this.getTemplate()
  },
  mounted() {},
  methods: {
    addDiscount() {
      if (this.discountArr.length >= 10) {
        this.$message.warning('抱歉，最多只能添加10个条件')
        return false
      }
      let dis = {
        range: 1,
        condition: '',
        discount: ''
      }
      this.discountArr.push(dis)
    },
    delDiscount(index) {
      this.discountArr.splice(index, 1)
    },
    checkDiscountArr(type) {
      let flag = true
      let reg = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/
      this.discountArr.some((item, index) => {
        if (!item.condition && !item.discount) {
          //都为空
          return true
        }
        if (!item.condition || !item.discount) {
          flag = false
        }
        if (!reg.test(item.condition) || !reg.test(item.discount)) {
          flag = false
          type == 'save' &&
            this.$message.warning('条件' + (index + 1) + '的金额格式输入不对！')
          return true
        }
        if (Number(item.condition) <= Number(item.discount)) {
          flag = false
          type == 'save' &&
            this.$message.warning(
              '条件' + (index + 1) + '的优惠金额大于优惠条件！'
            )
          return true
        }
      })
      this.saveDisabled = !flag
      return flag
    },
    templateClick(e) {
      e === this.templateRadio
        ? (this.templateRadio = '-1')
        : (this.templateRadio = e)
      if (this.templateRadio != '-1') {
        let arr = JSON.parse(
          JSON.stringify(this.templateArr[this.templateRadio].content)
        )
        this.discountArr.splice(1, this.discountArr.length - 1, ...arr)
        this.templateName = this.templateArr[this.templateRadio].name
      }
    },

    toEditByFont() {
      this.templateArr[this.templateRadio].editing = true
    },
    editingByFont() {
      this.templateArr[this.templateRadio].editing = false
      this.checkDiscountArr()
    },

    toSaveDiscount() {
      this.templateName = ''
      this.isToSave = true
    },
    getTemplate() {
      axios
        .get('/itemManage/listMarketings.get')
        .then((res) => {
          let data = res.data.data
          data.items.forEach((item) => {
            item.content = JSON.parse(item.content)
            item.editing = false
          })
          this.templateArr = data.items
        })
        .catch((err) => console.log(err))
    },
    saveTemplate() {
      if (this.templateName) {
        let content = JSON.stringify(this.discountArr.slice(1))
        let params = {
          content: content,
          name: this.templateName
        }
        this.templateRadio != '-1'
          ? (params.id = this.templateArr[this.templateRadio].id)
          : ''
        axios
          .post('/itemManage/savePromoteWatermarkMarketing.post', params)
          .then((res) => {
            if (res.data.status == 1) {
              this.$message.success('保存成功')
              this.isToSave = false
              this.getTemplate()
              this.templateName = ''
            }
          })
          .catch((err) => console.log(err))
      } else {
        this.$message.warning('模板名称不能为空')
      }
    },
    updateTemplate() {
      this.templateName = this.templateArr[this.templateRadio].name
      this.saveTemplate()
    },
    delTemplate() {
      let id = this.templateArr[this.templateRadio].id
      axios
        .post('/itemManage/deletePromoteWatermarkMarketing.post?id=' + id)
        .then(() => {
          this.$message.success('删除成功')
          this.templateArr.some((item, index) => {
            if (item.id == id) {
              this.templateArr.splice(index, 1)
              return true
            }
            this.templateRadio = '-1'
            this.templateName = ''
            this.isToSave = false
          })
        })
        .catch((err) => console.log(err))
    },
    submit() {
      console.log('设置完成')
      if (this.checkDiscountArr('save')) {
        if (this.$route.path == '/subpage/watermark/editor') {
          this.$store.commit({
            type: 'watermark/setPriceTagDiscount',
            discountArr: this.discountArr
          })
        } else if (this.$route.path == '/itemsManage/watermark/create/index') {
          this.$emit('update-discount', this.discountArr)
          /** TODO
           * 发消息给父组件
           */
        }

        this.$emit('update:visible', false)
      }
    }
  }
}
</script>
<style lang="scss">
.price-tag-discount-edit {
  .template-group {
    text-align: left;
    margin-bottom: 20px;
    label {
      // width: 120px;
      width: 16%;
      height: 40px;
      line-height: 40px;
      margin-right: 15px;
      text-align: center;
      padding: 0px;
    }
    .el-radio__input {
      display: none;
    }
    .el-radio__label {
      width: 120px;
      height: 40px;
      padding: 0px;
      .name {
        padding: 0px 4px;
        overflow: hidden;
        display: inline-block;
      }
    }
  }
  .edit-template-name {
    height: 38px;
    .template-name-p {
      display: inline-block;
    }
    span {
      line-height: 38px;
    }
    .el-textarea {
      display: inline-block;
      width: 200px;
      .textarea {
        display: inline-block;
        width: 200px;
      }
    }
  }
  .option-template {
    margin-top: 30px;
    // margin-left: 60px;
  }

  .template-name {
    // padding-left: 30px;
    margin-top: 30px;
    .el-input {
      width: 250px;
      .el-input-group__append {
        background-color: #409eff;
        color: #fff;
        border: 1px;
      }
    }
  }
  .save-discount {
    float: left;
  }
  .el-dialog__body {
    padding-bottom: 10px;
  }
  .el-form {
    .el-form-item {
      margin-bottom: 8px;
    }
    .el-form-item__label {
      width: 100%;
      text-align: left;
      font-weight: 600 !important;
    }
    .el-form-item__content {
      margin-left: 0px;
      padding-left: 24px;
    }
    .shop-outer,
    .shop-inner {
      .row {
        .discount,
        .condition {
          width: 42%;
          display: inline-block;
          p {
            display: inline-block;
            margin-right: 6px;
            text-align: right;
            width: 30px;
          }
          .input {
            display: inline-block;
            width: calc(100% - 36px);
            position: relative;
            .el-input {
              display: inline-block;
            }
            .input-suffix {
              display: inline-block;
              color: #999;
              position: absolute;
              right: 0px;
              margin-right: 0px;
              text-align: center;
            }
          }
        }
        .condition {
          margin-right: 12px;
        }
        .del-discount {
          margin-left: 5px;
          i {
            color: #ea9292;
            font-size: 14px;
          }
        }
        &:not(:last-child) {
          margin-bottom: 12px;
        }
      }
    }
  }
  .add-discount {
    cursor: pointer;
    margin-top: 18px;
    padding-left: 36px;
    i {
      font-size: 14px;
      font-weight: bolder;
    }
  }
}
</style>
