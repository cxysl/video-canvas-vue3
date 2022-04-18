<template>
  <div class="editor-hot-areas-wrap">
    <div
      class="area-item"
      :style="{
        width: `${item.width}px`,
        height: `${item.height}px`,
        left: `${item.left}px`,
        top: `${item.top}px`
      }"
      v-for="(item, index) in items"
      @mousedown="dragStart($event, index, 'drag')"
      :key="index"
    >
      <el-input
        v-model="item.clickUrl"
        placeholder="请输入热区跳转链接"
        @blur="updateHotAreas"
        v-if="active === index"
      ></el-input>
      <div class="handler-wrap">
        <i class="handler delete" @click.stop="delItem(index)">
          <svg class="bbt-icon" aria-hidden="true">
            <use xlink:href="#bbt-shanchu" />
          </svg>
        </i>
        <i
          class="handler transform"
          @mousedown.stop="dragStart($event, index, 'transform')"
        >
          <svg class="bbt-icon" aria-hidden="true">
            <use xlink:href="#bbt-icon-test" />
          </svg>
        </i>
      </div>
    </div>
  </div>
</template>

<script>
import throttle from 'lodash/throttle'
let self = {}
export default {
  name: 'hotAreas',
  data() {
    return {
      items: [],
      active: 0,
      lastX: 0,
      lastY: 0,
      isDrag: false,
      isTransform: false
    }
  },
  created() {
    self = this
    this.items = this.$store.state.poster.hotAreas.map(item => {
      return {
        width: item.width * this.scale,
        height: item.height * this.scale,
        top: item.top * this.scale,
        left: item.left * this.scale,
        clickUrl: item.clickUrl
      }
    })
  },
  mounted() {
    document.querySelector('.canvas-container').append(this.$el)
  },
  computed: {
    scale() {
      return this.$store.state.poster.size / 100
    }
  },
  methods: {
    addHotAreas() {
      this.items.push({
        left: 100 * this.scale,
        top: 100 * this.scale,
        width: 150 * this.scale,
        height: 150 * this.scale,
        clickUrl: ''
      })
    },
    delItem(index) {
      this.items.splice(index, 1)
    },
    dragStart(e, index, type) {
      this.lastX = e.clientX
      this.lastY = e.clientY
      this.isDrag = type === 'drag'
      this.isTransform = type === 'transform'
      this.active = index
      document.documentElement.addEventListener('mousemove', this.dragMove)
      document.documentElement.addEventListener('mouseup', this.dragEnd)
    },
    dragMove: throttle(e => {
      let distanceX = e.clientX - self.lastX
      let distanceY = e.clientY - self.lastY
      self.lastX = e.clientX
      self.lastY = e.clientY
      if (self.isDrag) {
        self.items[self.active].left = self.items[self.active].left + distanceX
        self.items[self.active].top = self.items[self.active].top + distanceY
      }
      if (self.isTransform) {
        self.items[self.active].width =
          self.items[self.active].width + distanceX
        self.items[self.active].height =
          self.items[self.active].height + distanceY
      }
    }, 30),
    dragEnd() {
      this.updateHotAreas()
      this.isDrag = false
      this.isTransform = false
      document.documentElement.removeEventListener('mousemove', this.dragMove)
      document.documentElement.removeEventListener('mouseup', this.dragEnd)
    },
    updateHotAreas() {
      let hotAreas = this.items.map(item => {
        return {
          width: item.width / this.scale,
          height: item.height / this.scale,
          top: item.top / this.scale,
          left: item.left / this.scale,
          clickUrl: item.clickUrl
        }
      })
      this.$store.commit({
        type: 'poster/setHotAreas',
        hotAreas
      })
    }
  },
  watch: {
    scale(val) {
      this.items = this.$store.state.poster.hotAreas.map(item => {
        return {
          width: item.width * val,
          height: item.height * val,
          top: item.top * val,
          left: item.left * val,
          clickUrl: item.clickUrl
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import './styles';
</style>
