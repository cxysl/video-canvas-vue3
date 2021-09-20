<template>
  <ul class="materialVideo-list">
    <!-- 遍历之前上传的音乐 -->

    <!--  遍历默认的音乐或特效 -->
    <li
      v-for="item in items"
      :class="{ active: item.id === active, small: size === 'small' }"
      :key="item.id"
      @click="handler(item)"
    >
      <div class="item-wrap">
        <!-- 图片 -->
        <img v-lazy="item.img" />
        <!-- 显示音乐图片还是特效图片 -->
      </div>
      <div class="title">{{ item.title }}</div>
      <!-- 名字 -->
    </li>
  </ul>
</template>

<script>
export default {
  name: 'materialVideo',
  props: {
    items: {
      type: Array,
      default() {
        return []
      }
    },
    type: String,
    size: {
      type: String,
      default: 'normal'
    },
    canvasChange: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      active: 1,
      musicImg:
        'https://img.alicdn.com/imgextra/i4/17157061/TB2rm_or8jTBKNjSZFDXXbVgVXa-17157061.png'
    }
  },
  created() {
    this.active = this.items[0].id
    this.$emit('change', this.active)
  },
  methods: {
    handler(item) {
      this.$emit('update:canvasChange', true)
      if (this.type === 'music' && this.active === item.id) {
        this.active = ''
      } else {
        this.active = item.id
      }
      this.$emit('change', this.active)
    },
    shangchuan() {
      this.$message('等待开发中!')
    }
  }
}
</script>

<style lang="scss">
.materialVideo-list {
  overflow: hidden;
  li {
    float: left;
    margin: 10px 30px;
    &.small {
      margin: 10px 12px;
      .item-wrap,
      .item-main {
        width: 50px;
        height: 50px;
        padding: 6px;
      }
      .title {
        font-size: 12px;
      }
    }
    .item-wrap,
    .item-main {
      width: 70px;
      height: 70px;
      padding: 10px;
      border-radius: 6px;
      border: 2px solid transparent;
      cursor: pointer;
      transition: all 0.3s;
      background-color: #34373e;
      margin-bottom: 10px;
    }
    .title {
      color: #fff;
      text-align: center;
    }
    &.active {
      .item-wrap {
        border-color: #86f1ff;
      }
    }
    &:hover {
      .item-wrap,
      .item-main {
        border-color: #86f1ff;
      }
    }
  }
}
</style>
