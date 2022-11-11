<template>
  <div class="music-bar">
    <div class="title">
      音乐
      <!--    volumeControl：  音量控制  -->
      <span class="music-icon" @click="volumeControl">
        <laocheng-icon
          size="14"
          :icon="state === 1 ? 'laocheng-icon-laba' : 'laocheng-icon-jinyin'"
        ></laocheng-icon>
      </span>
      <!--  音量图标切换  -->
      <!-- <svg class="bbt-icon">
          <use :xlink:href="state === 1 ? '#bbt-laba' : '#bbt-jingyin'"></use>
        </svg> -->
    </div>
    <div class="content">
      <!-- <div class="area" :class="{disabled: state === 0}" @click="handler">钢琴曲{{currentMusicId}}.mp3</div> -->
      <div class="area" :class="{ disabled: state === 0 }" @click="handler">
        {{ currentMusicName }}.mp3
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MusicBar',
  props: {
    // 获取父组件发来数据
    musics: {
      type: Array,
      default() {
        return []
      }
    }
  },
  emits: ['handlerMusic', 'volumeControl'],
  data() {
    return {
      state: 1, //音频条使用切换  是否禁音
      currentMusicId: 1, //当前音乐  id
      currentMusicName: ''
    }
  },
  // 由于生命周期时间的问题  在created() 、mounted() 拿不到父组件传来的参数musics,下面通过监听
  watch: {
    //监听父组件传参是否传过来了，传过来了就给 musicTitle 赋初始值
    musics: function (newVal) {
      this.currentMusicName = newVal[0].musicTitle //newVal即是musics
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.currentMusicName = this.musics[0].musicTitle //newVal即是musics
    })
  },

  methods: {
    handler() {
      this.$emit('handlerMusic')
    },
    volumeControl() {
      // 音量控制  是否有声音
      this.state = this.state === 1 ? 0 : 1
      this.$emit('volumeControl', this.state)
    },
    setMusicId(val) {
      this.currentMusicName = this.musics[val].musicTitle
      this.currentMusicId = val
    },
    setMusicState(val) {
      this.state = val
    }
  }
}
</script>

<style lang="scss">
.music-bar {
  height: 60px;
  background-color: #5d626e;
  border-bottom: 1px solid #4c515b;
  .title {
    position: relative;
    line-height: 60px;
  }
  .music-icon {
    position: absolute;
    top: 22px;
    right: 10px;
    line-height: 16px;
    font-size: 16px;
    cursor: pointer;
  }
  .content {
    padding: 10px 0;
  }
  .area {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    // background-color: #875ece;
    // background: linear-gradient(#9a6fe3, #875ece);
    // border: 1px solid #b99bed;
    background-color: var(--theme-color);
    background: linear-gradient(
      var(--theme-weaken-color-4),
      var(--theme-weaken-color-2)
    );
    border: 1px solid var(--theme-weaken-color-7);
    padding: 10px;
    color: #fff;
    cursor: pointer;
    &.disabled {
      background: #afafaf;
      border: 1px solid #cacaca;
      cursor: default;
    }
  }
}
</style>
