<template>
  <!-- v-el-dialog-drag -->
  <el-dialog
    title="上传图片"
    v-model="isShow"
    @close="
      () => {
        $emit('update:visible', false)
      }
    "
    custom-class="video-add-images-dialog"
  >
    <div>
      <el-upload
        action="#"
        accept=".jpg,.jpeg,.png"
        :on-change="handlerChange"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        list-type="picture-card"
        :auto-upload="false"
        :file-list="fileList"
        multiple
        ref="upload"
      >
        <!-- :show-file-list="true"
      :with-credentials="true"
      multiple -->
        <el-icon><Plus /></el-icon>
      </el-upload>
      <div class="upload-confirm-bar">
        <ul class="tips">
          <li>1、上传图片建议2M以内，仅支持jpg、png格式</li>
          <li>2、视频最多支持制作{{ limitCount }}张图片</li>
        </ul>
        <el-button type="primary" @click="confirm">添加到编辑器</el-button>
      </div>

      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </div>
  </el-dialog>
</template>

<script>
// import imageSpace from 'components/imageSpace'
export default {
  name: 'addImagesDialog',
  emits: ['confirm', 'update:visible'],
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
      fileList: [],
      dialogVisible: false, // 预览大图
      dialogImageUrl: '' // 大图地址
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
      // let images = this.uploadedImages.map((item) => {
      //   return item.url
      // })
      let images = this.fileList.map((file) => {
        return file.url
      })
      this.$emit('confirm', images)
      this.uploadedImages = []
      this.$refs.upload.clearFiles()
      this.isShow = false
      this.$emit('update:visible', this.isShow)
    },
    changeShow(val) {
      console.log('变化', val)
      this.$emit('update:visible', val)
    },
    // eslint-disable-next-line no-unused-vars
    handlerChange(file, fileList) {
      this.fileList = fileList
    },
    handlePictureCardPreview(uploadFile) {
      this.dialogImageUrl = uploadFile.url
      this.dialogVisible = true
    },
    handleRemove(uploadFile) {
      console.log('uploadFile', uploadFile)
    },

    onFocus(event) {
      event.target.select()
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.isShow = val
      },
      immediate: true
    },
    dialogVisible(val) {
      if (!val) {
        this.dialogImageUrl = ''
      }
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
  .el-button {
    height: 40px;
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
