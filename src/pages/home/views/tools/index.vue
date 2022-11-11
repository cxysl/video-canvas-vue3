<template>
  <div class="csl-tools">
    <div class="title">各种实用工具; {{ data }}</div>
    <el-tooltip content="每两秒内只会触发一次" placement="top">
      <el-button @click="throttleFun">节流</el-button>
    </el-tooltip>
    <el-tooltip content="两次点击需间隔2秒才触发" placement="top">
      <el-button @click="debounceFun">防抖</el-button>
    </el-tooltip>
    <el-button @click="addWaterMark('城南花已开')">添加水印</el-button>
    <el-button @click="delWaterMark()">去掉水印</el-button>

    <!-- 画板 -->
    <div class="draw-panel">
      <canvas id="tool-canvas" width="300" height="300">
        本浏览器不支持 canvas ，请换牛逼点的浏览器
      </canvas>
      <div class="options-bar">
        <el-button @click="startCanvas()">
          {{ canvasActive ? '暂停' : '启动' }}
        </el-button>
        <div class="color">
          <span>画笔颜色</span>
          <el-color-picker v-model="ctxColor" :predefine="predefineColors" show-alpha size="mini" @change="changeColor"/>
        </div>
        <el-input-number v-model="ctxWeight" :min="1" :max="10" controls-position="right" @change="ctxWeightChange"/>
        <el-button @click="submitCanvas()">生成图片</el-button>
        <el-button @click="clearCanvas()">清除</el-button>
      </div>
      <img :src="canvasImg" alt="" />
    </div>

    <!-- 文字生成二维码 -->
    <div class="qr-text">
      <!-- <el-input v-model.lazy="qrTest" lazy></el-input> -->
      <div class="el-input">
        <input v-model.lazy="qrTest" class="el-input__inner" type="text" />
      </div>
      <vue-qr v-show="qrTest" :margin="10" :text="qrTest" :size="160" />
    </div>
  </div>
</template>

<script setup name="tools">
import { ElMessage } from 'element-plus'
import { ref, onMounted } from 'vue'
import { debounce, throttle } from '@/utils/utils'
// import VueQr from 'vue-qr' // vue2
import VueQr from 'vue-qr/src/packages/vue-qr.vue' // vue3
var canvas = null // canvas的dom元素
var ctx = null // canvas 操作对象
const data = ref(' --- 世林') // 出品人
const canvasActive = ref(false) // 画板的状态
const canvasImg = ref('') // canvas图片
const ctxWeight = ref(1) // 画笔粗度
const ctxColor = ref('#f00') // 画笔颜色
const qrTest = ref('城南花已开,老程已不在~')
const predefineColors = ['#ff4500', '#ff8c00', '#ffd700', '#90ee90', '#00ced1', '#1e90ff', '#c71585'] // 快捷颜色
const myMessage = function (str = '') {
  return function () {
    ElMessage.success(str)
  }
}

// 挂载后
onMounted(() => {
  initCanvas()
})

const myFun1 = throttle(myMessage('我是节流按钮触发的事件 🍍🍍🍍'), 2000)
const myFun2 = debounce(myMessage('我是防抖按钮触发的事件 🍓🍓🍓'), 2000, true)

// 节流
function throttleFun() {
  myFun1()
}
// 防抖
function debounceFun() {
  myFun2()
}

/**
 * @param str 水印文案
 * 所有页面加水印
 */
function addWaterMark(str = '城南花已开') {
  // 水印文字，父元素，字体，文字颜色
  console.log('str---', str)
  const parentNode = document.querySelector('.csl-watermark')
  const can = document.createElement('canvas')
  parentNode.appendChild(can)
  can.width = 200 // 140
  can.height = 150 // 86
  can.style.display = 'none'
  const cans = can.getContext('2d')
  cans.translate(100, 75)
  cans.rotate((-30 * Math.PI) / 180)
  cans.translate(-100, -75)
  cans.font = '16px Microsoft Yahei'
  cans.fillStyle = 'rgba(180, 180, 180, 0.3)'
  cans.textAlign = 'center'
  // cans.textBaseline = 'Middle' // as CanvasTextBaseline;
  cans.fillText(str, 100, 80, 200)
  parentNode.style.backgroundImage = 'url(' + can.toDataURL('image/png') + ')'
}
// 去掉水印
function delWaterMark() {
  document.querySelector('.csl-watermark').style.backgroundImage = ''
}

// 初始化canvas
function initCanvas() {
  canvas = document.querySelector('#tool-canvas')
  ctx = canvas.getContext('2d')

  canvas.onmouseup = function () {
    canvas.removeEventListener('mouseleave', leave)
    canvas.removeEventListener('mousemove', draw)
  }
}

// 启动画板
function startCanvas() {
  if (!canvasActive.value) {
    canvasActive.value = true
    canvas.addEventListener('mousedown', star)
  } else {
    canvasActive.value = false
    canvas.removeEventListener('mousedown', star)
  }
}

// 启动画笔
function star(e) {
  ctx.beginPath()
  ctx.lineWidth = ctxWeight.value
  ctx.strokeStyle = ctxColor.value
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  const { offsetX: starX, offsetY: starY } = e
  ctx.moveTo(starX, starY)
  canvas.addEventListener('mousemove', draw)
  canvas.addEventListener('mouseleave', leave)
}

// 鼠标离开画板 移除监听
function leave() {
  canvas.removeEventListener('mouseleave', leave)
  canvas.removeEventListener('mousemove', draw)
}

// 绘制
function draw(e) {
  const { offsetX: curX, offsetY: curY } = e
  ctx.lineTo(curX, curY)
  ctx.stroke()
}

// 切换画笔颜色
function changeColor(val) {
  ctxColor.value = val
}

// 画笔粗度变化
const ctxWeightChange = (val) => {
  ctxWeight.value = val
}

// canvas 合成图片
// eslint-disable-next-line no-unused-vars
function submitCanvas() {
  canvasImg.value = canvas.toDataURL('image/png')
}

// 清除画板
function clearCanvas() {
  ctx.clearRect(0, 0, 300, 300)
}
</script>
<style lang="scss" scoped>
.csl-tools {
  height: 100%;
  padding: 20px;
  overflow-x: hidden;
  overflow-y: auto;
  .title {
    line-height: 30px;
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 15px;
  }
  .el-button {
    margin-right: 20px;
  }
  .draw-panel {
    display: flex;
    align-items: center;
    height: 302px;
    margin: 20px 20px 20px 0;
    // border: 1px dashed #dcdfe6;
    canvas {
      border: 1px dashed #dcdfe6;
    }
    .options-bar {
      width: 140px;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      .color {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
      }
      .el-button,
      .color,
      .el-input-number {
        margin-top: 20px;
      }
      .el-button,
      .el-input-number {
        width: 100px;
        margin-left: 0;
        margin-right: 0;
      }
    }
    img {
      width: 300px;
      height: 300px;
      border: 1px dashed #dcdfe6;
      cursor: pointer;
    }
  }
  .qr-text {
    display: flex;
    .el-input {
      width: 240px;
    }
  }
}
</style>
