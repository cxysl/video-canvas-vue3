<template>
  <div class="image-space">
    <el-row :gutter="20">
      <el-col v-loading="categoryLoading" :span="6">
        <div class="search-bar">
          <el-autocomplete
            v-model="title"
            :fetch-suggestions="search"
            :props="{
              value: 'pictureCategoryName',
              label: 'pictureCategoryName'
            }"
            placeholder="按目录名搜素"
            @select="handleSelect"
          ></el-autocomplete>
        </div>
        <div class="image-categories-wrap">
          <el-tree
            ref="tree"
            :data="categories"
            highlight-current
            :current-node-key="currentKey"
            :default-expanded-keys="['0']"
            :props="defaultProps"
            node-key="pictureCategoryId"
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
          ></el-tree>
        </div>
      </el-col>
      <el-col :span="18">
        <div
          v-infinite-scroll="getIamges"
          class="img-list-wrap"
          infinite-scroll-disabled="busy"
          infinite-scroll-distance="10"
        >
          <ul class="img-list">
            <li v-for="(item, index) in images" :key="'img' + index">
              <div
                class="img-wrap"
                :class="{ active: selectionIds.indexOf(item.pictureId) > -1 }"
                @click="selectImg(item)"
              >
                <img v-lazy="`${item.picturePath}_100x100.jpg`" />
                <span
                  class="el-checkbox__input"
                  :class="{
                    'is-checked': selectionIds.indexOf(item.pictureId) > -1
                  }"
                >
                  <span class="el-checkbox__inner"></span>
                </span>
              </div>
            </li>
          </ul>
          <div v-if="loading" class="loading-text">正在加载...</div>
          <div v-else-if="images.length === 0" class="loading-text">
            暂无图片
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="storage-tips">
      温馨提示：如果您在图片空间新增了某条目录，那么需要您等待一小时左右才能看到新增的目录
    </div>
    <ul v-if="selection.length > 0" class="selected-bar">
      <li v-for="(item, index) in selection" :key="'image' + index">
        <div class="selected-img">
          <img :src="`${item.picturePath}_100x100.jpg`" />
        </div>
        <div class="delete-btn" @click="removeSelection(item)">
          <i class="icon-close">×</i>
        </div>
      </li>
    </ul>
    <div class="confirm-bar">
      <div v-if="selection.length > 0" class="selection-mount">
        <span>
          已选{{ selection.length
          }}{{ limit && limit > 0 ? `/${limit}` : '' }}张图片
        </span>
        <el-button type="text" @click="selection = []">清空所有图片</el-button>
      </div>
      <el-button
        class="confirm-btn"
        type="primary"
        size="large"
        :disabled="selection.length === 0"
        @click="confirm"
      >
        确定
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageSpace',
  props: {
    limit: {
      type: [Number, String],
      default: ''
    }
  },
	emits: ['confirm'],
  data() {
    return {
      defaultProps: {
        label: 'pictureCategoryName',
        children: 'children'
      },
      categories: [],
      expandCategories: [],
      pageNo: 1,
      pageSize: 24,
      categoryLoading: false,
      loading: false,
      title: '',
      images: [],
      pictureCategoryId: '',
      busy: true,
      selection: [],
      currentKey: '0'
    }
  },
  computed: {
    selectionIds() {
      return this.selection.map((item) => {
        return item.pictureId
      })
    }
  },
  created() {
    this.getCategories()
  },
  methods: {
    init() {
      this.pageNo = 1
      this.busy = true
      this.selection = []
      this.pictureCategoryId = ''
    },
    handleNodeClick(data, node, vm) {
      if (node && !node.isLeaf) {
        vm.expanded = true
        node.expanded = true
      }
      this.pageNo = 1
      this.images = []
      this.pictureCategoryId = data.pictureCategoryId
      this.getIamges()
    },
    getCategories() {
      this.categoryLoading = true
      this.expandCategories = []
      axios
        .get('/itemManage/pictureCategory.get')
        .then((res) => {
          this.categoryLoading = false
          let categories = [
            {
              children: res.data.data.items || [],
              pictureCategoryName: '全部图片',
              pictureCategoryId: '0'
            }
          ]
          this.categories = categories
          this.expand(this.categories)
          this.handleNodeClick(this.categories[0])
        })
        .catch((err) => {
          throw err
        })
    },
    expand(originalItems) {
      originalItems.forEach((item) => {
        if (item.children.length > 0) {
          this.expand(item.children)
        } else {
          this.expandCategories.push(item)
        }
      })
    },
    getIamges() {
      let params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        pictureCategoryId: this.pictureCategoryId
      }
      this.busy = true
      this.loading = true
      axios
        .get('/itemManage/pictures.get', { params })
        .then((res) => {
          let items = res.data.data.items
          this.pageNo++
          this.images.push(...items)
          if (items.length > 0) {
            this.busy = false
          }
          this.loading = false
        })
        .catch((err) => {
          this.loading = false
          throw err
        })
    },
    selectImg(item) {
      if (this.selectionIds.indexOf(item.pictureId) > -1) {
        this.removeSelection(item)
      } else {
        let len = this.selection.length
        if (this.limit && len >= this.limit) {
          return this.$message.warning(`最多可选择${this.limit}张图片`)
        }
        this.selection.push(JSON.parse(JSON.stringify(item)))
      }
    },
    removeSelection(selectedItem) {
      this.selection.forEach((item, index) => {
        if (selectedItem.pictureId === item.pictureId) {
          this.selection.splice(index, 1)
        }
      })
    },
    handleSelect(item) {
      // this.$refs.tree.setCheckedKeys([item.pictureCategoryId])
      this.currentKey = item.pictureCategoryId
      this.handleNodeClick(item)
      console.log(item)
    },
    search(query, cb) {
      let filterItems = this.expandCategories.filter((item) => {
        return item.pictureCategoryName.indexOf(query) > -1
      })
      cb(filterItems)
    },
    confirm() {
      let imgs = this.selection.map((item) => {
        return item.picturePath
      })
      this.$emit('confirm', imgs)
    }
  }
}
</script>

<style lang="scss">
@import './styles';
</style>
