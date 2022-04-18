<template>
  <div
    class="poster-transform-tool"
    :style="{
      width: `${styles.width}px`,
      height: `${styles.height}px`,
      left: `${styles.left}px`,
      top: `${styles.top}px`,
      transform: `rotate(${styles.rotate}deg)`
    }"
    @mousedown.self="transformDown"
    @dblclick="editText"
  >
    <template v-for="(handler, index) in handlers">
      <i
        :class="['ed-handle', `handle-${handler.type}`]"
        :key="handler.type"
        @mousedown="handleDown($event, handler.type)"
        v-if="
          isMultipleDrag
            ? ['lt', 'rt', 'lb', 'rb'].indexOf(handler.type) > -1
            : true
        "
        :style="{
          cursor: cursorStyleArray[index]
        }"
      ></i>
    </template>
    <i
      class="ed-handle handle-rotate"
      @mousedown="handleDown($event, 'rotate')"
    >
      <i class="bbt-icons">
        <svg class="bbt-icon">
          <use xlink:href="#bbt-zuoxuanzhuan"></use>
        </svg>
      </i>
    </i>
    <chunk
      v-if="isShowEditText"
      ref="editText"
      :is-edit="true"
      :chunk="chunks[currentChunkIndex]"
      :index="currentChunkIndex"
      @textChange="editTextChange"
    ></chunk>
  </div>
</template>

