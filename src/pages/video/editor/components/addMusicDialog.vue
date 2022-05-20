<template>
  <el-dialog
    title="上传音乐"
    v-model="isShow"
    @update:visible="(val) => $emit('update:visible', val)"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    custom-class="video-add-musics-dialog"
    width="30%"
  >
    <el-tabs v-model="activeName">
      <!-- <el-tab-pane label="本地上传" name="local"> -->
      <el-upload
        accept=".mp3"
        class="upload-demo"
        drag
        action="str"
        :http-request="handlerChange"
        :auto-upload="true"
        :before-upload="beforeAvatarUpload"
        multiple
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div
          class="el-upload__tip"
          slot="tip"
          :style="`margin-top:${qnfileName ? '30px' : ''}`"
        >
          仅支持Mp3格式，建议大小在2Mb以内，时长9～60秒。
        </div>
      </el-upload>
      <div class="upload-confirm-bar">
        <ul class="tips">
          <li>注意：视频自动从音乐片头开始，上传请自行裁剪</li>
        </ul>
      </div>
      <!-- </el-tab-pane> -->
    </el-tabs>
  </el-dialog>
</template>

<script>
// import imageSpace from 'components/imageSpace'
export default {
  name: 'addMusicDialog',
  emits: ['add-musics', 'update:visible'],

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    musics: {
      type: Array,
      default() {
        return []
      }
    }
  },
  components: {},
  data() {
    return {
      isShow: false,
      activeName: 'local',
      uploadedImages: [],
      tbImage: '',
      addTblmageLoading: false,
      fileList: [],
      musicTitle: ' ',
      playTime: 0,
      file2: {},
      nick: ''
    }
  },
  computed: {
    bbtApi() {
      return this.$store.state.bbtApi
    }
  },
  methods: {
    beforeAvatarUpload(file) {
      this.file2 = file
      // 文件类型进行判断
      const isAudio = file.type === 'audio/mp3' || file.type === 'audio/mpeg'
      // 限制上传文件大小 1M
      const isLt1M = file.size / 1024 / 1024 < 2

      if (!isAudio) {
        this.$message.error('上传文件只能是Mp3格式!')
        this.fileList = []
        return false
      } else {
        if (!isLt1M) {
          this.$message.error('上传文件大小不能超过 2MB!')
          this.fileList = []
          return false
        }
      }

      this.getTimes(file)
    },
    option() {
      if (this.playTime > 60) {
        this.$message.error('上传文件时长不能超过60秒!')
        this.fileList = []
      }
    },
    getTimes(file) {
      var content = file
      //获取录音时长
      var url = URL.createObjectURL(content)
      var audioElement = new Audio(url)
      audioElement.addEventListener('loadedmetadata', () => {
        this.audioDuration = parseInt(audioElement.duration)
        this.playTime = parseInt(audioElement.duration)
        // console.log(this.audioDuration);
      })
    },

    handlerChange(param) {
      this.musicTitle = param.file.name.slice(0, -4)
      // this.fileList = fileList

      let formData = new FormData()
      formData.append('file', param.file)
      // formData.append("fileId", "")  // 额外参数

      axios
        .post(
          '/template/video/uploadMp3.post?nick=' +
            this.nick +
            '&musicTitle=' +
            this.musicTitle,
          formData
        )
        .then((res) => {
          this.$message('上传成功')
          this.$emit('add-musics', this.musicTitle, res.data.data.subMsg) //通知父组件改变。
        })
        .catch((err) => {
          console.log(err)
        })
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
    },
    playTime: function () {
      this.option(this.file2)
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/common';
.video-add-musics-dialog {
  width: 650px;
  .el-upload-list--picture-card .el-upload-list__item {
    width: 110px;
    height: 110px;
  }
  position: relative;
  .el-dialog__header {
    padding-left: 20px;
    padding-top: 20px;
    padding-bottom: 10px;
  }
  .el-dialog__body {
    height: 356px;
    padding: 0px 20px;
  }
  .el-upload-dragger {
    margin-top: 10px;
  }
  .el-tabs__header {
    margin-bottom: 5px;
  }
  .el-upload-list__item {
    margin: 5px 30px;
    width: 360px;
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
  .el-upload {
    width: 100%;
    .el-upload-dragger {
      width: 100%;
    }
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
    float: left;
    text-align: left;
    color: $danger;
    height: 60px;
  }
  .upload-confirm-bar {
    padding-top: 20px;
    .el-button {
      float: right;
    }
  }
}
</style>
