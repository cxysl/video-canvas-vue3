<template>
  <div
    :class="[
      'side-collapse',
      {
        collapse:
          isShow === '#bbt-moban' ||
          isShow === '#bbt-tubiao1' ||
          isShow === '#bbt-zhuangxiu' ||
          isShow === '#bbt-wenzi'
      },
      { requcollapse: isShow === '#bbt-requ' },
      feature === 'watermark' ? 'position-top-side-collapse' : ''
    ]"
  >
    <div class="collapse-arrow" @click="close">
      <i class="el-icon-arrow-left"></i>
    </div>
    <!-- <keep-alive> -->
    <component
      :is="activeCollapse"
      v-if="firstShow"
      @add-text="
        (priceTag) => {
          $emit('add-text', priceTag)
        }
      "
    ></component>
    <!-- 动态组件-->
    <!-- </keep-alive> -->
  </div>
</template>

<script>
import PosterMaps from './components/posterMaps'
import Watermarkmaps from './components/watermarkMaps'
import Price from './components/price'
export default {
  name: 'PosterCollapse',
  components: {
    PosterMaps,
    Watermarkmaps,
    Price
  },
  props: {
    activeBtn: {
      type: String,
      default: ''
    },
    firstShow: {
      type: Boolean,
      default: false
    }
  },
  emits: ['addHotArea', 'onClose', 'update:activeBtn', 'add-text'],
  data() {
    return {
      isShow: '',
      activeIcon: 'festival',
      activeCollapse: ''
    }
  },
  computed: {
    feature() {
      return this.$route.params.feature
    },
    isTbWm() {
      return this.$route.query.isTbWm == 'true'
    }
  },
  watch: {
    activeBtn: {
      immediate: true,
      handler(val) {
        if (val === '#bbt-moban') {
          //海报模板
          this.activeCollapse = 'postermaps'
          this.$store.commit({
            type: 'poster/setIsCompatible',
            isCompatible: true
          })
        } else if (val === '#bbt-zhuangxiu') {
          //水印模板
          this.activeCollapse = 'watermarkmaps'
          this.$store.commit({
            type: 'poster/setIsCompatible',
            isCompatible: true
          })
        } else if (val === '#bbt-wenzi') {
          //价签
          this.activeCollapse = 'price'
          this.$store.commit({
            type: 'poster/setIsCompatible',
            isCompatible: true
          })
        } else {
          this.activeCollapse = ''
        }
        this.isShow = val
      }
    }
  },
  methods: {
    close() {
      this.$emit('update:activeBtn', '')
      this.$emit('onClose')
    },
    addHotArea() {
      this.$emit('addHotArea')
    }
  }
}
</script>

<style lang="scss">
@import './styles';
</style>
