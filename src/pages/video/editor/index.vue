<template>
  <div class="video-editor">
    <div class="video-header">
      <div class="logo" @click="goToVideo"></div>
      <div class="title">主图视频编辑器</div>
      <el-button
        type="primary"
        class="create-btn"
        :loading="creating"
        @click="createVideo"
      >
        制作视频
      </el-button>
      <div class="current-duration">当前视频时长：{{ duration }}秒</div>
    </div>
    <div class="controler">
      <div class="material">
        <el-tabs v-model="active" type="border-card" class="tabs">
          <el-tab-pane label="视频效果模板" name="1">
            <materialVideo
              :items="styles"
              v-model:canvasChange="canvasChange"
              type="video"
              ref="video"
              @change="videoReset"
            ></materialVideo>
            <!-- <material :items="styles" type="video" ref="video" @change="videoReset"></material> -->
          </el-tab-pane>
          <el-tab-pane label="背景音乐" name="2">
            <!-- <material :items="musics" type="music" ref="music" @change="musicChange"></material>   @musics="getMusicsUp"   -->
            <materialMusic
              :musics="musics"
              v-model:canvasChange="canvasChange"
              @add-musics="addMusics"
              type="music"
              ref="music"
              @change="musicChange"
            ></materialMusic>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="player-wrap">
        <!-- 视频播放器 -->
        <!-- <div
          id="player"
          class="player-loading"
          v-loading="videoLoading"
          element-loading-text="拼命加载中"
        ></div> -->
        <bbt-canvas
          :mode="mode"
          :images="images"
          :videoStyle="videoStyle"
          v-model:isPlaying="isPlaying"
          @is-play="play()"
          v-if="!canvasChange"
          ref="bbtCanvas"
        ></bbt-canvas>
        <div
          :class="['canvas-control-btn', 'hide', isPlaying ? 'stop' : 'play']"
          @click="playVideo"
        ></div>
        <!-- 3：4 占位 遮板 -->
        <div :class="mode == 1 ? 'type1' : 'type3'">
          <div class="left"></div>
          <div class="center"></div>
          <div class="right"></div>
        </div>
      </div>
    </div>
    <div class="time-line">
      <scale-bar
        ref="scaleBar"
        :duration="duration"
        :musicUrl="nowMusicUrl"
      ></scale-bar>
      <text-bar></text-bar>
      <image-bar
        v-model:items="images"
        v-model:canvasChange="canvasChange"
        @move="videoReset"
        @videoReset="videoReset"
        ref="imageBar"
      ></image-bar>
      <music-bar
        :musics="musics"
        ref="musicBar"
        @handlerMusic="handlerMusic"
        @volumeControl="volumeControl"
      ></music-bar>
    </div>
    <ul class="video-editor-tips">
      <li>注意事项：</li>
      <li>
        1、主图视频制作默认为9秒，如需延长视频时间，请点击右侧添加图片，每张图片会增加
        2.25S ，例如上传了3张图，视频长度等于9s + 2.25*3 ≈ 16s
      </li>
      <li>2、主图视频最长支持60秒，如需更长时间请联系客服反馈</li>
      <li>
        3、渲染页面地址(测试)：http://template-cloud-server-daily.baobeituan.com/
      </li>
      <li>
        4、渲染页面地址(线上)：http://template-cloud-server.baobeituan.com:8080/
      </li>
    </ul>
  </div>
</template>

