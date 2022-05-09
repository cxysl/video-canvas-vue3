<template>
  <div>
    <div
      :class="[
        feature === 'watermark' ? 'position-top-poster-sidebar' : '',
        'poster-sidebar'
      ]"
    >
      <!-- <el-button
        type="text"
        v-if="feature === 'watermark'"
        class="reback-edition"
        @click="changeOlderEidt"
      >
        返回老版
      </el-button> -->
      <ul class="side-btns">
        <template v-for="item in btns">
          <li
            :key="item.icon"
            :class="{ active: item.icon === activeBtn }"
            @click="onSidebarClick(item)"
            v-if="
              (feature === 'watermark' &&
                item.type !== 'poster' &&
                (item.label != '贴图' || !isTbWm)) ||
              (feature === 'poster' && item.type !== 'watermark')
            "
          >
            <!-- v-if="!(feature === 'watermark' && item.icon === '#bbt-requ')" -->
            <i class="side-icon">
              <svg class="bbt-icon">
                <use :xlink:href="item.icon"></use>
              </svg>
            </i>
            <span class="btn-label">{{ item.label }}</span>
          </li>
        </template>
        <!-- <el-tooltip
          class="item"
          effect="dark"
          content="价签最多一个"
          placement="right"
        >
          <li @click="openPricePanel" v-if="feature === 'watermark'">
            <i class="side-icon">
              <svg class="bbt-icon">
                <use xlink:href="#bbt-wenzi"></use>
              </svg>
            </i>
            <p class="change-edit">价签</p>
          </li>
        </el-tooltip> -->
      </ul>
      <collapse
        v-model:activeBtn="activeBtn"
        v-model:firstShow="firstShow"
        @addHotArea="addHotArea"
        @onClose="onClose"
        @add-text="addText"
      ></collapse>
      <!-- <upload v-model:visible="isShowUpload" @add-img="addImg"></upload> -->
      <!-- <hot-areas ref="hotAreas" v-if="isShowHotAreas"></hot-areas> -->
    </div>
  </div>
</template>