<script>
import throttle from 'lodash/throttle'
import chunk from '../chunk'
import { transform, getPointAndOpposite, getNewRect } from './utils'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('poster')
export default {
  name: 'transformTool',
  components: {
    chunk
  },
  props: {
    isMultipleDrag: Boolean
  },
  data() {
    return {
      handlers: [
        {
          type: 'lt'
        },
        {
          type: 'mt'
        },
        {
          type: 'rt'
        },
        {
          type: 'rm'
        },
        {
          type: 'rb'
        },
        {
          type: 'mb'
        },
        {
          type: 'lb'
        },
        {
          type: 'lm'
        }
      ],
      styles: {
        width: '',
        height: '',
        top: '',
        left: '',
        rotate: 0
      },
      parentBounds: {},
      clickPosition: {},
      currentType: '',
      oPoint: {},
      resizeMouseDownInfo: {},
      transformedRect: {},
      prevAngle: '',
      rotatePoint: {},
      cursorStyleArray: [
        'nwse-resize',
        'ns-resize',
        'nesw-resize',
        'ew-resize',
        'nwse-resize',
        'ns-resize',
        'nesw-resize',
        'ew-resize'
      ],
      editTextElement: {}
    }
  },
  destroyed() {
    this.$store.commit({
      type: 'poster/setIsShowEditText',
      isShow: false
    })
  },
  computed: {
    ...mapState([
      'chunks',
      'editTextByicon',
      'currentChunkIndex',
      'isShowEditText',
      'size'
    ])
  },
  methods: {
    setStyles(styles) {
      let { width, height, left, top, rotate } = styles
      this.styles.width = width
      this.styles.height = height
      this.styles.left = left
      this.styles.top = top
      this.styles.rotate = !rotate && rotate !== 0 ? this.styles.rotate : rotate
      this.getNewCursorArray(this.styles.rotate)
    },
    handleDown(e, type) {
      const bounds = this.$el.getBoundingClientRect()
      this.parentBounds = this.$el.parentNode.getBoundingClientRect()
      const sl = document.documentElement.scrollLeft
      const st = document.documentElement.scrollTop
      this.clickPosition = {
        pointerX: e.pageX,
        pointerY: e.pageY,
        parentX: bounds.left + sl,
        parentY: bounds.top + st,
        parentW: bounds.width,
        parentH: bounds.height,
        canvasX: this.parentBounds.left + sl,
        canvasY: this.parentBounds.top + st,
        originX: bounds.left + sl + bounds.width / 2,
        originY: bounds.top + st + bounds.height / 2
      }
      this.currentType = type
      if (type !== 'rotate') {
        this.resizeMouseDown(e)
      } else {
        this.rotateMouseDown(e)
      }
      document.documentElement.addEventListener('mousemove', this.move)
      document.documentElement.addEventListener('mouseup', this.handleUp)
    },
    move(e) {
      this.isMoving = true
      this.handleResize(e, this)
      // let self = this
    },
    handleResize: throttle((e, self) => {
      if (self.currentType === 'rotate') {
        self.rotateMove(e)
      } else {
        self.resizeMove(e)
      }
    }, 50),
    rotateMouseDown(e) {
      let { originX, originY } = this.clickPosition
      this.prevAngle =
        Math.atan2(e.pageY - originY, e.pageX - originX) -
        (this.styles.rotate * Math.PI) / 180
    },
    rotateMove(e) {
      let { originX, originY } = this.clickPosition
      let _x = Math.abs(e.pageX - originX),
        _y = Math.abs(e.pageY - originY),
        _z = Math.sqrt(_x * _x + _y * _y),
        rotate = Math.round((Math.asin(_y / _z) / Math.PI) * 180)
      // 第一象限
      if (originX <= e.pageX && originY >= e.pageY) {
        rotate = 270 - rotate
        //  添加自动校正度数
        if (rotate <= 183) {
          rotate = 180
        }
        if (rotate >= 207 && rotate <= 213) {
          rotate = 210
        }
        if (rotate >= 222 && rotate <= 228) {
          rotate = 225
        }
        if (rotate >= 237 && rotate <= 243) {
          rotate = 240
        }
        if (rotate >= 267) {
          rotate = 270
        }
        // console.log('第一象限：' + rotate)
      }

      // 第二象限
      else if (originX >= e.pageX && originY >= e.pageY) {
        rotate = 90 + rotate
        //  添加自动校正度数
        if (rotate <= 93) {
          rotate = 90
        }
        if (rotate >= 117 && rotate <= 123) {
          rotate = 120
        }
        if (rotate >= 132 && rotate <= 138) {
          rotate = 135
        }
        if (rotate >= 147 && rotate <= 153) {
          rotate = 150
        }
        if (rotate >= 177) {
          rotate = 180
        }
        // console.log('第二象限：' + rotate)
      }

      // 第三象限
      else if (originX >= e.pageX && originY <= e.pageY) {
        rotate = 90 - rotate
        //  添加自动校正度数
        if (rotate <= 3) {
          rotate = 0
        }
        if (rotate >= 27 && rotate <= 33) {
          rotate = 30
        }
        if (rotate >= 42 && rotate <= 48) {
          rotate = 45
        }
        if (rotate >= 57 && rotate <= 63) {
          rotate = 60
        }
        if (rotate >= 87) {
          rotate = 90
        }
        // console.log('第三象限：' + rotate)
      }

      // 第四象限
      else if (originX <= e.pageX && originY <= e.pageY) {
        rotate = 270 + rotate
        //  添加自动校正度数
        if (rotate <= 273) {
          rotate = 270
        }
        if (rotate >= 297 && rotate <= 303) {
          rotate = 300
        }
        if (rotate >= 312 && rotate <= 318) {
          rotate = 318
        }
        if (rotate >= 327 && rotate <= 333) {
          rotate = 330
        }
        if (rotate >= 357) {
          rotate = 0
        }
        // console.log('第四象限：' + rotate)
      }
      this.styles.rotate = rotate
      this.$emit('transform', this.styles, 'rotate')
    },
    resizeMouseDown(e) {
      // 缩放开始
      let { left, top, width, height, rotate } = this.styles
      let ex = e.pageX - this.parentBounds.left
      let ey = e.pageY - this.parentBounds.top
      // 计算初始状态旋转后的rect
      this.transformedRect = transform(
        {
          x: left,
          y: top,
          width,
          height
        },
        rotate
      )
      // 取得旋转后的8点坐标
      let { point } = this.transformedRect

      // 获取当前点和对角线点
      let pointAndOpposite = getPointAndOpposite(point, ex, ey)
      let { opposite } = pointAndOpposite

      // 对角线点的索引即为缩放基点索引
      this.resizeMouseDownInfo.baseIndex = opposite.index

      this.resizeMouseDownInfo.oppositeX = opposite.point.x
      this.resizeMouseDownInfo.oppositeY = opposite.point.y

      // 鼠标释放点距离当前点对角线点的偏移量
      this.resizeMouseDownInfo.offsetWidth = Math.abs(
        ex - this.resizeMouseDownInfo.oppositeX
      )
      this.resizeMouseDownInfo.offsetHeight = Math.abs(
        ey - this.resizeMouseDownInfo.oppositeY
      )

      // 记录最原始的状态
      this.oPoint = {
        x: left,
        y: top,
        width,
        height,
        rotate
      }
    },
    resizeMove(e) {
      let nex = e.pageX - this.parentBounds.left
      let ney = e.pageY - this.parentBounds.top
      let scale = {
        x: 1,
        y: 1
      }
      let realScale = 1
      let {
        offsetWidth,
        offsetHeight,
        oppositeX,
        oppositeY,
        baseIndex
      } = this.resizeMouseDownInfo
      // 判断是根据x方向的偏移量来计算缩放比还是y方向的来计算
      if (offsetWidth > offsetHeight) {
        realScale = Math.abs(nex - oppositeX) / offsetWidth
      } else {
        realScale = Math.abs(ney - oppositeY) / offsetHeight
      }

      if ([0, 2, 4, 6].indexOf(baseIndex) >= 0) {
        scale.x = scale.y = realScale
      } else if ([1, 5].indexOf(baseIndex) >= 0) {
        scale.y = realScale
      } else if ([3, 7].indexOf(baseIndex) >= 0) {
        scale.x = realScale
      }

      let newRect = getNewRect(
        this.oPoint,
        scale,
        this.transformedRect,
        baseIndex
      )
      let sizeScale = newRect.width / this.styles.width
      let leftDifference = this.styles.left
      let topDifference = this.styles.top
      this.styles.left = newRect.x
      this.styles.top = newRect.y
      this.styles.width = newRect.width
      this.styles.height = newRect.height
      this.$emit(
        'transform',
        this.styles,
        this.cursorStyleArray[baseIndex],
        sizeScale,
        leftDifference,
        topDifference
      )
    },
    getNewCursorArray(degree) {
      const ARR_LENGTH = 8
      const STEP = 45
      let cursorStyleArray = [
        'nwse-resize',
        'ns-resize',
        'nesw-resize',
        'ew-resize',
        'nwse-resize',
        'ns-resize',
        'nesw-resize',
        'ew-resize'
      ]
      let startIndex = 0

      if (degree) {
        startIndex = Math.floor(degree / STEP)
        if (degree % STEP > STEP / 2) {
          startIndex += 1
        }
      }

      if (startIndex > 1) {
        const len = ARR_LENGTH - startIndex
        this.cursorStyleArray = cursorStyleArray
          .slice(startIndex, startIndex + len)
          .concat(cursorStyleArray.slice(0, startIndex))
      } else {
        this.cursorStyleArray = cursorStyleArray
      }
    },
    transformDown(e) {
      this.$emit('dragStart', e)
    },
    // eslint-disable-next-line
    handleUp(e) {
      if (this.currentType === 'rotate') {
        this.getNewCursorArray(this.styles.rotate)
      }
      if (this.isMoving) {
        this.$store.commit('poster/setStorageRecord')
      }
      this.isMoving = false
      document.documentElement.removeEventListener('mousemove', this.move)
      document.documentElement.removeEventListener('mouseup', this.handleUp)
      this.$emit('transformHandleUp', this.styles)
    },
    editText() {
      let chunk = this.chunks[this.currentChunkIndex]
      if (chunk.type === 'text') {
        this.$store.commit({
          type: 'poster/setIsShowEditText',
          isShow: true
        })
        this.$nextTick(() => {
          this.editTextElement = this.$refs.editText.$el.querySelector(
            '.edit-content'
          )
          this.selectText(this.editTextElement)
        })
      }
    },
    selectText(el) {
      if (document.selection) {
        // IE
        let range = document.body.createTextRange()
        range.moveToElementText(el)
        range.select()
      } else if (window.getSelection) {
        let range = document.createRange()
        range.selectNode(el)
        let elChildNodes = el.childNodes
        if (elChildNodes.length > 0) {
          let elLastChildNode = elChildNodes[elChildNodes.length - 1]
          range.setStart(elChildNodes[0], 0)
          let endOffset = 0
          if (elLastChildNode.nodeName === '#text') {
            endOffset = elLastChildNode.nodeValue.length
          } else if (elLastChildNode.nodeName === 'DIV') {
            endOffset = 1
          }
          range.setEnd(elLastChildNode, endOffset)
        } else {
          range.setStart(el, 0)
        }
        window.getSelection().removeAllRanges()
        window.getSelection().addRange(range)
      }
    },
    editTextChange(width, height) {
      this.styles.width = width * (this.size / 100)
      this.styles.height = height * (this.size / 100)
    }
  },
  watch: {
    // currentChunkIndex() {
    //   this.$store.commit({
    //     type: 'poster/setIsShowEditText',
    //     isShow: false
    //   })
    //   this.$store.commit({
    //     type: 'poster/setEditTextByicon',
    //     editTextByicon: false
    //   })
    // },
    editTextByicon(val) {
      if (val && this.currentChunkIndex != '') {
        this.editText()
      }
    }
  }
}
</script>

<style lang="scss">
@import './styles';
</style>