<script>
// import material from './components/material'
import materialMusic from './components/materialMusic'
import materialVideo from './components/materialVideo'
import scaleBar from './components/scaleBar'
import textBar from './components/textBar'
import musicBar from './components/musicBar'
import imageBar from './components/imageBar'
import bbtCanvas from './canvas'
import { mapState } from 'vuex'
import { video, musics } from './data'
export default {
  name: 'videoEditor',
  provide: {
    limitCount: 26
  },
  data() {
    return {
      styles: video,
      images: [],
      active: '1', // 1 显示视频特效，  2 显示音乐
      player: {},
      videoLoading: true,
      isUseMusic: true,
      creating: false,
      index: 0,
      getMusicByNickURL: '/template/video/getMusicByNick.post',
      nick: '', //tb979768_44
      musics: [],
      mode: 1,
      videoStyle: 1,
      canvasChange: false,
      isPlaying: false
    }
  },
  computed: {
    ...mapState(['user', 'bbtApi']),
    playerParams() {
      let data = {
        images: this.images,
        style: this.$refs.video.active,
        // musicUrl: this.isUseMusic ? `${this.musics[this.index].musicUrl}` : '', //不使用音乐地址就为空
        //musicUrl: this.isUseMusic ? this.musics[this.index].musicUrl : '',     //不使用音乐地址就为空
        autoPlay: false
      }

      return data
    },
    duration() {
      let len = this.images.length
      if (len === 0) {
        return 9
      } else {
        return Math.ceil(len * 2.25)
      }
    },
    nowMusicUrl() {
      return this.isUseMusic && this.musics.length > 0
        ? `${this.musics[this.index].musicUrl}`
        : '' //不使用音乐地址就为空
    }
  },
  created() {
    if (this.$route.query.mode != null) {
      this.mode = this.$route.query.mode //从url中那参数
    }
    this.getMusic()
  },
  mounted() {
    document.body.style.backgroundColor = '#7e828c'
    this.getImages()
  },

  destroyed() {
    document.body.style.backgroundColor = ''
  },
  methods: {
    goToVideo() {
      this.$router.push('/')
    },
    playVideo() {
      // this.canvasChange = true
      this.$nextTick(() => {
        // this.canvasChange = false
        this.isPlaying = !this.isPlaying
      })
    },
    // 获取音乐，包括上传的
    getMusic() {
      try {
        this.musics = musics
        this.$emit('musics', this.musics)
      } catch (error) {
        console.log('代码错误，', error)
        axios
          .post('/template/video/getMusicByNick.post', {
            nick: this.nick
          })
          .then(res => {
            this.musics = res.data.data
            this.$emit('musics', this.musics)
          })
          .catch(err => {
            this.musics = musics
            this.$emit('musics', this.musics)
            console.log(err)
          })
      }
    },
    addMusics(musicTitle, musicUrl) {
      this.musics.unshift({
        musicTitle: musicTitle,
        musicUrl: musicUrl
      })
    },

    handlerMusic() {
      // 点击音量条，显示音乐菜单，如果已经是那就没什么变化
      this.active = '2'
    },

    play() {
      //播放
      this.$store.commit({
        //存当前画到了第几张图片
        type: 'video/setIsPlay',
        isPlay: true
      })
      this.$refs.scaleBar.play()
    },
    pause() {
      //暂停
      this.$refs.scaleBar.pause()
    },
    //  获取商品主图
    getImages() {
      return new Promise((resolve, reject) => {
        axios
          .get('/template/video/getItemImages.get', {
            params: {
              itemId: this.$route.query.itemId || '589462069387',
              mode: this.mode || '1'
            }
          })
          .then(res => {
            resolve((this.images = res.data.data.images))
          })
          .catch(err => {
            this.images = [
              'https://img.alicdn.com/bao/uploaded/i2/813529278/O1CN01Civq0P2IPNCmhRuKS_!!0-item_pic.jpg',
              'https://img.alicdn.com/bao/uploaded/i2/813529278/O1CN01iCxNOs2IPNCn4jyLf_!!0-item_pic.jpg',
              'https://img.alicdn.com/bao/uploaded/i4/813529278/O1CN01WvBYgD2IPNCqyAEWE_!!0-item_pic.jpg',
              'https://img.alicdn.com/bao/uploaded/i4/813529278/O1CN019jRGzx2IPNCqPBmjA_!!0-item_pic.jpg'
            ]
            console.log(err)
            reject(err)
          })
      })
    },
    //  获取视频对象
    getPlayer(movieName) {
      return document.getElementById(movieName)
    },
    //  监听移动主图位置事件
    videoReset() {
      if (this.$refs.scaleBar) {
        this.$refs.scaleBar.reset()
        // this.getPlayer('player').setVideoParams(
        //   JSON.stringify(this.playerParams)
        // )
        this.$store.commit({
          type: 'video/restVideoState'
        })
        // this.$nextTick(() => {
        this.canvasChange = true
        // })
        this.$nextTick(() => {
          this.videoStyle = this.$refs.video.active
          this.isPlaying = false
          this.canvasChange = false
        })
        // this.$refs.bbtCanvas.specialCanvas()
      }
    },
    //  监听音乐切换事件
    musicChange(val) {
      if (this.$refs.musicBar) {
        var flag = false
        if (val < 0) {
          flag = false
          this.isUseMusic = false
        } else {
          flag = true
          this.isUseMusic = true
        }
        this.$refs.musicBar.setMusicState(flag ? 1 : 0)
        if (val < 0) {
          this.index = Math.abs(val + 1)
        } else {
          this.index = val
        }
        this.$refs.musicBar.setMusicId(this.index) // 哪个音乐
        this.videoReset()
      }
    },
    //  监听声音设置
    volumeControl(val) {
      // 音量控制  是否有声音
      this.isUseMusic = val === 1
      this.$refs.scaleBar.reset()
      let audio = document.getElementById('canvas-music')
      val === 0 ? audio.pause() : audio.play()
      audio.currentTime = 0
      // this.getPlayer('player').setVideoParams(JSON.stringify(this.playerParams))
    },
    //  生成视频
    createVideo() {
      this.creating = true
      let data = {
        itemId: this.$route.query.itemId,
        images: this.images,
        style: this.$refs.video.active,
        music: '',
        musicUrl: '',
        mode: this.mode
      }
      if (this.isUseMusic) {
        data.music = this.musics[this.index].id
        data.musicUrl = this.musics[this.index].musicUrl
      }

      // 新制作视频
      axios
        .post('/template/video/createV2.post', data)
        .then(() => {
          this.creating = false
          if (!this.$isQn) {
            window.location.href = '/template/video/index'
          } else {
            window.open('/template/video/index')
          }
        })
        .catch(err => {
          this.creating = false
          console.log(err)
        })
    },
    //  初始化swf参数的回调
    initParamsCallback(params) {
      this.$refs.imageBar.initComplete()
      console.log(`回调参数：${params}`)
    }
  },
  components: {
    materialMusic,
    materialVideo,
    scaleBar,
    musicBar,
    textBar,
    imageBar,
    bbtCanvas
  }
}
</script>

<style lang="scss">
@import './styles.scss';
</style>
