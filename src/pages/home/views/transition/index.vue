<template>
  <div class="transition">
    <!-- 动画概述练习 -->
    <div class="item-bar">
      <div class="title">按钮动画</div>
      <div class="content in-line">
        <div :class="{ shake: noActivated, item: true }">
          <el-button @click="shakeClick">点击后震动</el-button>
        </div>
        <div class="ease-inorout item">
          <el-button>缓动效果</el-button>
        </div>
        <div class="fly item">
          <el-icon v-show="toFly" :class="toFly ? 'to-fly' : ''">
            <Promotion />
          </el-icon>
          <el-button @click="iCanFly">起飞</el-button>
        </div>
      </div>
    </div>

    <div class="item-bar">
      <div class="title">脉冲</div>
      <div class="ripple-bar item">
				<div
					v-for="n in [1,2,3,4,5,6]"
					:key="n"
					class="warp"
				>
					<div
						class="ripple"
						:style="`filter: hue-rotate(${60*n}deg)`"
					/>
				</div>
        <!-- <div class="ripple"></div>
        <div class="ripple" style="filter: hue-rotate(120deg)"></div>
        <div class="ripple" style="filter: grayscale()"></div> -->
      </div>
    </div>

    <div class="item-bar">
      <div class="title">背景色动态变</div>
      <div class="background-color-change item">
        <div
          class="movearea"
          :style="{ backgroundColor: `hsl(${mouseX}, 80%, 50%)` }"
          @mousemove="xCoordinate"
        >
          <p>鼠标水平方向相对位置x: {{ mouseX }}</p>
        </div>
      </div>
    </div>

    <div class="item-bar" :style="xStyle">
      <div class="title">横向滚动信息块</div>
      <div ref="songListX" class="content song-x">
        <div class="song-list-x">
          <div
            v-for="(item, index) in song.x"
            ref="songItemX"
            :key="'x' + index"
            class="song-item"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </div>

    <div class="item-bar" :style="yStyle">
      <div class="title">纵向滚动信息块</div>
      <div ref="songListY" class="content song-y">
        <div class="sonf-list-y">
          <div
            v-for="(item, index) in song.y"
            ref="songItemY"
            :key="'y' + index"
            class="song-item"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </div>
    <!-- <div></div> -->
  </div>
</template>

