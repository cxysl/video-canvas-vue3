<template>
  <div class="video-image-bar">
    <div class="title">
      图片
      <div>（{{ items.length }}/{{ limitCount }}）</div>
    </div>
    <div v-loading="isIniting" class="content">
      <ul class="image-list">
        <li
          v-for="(item, index) in items"
          :key="index"
          :class="{ 'can-del': items.length > 4 }"
          :style="frameStyles"
          @click="active = index"
        >
          <div class="img-container">
            <div class="item-img">
              <!-- <img :src="`${item}_100x100.jpg`" />
                :on-success="handlerUploadSuccess"-->
              <img :src="`${item}`" />
              <el-upload
                action="#"
                accept=".jpg,.jpeg,.png"
                :on-change="handlerChange"
                :before-upload="beforeUpload"
                :show-file-list="false"
                :with-credentials="true"
              >
                <div class="control">
                  <div class="tips">点击替换图片</div>
                  <div class="move">
                    <i
                      class="el-icon-caret-left"
                      @click.stop="move(index, 'left')"
                    ></i>
                    <i
                      class="el-icon-caret-right"
                      @click.stop="move(index, 'right')"
                    ></i>
                  </div>
                </div>
              </el-upload>
            </div>
          </div>
          <div class="del-btn" @click="delFrame(index)">
            <i class="el-icon-close"></i>
          </div>
        </li>
      </ul>
    </div>
    <div class="add-btn" @click="showAddImagesDialog">
      <i class="el-icon-plus"></i>
      添加图片
    </div>
    <add-images-dialog
      ref="addImagesDialog"
      v-model:visible="isShowAddImagesDialog"
      :count="items.length"
      @confirm="confirmAddImages"
    ></add-images-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import addImagesDialog from './addImagesDialog'