<script>
// import upload from 'pages/itemsManage/watermark/editor/upload'
import collapse from './components/collapse'
// import hotAreas from './components/hotAreas'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('poster')
export default {
  name: 'posterSidebar',
  components: {
    // upload,
    collapse
    // hotAreas
  },
  data() {
    return {
      btns: [
        //type: all、poster、watermark
        {
          icon: '#bbt-moban',
          label: '模板',
          canShowCollapse: true,
          type: 'poster'
        },
        {
          icon: '#bbt-zhuangxiu',
          label: '贴图',
          canShowCollapse: true,
          type: 'watermark'
        },
        {
          icon: '#bbt-text',
          label: '文字',
          canShowCollapse: false,
          type: 'all'
        },
        {
          icon: '#bbt-shangchuan',
          label: '上传',
          canShowCollapse: false,
          type: 'all'
        },
        {
          icon: '#bbt-wenzi',
          label: '价签',
          canShowCollapse: true,
          type: 'watermark'
        }
      ],
      activeBtn: '',
      isShowUpload: false,
      firstShow: false,
      isShowHotAreas: false
    }
  },
  computed: {
    ...mapState([
      'size',
      'chunks',
      'canvasWidth',
      'canvasHeight',
      'storageRecord'
    ]),
    feature() {
      return this.$route.params.feature
    },
    isTbWm() {
      return this.$route.query.isTbWm == 'true'
    }
  },
  mounted() {
    if (this.feature == 'watermark') {
      this.firstShow = true
      this.activeBtn = '#bbt-wenzi'
      this.$store.commit({
        type: 'poster/setIsCompatible',
        isCompatible: true
      })
    }
  },
  methods: {
    changeOlderEidt() {
      let olderPath = this.$route.fullPath
      let newPath =
        'https://promote.baobeituan.com/subpage/itemsManage' +
        olderPath.slice(8)
      window.location.href = newPath
    },
    addPriceText() {
      let hasPriceTag = false
      this.chunks.some((item) => {
        if (item.priceTag) {
          hasPriceTag = true
          return true
        }
      })
      if (hasPriceTag) {
        this.$message.error({
          showClose: true,
          message: '请勿重复添加价签！'
        })
      } else {
        this.addText('priceTag')
      }
    },
    onSidebarClick(item) {
      if (item.icon === '#bbt-shangchuan') {
        return (this.isShowUpload = true)
      } else if (item.canShowCollapse) {
        console.log(item.label)
        this.firstShow = true
      } else if (item.icon === '#bbt-text') {
        return this.addText()
      }
      this.isShowHotAreas = item.icon === '#bbt-requ'
      this.$emit('setCanvasLockedState', this.isShowHotAreas)
      this.activeBtn = item.icon
    },
    addImg(img) {
      let image = new Image()
      image.addEventListener('load', () => {
        pushImg()
      })
      image.src = img
      // eslint-disable-next-line
      let scale = this.size / 100
      let pushImg = () => {
        let chunks = JSON.parse(JSON.stringify(this.chunks))
        let data = {
          height: image.height,
          width: image.width,
          left: (this.canvasWidth - image.width) / 2,
          top: (this.canvasHeight - image.height) / 2,
          opacity: 100,
          rotate: 0,
          src: img,
          type: 'img'
        }
        if (this.isTbWm) {
          data.algoType = 'decoration'
          data.name = ''
          data.filters = []
          data.layerType = 'image'
          data.linkId = '0'
          data.styleEditAble = true
          data.contentEditAble = true
          data.canBeOption = true
        }
        chunks.push(data)
        this.$store.commit({
          type: 'poster/setChunks',
          chunks
        })
      }
    },
    onClose() {
      this.isShowHotAreas = false
      this.$store.commit({
        type: 'poster/setIsCompatible',
        isCompatible: false
      })
      this.$emit('setCanvasLockedState', false)
    },
    addText(priceTag) {
      let data = {
        type: 'text',
        width: priceTag ? 168 : 300,
        height: priceTag ? 79 : 84,
        top: this.canvasHeight / 2 - 150,
        left: this.canvasWidth / 2 - 42,
        rotate: 0,
        fontFamily: 'SourceHanSansSC-Regular',
        fontSize: 70,
        fontWeight: false,
        italic: false,
        color: '333333',
        textAlign: 'left',
        textContent: priceTag ? '999' : '输入文字',
        xFontSpacing: 0,
        yFontSpacing: 1,
        fontStyle: '',
        textDecoration: '',
        opacity: 100,
        priceTag: priceTag ? true : false,
        adsorbing: ['false', 'false']
      }
      if (this.isTbWm) {
        data.fontFamily = 'AlibabaPuHuiTiR-MA'
        data.algoType = 'dynamiccharacter'
        data.lineHeight = data.fontSize
        data.fill = {
          color: '#' + data.color,
          type: 'color'
        }
        data.layerType = 'text'
        data.name = 1000 + Math.random() * 100 + '文字'
        data.textType = 'auto'
        data.direction = 'horizontal'
        data.fontStyle = 'normal'
        data.minChars = 0
        data.maxChars = 15
        data.maxRows = 0
        data.scaling = true
        data.dslType = 2
        data.styleEditAble = true
        data.contentEditAble = true
        data.canBeOption = true
        // data.kind = '?'
        data.linkId = '0'
        // data.textKind = '1'
        // data.id = parseInt(1000 + Math.random() * 100) + ''
        // data.deleteAble = true
        // data.contentEditAble = true
        // data.styleEditAble = true
        // data.zEditable = false
        // data.yEditable = false
        // data.protection = true
        // data.xEditable = false
        // data.forceEdit = false
        // data.dynamic = false
        // data.topLayer = true
        // data.editorAutoScale = true
        // data.shouldUpdateBounds = false
      }
      let chunks = JSON.parse(JSON.stringify(this.chunks))
      chunks.push(data)
      this.$store.commit({
        type: 'poster/setChunks',
        chunks
      })
    },
    addHotArea() {
      this.$refs.hotAreas.addHotAreas()
    }
  }
}
</script>

<style lang="scss">
@import './styles';
</style>