<script>
export default {
  name: 'Transition',
  components: {},
  props: {},
  data() {
    return {
      noActivated: false,
      mouseX: 0,
      toFly: false,
      song: {
        x: [
          '张国荣',
          'Taylor Swift',
          '薛之谦',
          '周杰伦',
          '张学友',
          '曾沛慈',
          '胡歌',
          '周星驰'
        ],
        y: [
          '玻璃之情 -张国荣',
          // '',
          '从前我会使你快乐',
          '现在却最多叫你寂寞',
          '从前我会使你快乐',
          '现在却最多叫你寂寞',
          '再吻下去像皱纸轻薄',
          '撕开了都不觉',
          '我这苦心已有预备',
          '随时有块玻璃破碎堕地',
          '勉强下去我会憎你',
          '只差那一口气',
          '不信眼泪能令失乐的你爱下去',
          '难收的覆水将感情漫漫荡开去',
          '如果你太累及时地道别没有罪',
          '牵手来空手去',
          '就去',
          '我这苦心已有预备',
          '随时有块玻璃破碎堕地',
          '勉强下去我会憎你',
          '只差那一口气',
          '不信眼泪能令失乐的你爱下去',
          '难收的覆水将感情漫漫荡开去',
          '如果你太累及时地道别没有罪',
          '牵手来空手去',
          '一起要许多福气',
          '或者承受不起',
          '或者怀恨比相爱更合理',
          '即使可悲',
          '不信眼泪能令失乐的你爱下去',
          '难收的覆水将感情漫漫荡开去',
          '如果你太累及时地道别没有罪',
          '一生人不只一伴侣',
          '你会记得我是谁',
          '犹如偶尔想起过气玩具',
          '我抱住过哪怕失去',
          '早想到玻璃很易碎'
        ]
      },
      xTimer: null,
      yTimer: null,
      xStyle: {},
      yStyle: {}
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.getAnimation()
    })
  },
  methods: {
    // shake 晃动
    shakeClick() {
      this.noActivated = true
      setTimeout(() => {
        this.noActivated = false
      }, 900)
    },
    // 获取鼠标位置
    xCoordinate(e) {
      this.mouseX = e.clientX - 240
    },
    // 起飞
    iCanFly() {
      this.toFly = true
      setTimeout(() => {
        this.toFly = false
      }, 1000)
    },
    getAnimation() {
      const xItemDom =
        this.$refs.songItemX instanceof Array
          ? this.$refs.songItemX[0]
          : this.$refs.songItemX
      this.xStyle = {
        '--time': '4s',
        '--length': this.song.x.length,
        '--width': xItemDom.offsetWidth + 10
      }
      const xListDom = this.$refs.songListX
      const n = Math.ceil(xListDom.offsetWidth / xItemDom.offsetWidth) || 4
      const repeatArr = this.song.x.slice(0, n)
      this.song.x = this.song.x.concat(repeatArr)

      const yItemDom =
        this.$refs.songItemY instanceof Array
          ? this.$refs.songItemY[0]
          : this.$refs.songItemY
      this.yStyle = {
        '--time': '4s',
        '--length': this.song.y.length,
        '--height': yItemDom.offsetHeight
      }
      const yListDom = this.$refs.songListY
      const n2 = Math.ceil(yListDom.offsetHeight / yItemDom.offsetHeight) || 4
      const repeatArrY = this.song.y.slice(0, n2)
      this.song.y = this.song.y.concat(repeatArrY)

      // 鼠标悬浮 暂停动画
      this.$nextTick(() => {
        // 拿到 dom
        const xList = this.$refs.songListX.firstChild
        const xItem = this.$refs.songItemX
        // 监听事件
        xList.addEventListener('mouseenter', () => {
          // 暂停动画
          xList.style.animationPlayState = 'paused'
          xItem.forEach((e) => {
            e.style.animationPlayState = 'paused'
          })
        })
        xList.addEventListener('mouseleave', () => {
          // 开始动画
          xList.style.animationPlayState = 'running'
          xItem.forEach((e) => {
            e.style.animationPlayState = 'running'
          })
        })

        // ----------------------------------------

        // 拿到 dom
        const yList = this.$refs.songListY.firstChild
        const yItem = this.$refs.songItemY
        // 监听事件
        yList.addEventListener('mouseenter', () => {
          // 暂停动画
          yList.style.animationPlayState = 'paused'
          yItem.forEach((e) => {
            e.style.animationPlayState = 'paused'
          })
        })
        yList.addEventListener('mouseleave', () => {
          // 开始动画
          yList.style.animationPlayState = 'running'
          yItem.forEach((e) => {
            e.style.animationPlayState = 'running'
          })
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.transition {
  height: 100%;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  .item-bar {
    .title {
      line-height: 30px;
      font-size: 16px;
      font-weight: bold;
      color: #333;
    }
    .content {
      &.in-line {
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }
    }
  }
  .item {
    margin-bottom: 15px;
    margin-right: 30px;
  }
  .shake {
    animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
  }
  @keyframes shake {
    10%,
    90% {
      transform: translate3d(-1px, 0, 0);
    }
    20%,
    80% {
      transform: translate3d(2px, 0, 0);
    }
    30%,
    50%,
    70% {
      transform: translate3d(-4px, 0, 0);
    }
    40%,
    60% {
      transform: translate3d(4px, 0, 0);
    }
  }
  .ripple-bar {
    background: #000;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    padding: 50px;
  }
	.warp {
		flex: 1 1 auto;
	}

  .ripple {
    width: 1rem;
    background: #ff0;
    // &:nth-child(2) {
    //   margin: 0 100px;
    // }
  }
  .ripple,
  .ripple::before,
  .ripple::after {
    content: '';
    display: grid;
    grid-area: 1/1;
    aspect-ratio: 1;
    border-radius: 50%;
    box-shadow: 0 0 0 0 #ff03;
    animation: r 3s linear infinite var(--s, 0s);
  }
  .ripple::before {
    --s: 1s;
  }
  .ripple::after {
    --s: 2s;
  }

  @keyframes r {
    to {
      box-shadow: 0 0 0 6rem #0000;
    }
  }

  .background-color-change {
    position: relative;
    height: 150px;
  }
  .movearea {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 6vmin;
    transition: 0.2s background-color ease;
  }
  .ease-inorout {
    .el-button {
      // background: #1b8f5a;
      transition: background 0.25s ease-in;
      &:hover,
      &:focus {
        transition: background 0.3s ease-out;
        background: #66b9ff;
        color: #fff;
      }
      &:focus {
        outline: 1px solid #fff;
        outline-offset: -4px;
      }
    }
  }

  @keyframes tohide {
    from {
      left: -10%;
      top: 90%;
    }
    to {
      left: 110%;
      top: -20%;
    }
  }
  .to-fly {
    font-size: 140px;
    color: var(--theme-color);
    position: fixed;
    z-index: 99;
    left: -10%;
    top: 90%;
    -webkit-animation: tohide 1s ease 1 forwards;
    -moz-animation: tohide 1s ease 1 forwards;
    animation: tohide 1s ease 1 forwards;
  }
  .song-item {
    border: 1px dashed #eee;
    height: 30px;
    line-height: 30px;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
    &:hover {
      font-weight: bold;
      border: 1px dashed var(--theme-weaken-color-8);
      background-color: var(--theme-weaken-color-10);
    }
  }
  .song-x {
    height: 30px;
    max-width: 300px;
    overflow: hidden;
    .song-list-x {
      display: flex;
      flex-wrap: nowrap;
      height: 100%;
      animation: xlistMove calc(var(--time) * var(--length))
        steps(var(--length)) infinite;
    }
    .song-item {
      flex: 0 0 80px;
      flex-shrink: 0;
      margin-right: 10px;
      animation: xitemMove var(--time) infinite;
    }
  }
  @keyframes xlistMove {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(calc(var(--width) * calc(var(--length) * -1px)));
    }
  }
  @keyframes xitemMove {
    0% {
      transform: translateX(0);
    }
    80%,
    100% {
      transform: translateX(calc(var(--width) * -1px));
    }
  }
  .song-y {
    width: 100%;
    max-height: 260px;
    overflow: hidden !important;
    .sonf-list-y {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      animation: ylistMove calc(var(--time) * var(--length))
        steps(var(--length)) infinite;
    }
    .song-item {
      width: 100%;
      flex-shrink: 0;
      margin-bottom: 5px;
      animation: yitemMove var(--time) infinite;
    }
  }
  @keyframes ylistMove {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(calc(var(--height) * calc(var(--length) * -1px)));
    }
  }
  @keyframes yitemMove {
    0% {
      transform: translateY(0);
    }
    80%,
    100% {
      transform: translateY(calc(var(--height) * -1px));
    }
  }
}
</style>