export default {
  name: 'ImageBar',
  components: {
    addImagesDialog
  },
  inject: ['limitCount'],
  props: {
    items: {
      type: Array,
      default() {
        return []
      }
    },
    canvasChange: {
      type: Boolean,
      default: false
    }
  },
  emits: ['videoReset', 'update:items', 'update:canvasChange'],
  data() {
    return {
      active: '',
      isShowAddImagesDialog: false,
      isIniting: false,
      qnfileName: '',
      qnBaseUrl: '',
      qnParams: {},
      qnFileType: 0
    }
  },
  computed: {
    ...mapState(['bbtApi', 'user']),
    frameStyles() {
      let singleWidth = Math.floor((100 / this.items.length) * 100) / 100
      return {
        width: `${singleWidth}%`
      }
    }
  },
  created() {
    if (this.$isQn) {
      this.initQnParams()
    }
  },
  methods: {
    move(index, direction) {
      let target,
        len = this.items.length,
        copy = [...this.items]
      if (direction === 'left') {
        target = index === 0 ? len - 1 : index--
      } else {
        target = index === len - 1 ? 0 : index++
      }
      let item = copy[index]
      copy[index] = copy[target]
      copy[target] = item
      setTimeout(() => {
        this.initComplete()
      }, 100)
      this.$emit('update:items', copy)
      this.$emit('update:canvasChange', true)
      this.$emit('videoReset')
    },

    //  上传图片前的校验
    beforeUpload(file) {
      let isAccept = /\.(jpg|jpeg|png)$/.test(file.name)
      if (!isAccept) {
        this.$message.warning({
          message: '只可上传.jpg，.jpeg，.png等后缀名的文件'
        })
        return false
      }
    },
    handlerChange(file) {
      let copy = [...this.items]
      copy[this.active] = URL.createObjectURL(
        new Blob([file.raw], {
          type: file.raw.type
        })
      )
      this.$emit('update:items', copy)
      this.$emit('videoReset')
    },
    // handlerUploadSuccess(res) {
    //   if (res.status === 1) {
    //     let copy = [...this.items]
    //     copy[this.active] = res.data.img
    //     this.$emit('update:items', copy)
    //     this.$emit('videoReset')
    //   } else {
    //     this.$message.warning({
    //       message: res.msg
    //     })
    //   }
    // },
    //  打开添加图片的弹窗
    showAddImagesDialog() {
      if (this.items.length < this.limitCount) {
        this.isShowAddImagesDialog = true
      } else {
        this.$message.warning({
          message: `最多只能制作${this.limitCount}图片的视频，如想修改请删除或者点击对应图片替换`
        })
      }
    },

    //  监听添加图片弹窗的确定事件
    confirmAddImages(newItems) {
			const currentItems = JSON.parse(JSON.stringify(items))
      if (Array.isArray(newItems)) {
        newItems.forEach((item) => {
          currentItems.push(item)
        })
      }
      this.isShowAddImagesDialog = false
      if (typeof newItems === 'string') {
        currentItems.push(newItems)
      }
      this.isShowAddImagesDialog = false
      this.$emit('update:items', [...currentItems])
      this.$emit('update:canvasChange', true)
      this.$emit('videoReset')
    },

    //  删除时间轴的图片
    delFrame(index) {
      let copy = [...this.items]
      copy.splice(index, 1)
      this.isIniting = true
      setTimeout(() => {
        this.initComplete()
      }, 100)
      this.$emit('update:items', copy)
      this.$emit('update:canvasChange', true)
      this.$emit('videoReset')
    },

    //  swf参数初始化完成的回调
    initComplete() {
      this.$refs.addImagesDialog.addTblmageLoading = false
      this.isIniting = false
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/common';
.video-image-bar {
  position: relative;
  height: 140px;
  background-color: #7e828c;
  border-bottom: 1px solid #4c515b;
  .title {
    line-height: 120px;
  }
  .image-list {
    margin-left: -5px;
    margin-right: -5px;
    // overflow-x: auto;
    // display: flex;
    // flex-wrap: nowrap;
    &:after,
    &:before {
      display: table;
      content: '';
    }
    &:after {
      clear: both;
    }
    li {
      position: relative;
      box-sizing: border-box;
      float: left;
      margin-top: 10px;
      padding: 0 5px;
      // min-width: 100px;
      &.can-del:hover {
        .del-btn {
          display: block;
          i {
            color: #fff;
            background: #ff4949;
            border-radius: 10px;
          }
        }
      }
      .img-container {
        box-sizing: border-box;
        height: 120px;
        padding: 10px;
        // background-color: #875ece;
        // background: linear-gradient(#9a6fe3, #875ece);
        // border: 1px solid #b99bed;
        background-color: var(--theme-color);
        background: linear-gradient(
          var(--theme-weaken-color-3),
          var(--theme-color)
        );
        border: 1px solid var(--theme-weaken-color-7);
        border-radius: 8px;
        cursor: pointer;
      }
      &:last-child {
        .img-container {
          margin-right: 0;
        }
      }
      .item-img {
        position: relative;
        max-width: 100px;
        max-height: 100px;
        text-align: center;
        &:hover {
          .control {
            opacity: 1;
            // opacity: 0.6;
          }
        }
        .control {
          position: absolute;
          max-width: 100px;
          width: 100%;
          height: 100px;
          opacity: 0;
          top: 0;
          left: 0;
          text-align: center;
          background-color: rgba(0, 0, 0, 0.6);
          // background-color: var(
          //   --theme-weaken-color-9
          // ); //rgba(var(--theme-weaken-color-10), 0.6);
          transition: all 0.3s;
          z-index: 2;
        }
        .tips {
          max-width: 50px;
          // max-height: 70px;
          height: calc(100% - 21px);
          display: flex;
          align-items: center;
          overflow: hidden;
          // color: #fff;
          color: var(--theme-weaken-color-7);
          line-height: 1.5;
          padding: 4px;
          margin: 0 auto;
        }
        .move {
          position: absolute;
          width: 100%;
          bottom: 4px;
          z-index: 3;
          i {
            // color: #fff;
            color: var(--theme-weaken-color-9);
            font-size: 18px;
            opacity: 0.7;
            transition: all 0.3s;
            &:hover {
              opacity: 1;
            }
            &.el-icon-caret-left {
              float: left;
            }
            &.el-icon-caret-right {
              float: right;
            }
          }
        }
      }
      img {
        max-height: 100%;
        max-width: 100%;
      }
      .del-btn {
        display: none;
        position: absolute;
        right: -4px;
        top: -10px;
        z-index: 2;
        font-size: 18px;
        width: 18px;
        height: 18px;
        line-height: 18px;
        color: $danger;
        cursor: pointer;
        // i {
        //   position: relative;
        //   &:after {
        //     content: '';
        //     position: absolute;
        //     width: 14px;
        //     height: 14px;
        //     // top: 2px;
        //     // left: 2px;
        //     background-color: #fff;
        //     border-radius: 10px;
        //     z-index: -1;
        //   }
        // }
      }
    }
  }
  .add-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 30px;
    height: 122px;
    box-sizing: border-box;
    color: #fff;
    // background-color: #875ece;
    // background: linear-gradient(#9a6fe3, #875ece);
    // border: 1px solid #b99bed;
    background-color: var(--theme-color);
    background: linear-gradient(
      var(--theme-weaken-color-4),
      var(--theme-weaken-color-2)
    );
    border: 1px solid var(--theme-weaken-color-7);
    padding: 4px;
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
      background: linear-gradient(darken(#9a6fe3, 5), darken(#875ece, 5));
      border-color: darken(#b99bed, 7);
      // background: linear-gradient(
      //   darken(var(--theme-weaken-color-3), 5),
      //   darken(var(--theme-color), 5)
      // );
      // border-color: darken(var(--theme-weaken-color-5), 5);

      background: linear-gradient(
        var(--theme-weaken-color-2),
        var(--theme-color)
      );
      border: 1px solid var(--theme-weaken-color-4);
    }
  }
  .el-loading-mask {
    background-color: rgba(0, 0, 0, 0.6);
  }
}
</style>
