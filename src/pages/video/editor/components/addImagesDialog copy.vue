<template>
  <el-dialog
    title="上传图片"
    v-model="isShow"
    @update:visible="(val) => $emit('update:visible', val)"
    custom-class="video-add-images-dialog"
  >
    <el-upload
      accept=".jpg,.jpeg,.png"
      :on-success="handlerUploadSuccess"
      :on-change="handlerChange"
      :on-error="handlerUploadError"
      :on-remove="handlerRemove"
      :before-upload="beforeUpload"
      :show-file-list="true"
      :with-credentials="true"
      list-type="picture-card"
      :auto-upload="false"
      :file-list="fileList"
      ref="upload"
      multiple
    >
      <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
    <div class="upload-confirm-bar">
      <ul class="tips">
        <li>1、上传图片建议2M以内，仅支持jpg、png格式</li>
        <li>2、视频最多支持制作{{ limitCount }}张图片</li>
      </ul>
      <el-button type="primary" @click="confirm">添加到编辑器</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import imageSpace from 'components/imageSpace'
export default {
  name: 'addImagesDialog',
  emits: ['confirm'],
  components: {
    // imageSpace
  },
  inject: ['limitCount'],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    //  当前已添加的图片数量
    count: Number
  },
  data() {
    return {
      isShow: false,
      activeName: 'local',
      uploadedImages: [],
      tbImage: '',
      addTblmageLoading: false,
      fileList: []
    }
  },
  computed: {
    bbtApi() {
      return this.$store.state.bbtApi
    }
  },
  created() {
    if (this.$isQn) {
      this.initQnParams()
    }
  },
  methods: {
    confirm() {
      if (this.fileList.length + this.count > this.limitCount) {
        this.$message.warning({
          message: `视频最多支持制作${this.limitCount}张图片`
        })
        return false
      }
      let images = this.uploadedImages.map((item) => {
        return item.url
      })
      this.$emit('confirm', images)
      this.uploadedImages = []
      this.$refs.upload.clearFiles()
      this.isShow = false
      this.$emit('update:visible', this.isShow)
    },
    handlerUploadSuccess(res, file) {
      if (res.status === 1) {
        this.uploadedImages.push({
          uid: file.uid,
          url: res.data.img
        })
      } else {
        this.$message.warning({
          message: res.msg
        })
      }
    },

    handlerUploadError(err, file) {
      this.$message.error({
        showClose: true,
        message: `“${file.name}”上传失败，请稍后再试`
      })
      console.log(err)
    },
    handlerRemove(file) {
      let fileIndex = ''
      this.uploadedImages.forEach((item, index) => {
        if (item.uid === file.uid) {
          fileIndex = index
        }
      })
      if (fileIndex !== '') {
        this.uploadedImages.splice(fileIndex, 1)
      }
    },
    beforeUpload(file) {
      if (this.fileList.length + this.count > this.limitCount) {
        this.$message.warning({
          message: `视频最多支持制作${this.limitCount}张图片`
        })
        return false
      }
      //  图片不能超过2M
      let isOverSize = file.size > 2097152
      let isAccept = /\.(jpg|jpeg|png)$/.test(file.name)
      if (!isAccept || isOverSize) {
        this.$message.warning({
          message: isOverSize
            ? '图片大小不能超过2M'
            : '只可上传.jpg，.jpeg，.png等后缀名的文件'
        })
        return false
      }
    },
    // eslint-disable-next-line no-unused-vars
    handlerChange(file, fileList) {
      this.fileList = fileList
    },
    //  添加淘宝图片空间的图片
    imageSpaceConfirm(imgs) {
      this.$emit('confirm', imgs)
      this.$refs.imageSpace.init()
      this.isShow = false
    },

    onFocus(event) {
      event.target.select()
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.isShow = val
        if (val && this.$isQn) {
          this.initQnParams()
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/common';
.video-add-images-dialog {
  // width: 950px;
  .img-upload {
    position: relative;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    width: 110px;
    height: 110px;
  }
  .el-upload-list--picture-card {
    .el-progress {
      width: 110px;
      .el-progress-circle {
        width: 110px !important;
        height: 110px !important;
      }
    }
  }
  .el-upload--picture-card {
    width: 110px;
    height: 110px;
    line-height: 110px;
  }
  .el-input-group__append {
    color: #fff;
    background-color: $primary;
    border: 1px solid $primary;
    transition: all 0.2s;
    &:hover {
      background-color: lighten($primary, 10);
    }
  }
  .tips {
    text-align: left;
    color: $danger;
    height: 60px;
  }
  .upload-confirm-bar {
    padding-top: 20px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: flex-end;
  }
}
</style>
