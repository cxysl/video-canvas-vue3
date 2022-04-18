<template>
  <div class="scale-bar">
    <div class="title">时间轴</div>
    <div class="scale-rule content">
      <div class="units">
        <i class="unit long">
          <span class="num">0</span>
        </i>
        <i
          class="unit"
          v-for="item in duration * 10"
          :key="item"
          :class="[{ long: item % 10 === 0 }, { medium: item % 10 === 5 }]"
          :style="{ width: `${frame}%` }"
        >
          <span class="num" v-if="item % 10 === 0">
            {{ Math.floor(item / 10) }}
          </span>
          <s v-else></s>
        </i>
      </div>
      <!-- 进度条 -->
      <div class="hand-bar" :style="styles">
        <i class="arrow"></i>
        <i class="line"></i>
      </div>
    </div>
    <div class="bg-miusic" style="display: none">
      <audio id="canvas-music" :src="musicUrl" loop="loop">
        你的浏览器不支持audio标签。
      </audio>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('video')
export default {
  name: 'scaleBar',
  props: {
    duration: {
      type: Number,
      default: 9
    },
    musicUrl: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState(['isPlay']),
    frame() {
      let singleWidth = Math.floor((1000 / (this.duration * 100)) * 1000) / 1000
      return singleWidth
    },
    styles() {
      return {
        left: `${this.active * this.frame}%`
      }
    }
  },
  data() {
    return {
      active: 0,
      interval: null
    }
  },
  watch: {
    isPlay(newVal, oldVal) {
      if (!newVal && oldVal) {
        this.pause()
      }
    }
  },
  methods: {
    play() {
      //播放
      if (this.active >= this.duration * 10) {
        this.active = 0
      }
      clearInterval(this.interval)
      this.interval = setInterval(() => {
        if (this.active < this.duration * 10) {
          this.active++
        } else {
          clearInterval(this.interval)
        }
      }, 100)
      let audio = document.getElementById('canvas-music')
      audio.play()
    },
    pause() {
      //暂停
      clearInterval(this.interval)
      let audio = document.getElementById('canvas-music')
      audio.pause()
    },
    reset() {
      this.active = 0
      clearInterval(this.interval)
      let audio = document.getElementById('canvas-music')
      audio.pause()
      audio.currentTime = 0
      // audio.pause()
      // audio.load()
    }
  }
}
</script>

<style lang="scss">
.scale-bar {
  height: 24px;
  background-color: #7e828c;
  border-bottom: 1px solid #4c515b;
  .title {
    line-height: 24px;
  }
  .scale-rule {
    line-height: 24px;
    font-size: 0;
    .units {
      width: 100%;
      white-space: nowrap;
    }
    .unit {
      box-sizing: border-box;
      position: relative;
      display: inline-block;
      height: 4px;
      border-right: 1px solid #5d626e;
      vertical-align: bottom;
      &.long {
        height: 8px;
      }
      &.medium {
        height: 6px;
      }
      s {
        display: block;
        width: 100%;
        height: 100%;
      }
      .num {
        position: absolute;
        right: -4px;
        top: -20px;
        font-size: 12px;
        color: #d2d2d2;
      }
    }
    .hand-bar {
      position: absolute;
      bottom: -10px;
      z-index: 10;
      transition: all 0.1s;
      .arrow {
        display: block;
        width: 10px;
        height: 12px;
        background-image: url(https://img.alicdn.com/imgextra/i1/17157061/TB2qViopLImBKNjSZFlXXc43FXa-17157061.png);
        background-repeat: no-repeat;
      }
      .line {
        position: absolute;
        height: 254px;
        left: 5px;
        border-right: 1px dashed #d2d2d2;
      }
    }
  }
}
</style>
