<template>
  <ul class="materialMusic-list">
    <!--  上传音乐按钮  showAddMusicDialog  -->
    <li @click="showAddMusicDialog">
      <div class="item-main">
        <img
          type="music"
          src="//img.alicdn.com/imgextra/i2/17157061/O1CN01Pa0yOA221zJOF87fN_!!17157061-2-isvtu.png"
        />
      </div>
      <div class="title">自定义添加</div>
    </li>

    <!-- 上传音乐弹窗 -->
    <add-music-dialog
      ref="addMusicDialog"
      v-model:visible="isShowAddMusicDialog"
      :musics="musics"
      @add-musics="addMusics"
    ></add-music-dialog>

    <!-- 遍历之前上传的音乐 -->
    <li
      v-for="(item, index) in musics"
      :key="index"
      :class="{ active: index === active, small: size === 'small' }"
      @click="handler(index)"
      @mouseenter="ente(index)"
      @mouseleave="leave(index)"
    >
      <div class="item-wrap">
        <!-- 图片 -->
        <img v-lazy="true ? musicImg : item.img" />
        <!-- 显示音乐图片还是特效图片 -->
        <span
          v-if="item.nick != 'admin'"
          :class="hoverIndex == index ? 'shanchu' : 'dis-none'"
          @click="del(index)"
        >
          <img
            class="del_img"
            src="//img.alicdn.com/imgextra/i3/17157061/O1CN01vz1088221zJPPEoAs_!!17157061-2-isvtu.png"
          />
        </span>
      </div>
      <div class="title">{{ item.musicTitle }}</div>
      <!-- 名字 -->
    </li>
  </ul>
</template>

<script>
import addMusicDialog from './addMusicDialog'
export default {
  name: 'MaterialMusic',
  components: {
    addMusicDialog
  },
  props: {
    items: {
      type: Array,
      default() {
        return []
      }
    },
    musics: {
      type: Array,
      default() {
        return []
      }
    },
    type: {
			type: String,
			default: ''
		},
    size: {
      type: String,
      default: 'normal'
    },
    canvasChange: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'change',
    'videoReset',
    'update:items',
    'update:canvasChange',
		'update:musics',
    'add-musics'
  ],
  data() {
    return {
      active: 1,
      musicImg:
        'https://img.alicdn.com/imgextra/i4/17157061/TB2rm_or8jTBKNjSZFDXXbVgVXa-17157061.png',
      hoverIndex: -1,
      isShowAddMusicDialog: false,
      musicTitle: '',
      adminCount: 0
    }
  },
  watch: {
    musics: function (newVal) {
      let count = 0
      if (newVal != null) {
        for (let i of newVal) {
          //算出默认音乐有多少首
          if (i.nick == 'admin') count++
        }
      }
      this.adminCount = count
    }
  },
  created() {
    this.active = 0
    this.$emit('change', this.active)
  },
  methods: {
    handler(index) {
      this.$emit('update:canvasChange', true)
      if (this.type === 'music' && this.active === index) {
        //选中音乐后点击第二次 即禁音
        this.active = -1 - index
      } else {
        this.active = index
      }
      this.$emit('change', this.active)
    },
    ente(index) {
      if (this.musics[index].id <= this.adminCount) {
        // 默认音乐 不允许删除
        this.hoverIndex = -1
      } else {
        this.hoverIndex = index
      }
    },
    addMusics(musicTitle, musicUrl) {
      this.$emit('add-musics', musicTitle, musicUrl)
    },
    leave() {
      this.hoverIndex = -1
    },
    showAddMusicDialog() {
      console.log('???? you  click me')
      //   显示上传音乐界面
      return this.$message('抱歉，该功能已下线！')
      // this.isShowAddMusicDialog = true
    },
    del(index) {
      // this.musics.splice(index, 1) //  界面上删除这家伙
			const musicsTemp = JSON.parse(JSON.stringify(this.musics))
			musicsTemp.splice(index, 1)
			this.$emit('update:musics', musicsTemp)
      this.$message.success('删除成功,刷新后恢复')
      //  删除该音乐
      // axios
      //   .get('/template/video/delMusic.get', {
      //     params: {
      //       id: this.musics[index].id
      //     }
      //   })
      //   .then(res => {
      //     if (res.data.data.resultBool == true) {
      //       this.musics.splice(index, 1) //  界面上删除这家伙
      //       this.$message('删除成功')
      //     } else {
      //       this.$message(res.data.data.message)
      //     }
      //   })
      //   .catch(err => {
      //     console.log(err)
      //   })
    },

    //  监听添加图片弹窗的确定事件
    confirmAddMusics(newItems) {
			const currentItems = JSON.parse(JSON.stringify(items))
      if (Array.isArray(newItems)) {
        newItems.forEach((item) => {
          // this.items.push(item)
          currentItems.push(item)
        })
      }
      if (typeof newItems === 'string') {
        // this.items.push(newItems)
          currentItems.push(item)
      }
      this.$emit('update:items', [...currentItems])
      this.$emit('videoReset')
    },
    //  swf参数初始化完成的回调
    initComplete() {
      this.$refs.addMusicDialog.addTblmageLoading = false
      this.isIniting = false
    }
  }
}
</script>
<style lang="scss">
.materialMusic-list {
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
      width: 110px;
      overflow: hidden; /*超出部分隐藏*/
      text-overflow: ellipsis; /* 超出部分显示省略号 */
      white-space: nowrap; /*规定段落中的文本不进行换行 */
      color: #fff;
      text-align: left;
    }
    .dis-none {
      display: none;
    }
    .shanchu {
      position: relative;
      display: inline;
      left: 50px;
      bottom: 95px;
    }
    .del_img {
      width: 40px;
      height: 40px;
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
