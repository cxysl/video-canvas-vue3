export default {
  namespaced: true,
  state: {
    canvasWidth: 750,
    canvasHeight: 450,
    size: 80,
    sizeRange: [20, 40, 60, 80, 100, 150, 200, 300, 400],
    currentSizeRange: 4,
    chunks: [],
    bgc: '#FFFFFF',
    editTextByicon: false,
    isCompatible: false,
    currentChunkIndex: '', //被选中 的元素所在层数下标
    snapTolerance: 2, //吸附像素距离
    snapToleranceByBlock: 3, //等间距
    copyChunk: {},
    title: '',
    posterType: 0,
    hotAreas: [],
    resetCanvasState() {},
    viewSizeOptions: [
      {
        label: 'PC端详情海报',
        width: 750,
        height: 400,
        type: 0
      },
      {
        label: 'PC端全屏海报',
        width: 1920,
        height: 600,
        type: 1
      },
      {
        label: '手机详情店铺首页',
        width: 1200,
        height: 1500,
        type: 2
      },
      {
        label: 'PC首页',
        width: 950,
        height: 400,
        type: 3
      },
      {
        label: '主图图标',
        width: 800,
        height: 800,
        type: 4
      }
    ],
    storageRecord: [],
    currentStorageIndex: -1,
    mode: 0,
    watermarkMode: 0, //水印类型1,2,3，的数组下标 0,1,2
    chunksWaterMarkArr: [],
    editorCanvasInstance: {},
    currentCanvasWidth: 750,
    currentCanvasHeight: 450,
    isShowEditText: false,
    bg: {
      img: '',
      opacity: 1,
      width: 750,
      height: 400,
      left: 0,
      top: 0,
      scale: 1,
      transformX: 1,
      transformY: 1
    },
    originalBg: {
      img: '',
      opacity: 1,
      width: 750,
      height: 400,
      left: 0,
      top: 0,
      scale: 1,
      transformX: 1,
      transformY: 1
    },
    isShowBgPanel: false,
    isShowClipBg: false,
    isShowTransformTool: false,
    selection: [],
    luBanBg: '',
    controlTextLineArr: [],
    priceRadioTb: 1,
    priceSwitch: true,
    tbDslInitData: {},
    isShowGift: true,
    changeWmMode: 0
  },
  getters: {
    selectedChunkType(state) {
      let { currentChunkIndex, chunks } = state
      if (currentChunkIndex === '') {
        return 'global'
      } else {
        return chunks[currentChunkIndex].type
      }
    }
  },
  mutations: {
    setChangeWmMode(state, payload) {
      let { changeWmMode } = payload
      state.changeWmMode = changeWmMode
    },
    //官方价格模式
    //  1：单件优惠价；2：多件凑单价；3：活动报名价
    setPriceRadioTb(state, payload) {
      let { priceRadioTb } = payload
      state.priceRadioTb = priceRadioTb
    },
    //是否显示赠品  默认显示
    setIsShowGift(state, payload) {
      let { isShowGift } = payload
      state.isShowGift = isShowGift
    },
    // 是否显示价格公式
    setPriceSwitch(state, payload) {
      let { priceSwitch } = payload
      state.priceSwitch = priceSwitch
    },
    //保存最初的dsl
    setTbDslInitData(state, payload) {
      let { tbDslInitData } = payload
      state.tbDslInitData = tbDslInitData
    },
    //官方利益点文案  有多个水印   改需求 已废弃
    // setControlTextLineArr(state, payload) {
    //   let { watermarkMode, controlText, toUpdate } = payload
    //   state.controlTextLineArr[watermarkMode] = controlText
    //   if (toUpdate) {
    //     try {
    //       state.chunks.forEach(chunk => {
    //         if (chunk.kind == 'controlTextLine1') {
    //           chunk.controlTextLine1 = controlText.controlTextLine1
    //           chunk.textContent = controlText.controlTextLine1
    //         }
    //         if (chunk.kind == 'controlTextLine2') {
    //           chunk.controlTextLine2 = controlText.controlTextLine2
    //           chunk.textContent = controlText.controlTextLine2
    //         }
    //       })
    //     } catch (error) {
    //       console.log('代码错误', error)
    //     }
    //   }
    // },
    //保存最初的DSL
    setLuBanBg(state, payload) {
      let { luBanBg } = payload
      state.luBanBg = luBanBg
    },
    // 复制元素
    setCopyChunk(state, payload) {
      let { copyChunk } = payload
      state.copyChunk = copyChunk
    },
    // 通过图标编辑文本
    setEditTextByicon(state, payload) {
      let { editTextByicon } = payload
      state.editTextByicon = editTextByicon
    },
    // 兼容电脑屏幕大小调整
    setIsCompatible(state, payload) {
      let { isCompatible } = payload
      state.isCompatible = isCompatible
    },
    // 设置水印类别栏
    setWatermarkMode(state, payload) {
      let { watermarkMode } = payload
      state.watermarkMode = watermarkMode
    },
    // 设置选中框可见
    setShowTransformTool(state, payload) {
      let { isShowTransformTool } = payload
      state.isShowTransformTool = isShowTransformTool
    },
    // 设置画布的原始大小
    setCanvasSize(state, payload) {
      let { width, height } = payload
      state.canvasWidth = width
      state.canvasHeight = height
    },
    // 设置可见区域的画布大小
    setCurrentCanvasSize(state, payload) {
      let { width, height } = payload
      state.currentCanvasWidth = width
      state.currentCanvasHeight = height
    },
    // 设置画布的组件实例，有些地方会用到
    setEditorCanvasInstance(state, payload) {
      state.editorCanvasInstance = payload.instance
    },
    // 设置海报标题
    setTitle(state, payload) {
      let { title } = payload
      state.title = title
    },
    // 设置窗口缩放比例
    setSize(state, payload) {
      let { size, index } = payload
      if (size) {
        state.size = size
        if (index || index === 0) {
          state.currentSizeRange = index
        }
      } else if (index || index === 0) {
        state.currentSizeRange = index
        state.size = state.sizeRange[index]
      }
    },
    // 设置背景颜色
    setBgc(state, payload) {
      state.bgc = payload.color
    },
    // 设置背景
    setBg(state, payload) {
      let { bg = {}, isModifyOrigin } = payload
      console.log(bg)
      state.bg = { ...bg }
      if (isModifyOrigin) {
        state.originalBg = { ...bg }
      }
    },
    // 设置当前多选的元素的index
    setSelection(state, payload) {
      let { selection = [] } = payload
      state.selection = [...selection]
    },
    // 设置当前选中的元素的index
    setCurrentChunkIndex(state, payload) {
      state.currentChunkIndex = payload.index
    },
    setResetCanvasState(state, payload) {
      state.resetCanvasState = payload.fn
    },
    // 设置海报元素
    setChunks(state, payload) {
      state.chunks = payload.chunks
      state.chunksWaterMarkArr[state.watermarkMode] = state.chunks
    },
    //保存水印元素(水印可多个)
    setChunksWaterMarkArr(state, payload) {
      let { watermarkMode, chunks } = payload
      state.chunksWaterMarkArr[watermarkMode] = chunks
    },
    // 设置海报的类型，类型包括PC详情，手机详情，PC海报等
    setPosterType(state, payload) {
      state.posterType = payload.posterType
    },
    // 设置热区信息
    setHotAreas(state, payload) {
      state.hotAreas = payload.hotAreas
    },
    setViewSizeOptions(state, payload) {
      state.viewSizeOptions = payload.options
    },
    //更新操作记录下标  (切换水印专用)
    setCurrentStorageIndex(state, payload) {
      let { currentStorageIndex } = payload
      state.currentStorageIndex = currentStorageIndex
    },
    // 存操作记录
    setStorageRecord(state) {
      // let m = state.mode
      if (state.currentStorageIndex < state.storageRecord.length - 1) {
        state.storageRecord = state.storageRecord.slice(
          0,
          state.currentStorageIndex + 1
        )
      }
      let obj = {
        chunks: JSON.parse(JSON.stringify(state.chunks)),
        bgc: state.bgc,
        canvasWidth: state.canvasWidth,
        canvasHeight: state.canvasHeight
      }
      let cache = JSON.parse(JSON.stringify(state.storageRecord))
      state.storageRecord = [...cache, obj]
      state.currentStorageIndex += 1
    },
    // 存操作记录By 水印
    setStorageRecordByWaterMark(state, payload) {
      let { storageRecord } = payload
      state.storageRecord = storageRecord
      state.currentStorageIndex += 1
    },

    // 撤销
    undo(state) {
      if (state.currentStorageIndex > 0) {
        // state.resetCanvasState()
        let obj = JSON.parse(
          JSON.stringify(state.storageRecord[state.currentStorageIndex - 1])
        )
        let { chunks, bgc, canvasWidth, canvasHeight } = obj
        state.chunks = chunks
        state.chunksWaterMarkArr[state.watermarkMode] = state.chunks
        state.isShowTransformTool = false
        state.bgc = bgc
        state.canvasWidth = canvasWidth
        state.canvasHeight = canvasHeight
        state.resetCanvasState()
        state.currentStorageIndex -= 1
      }
    },

    // 重做
    redo(state) {
      if (state.currentStorageIndex < state.storageRecord.length - 1) {
        // state.resetCanvasState()
        let obj = JSON.parse(
          JSON.stringify(state.storageRecord[state.currentStorageIndex + 1])
        )
        let { chunks, bgc, canvasWidth, canvasHeight } = obj
        state.chunks = chunks
        state.chunksWaterMarkArr[state.watermarkMode] = state.chunks
        state.isShowTransformTool = false
        state.bgc = bgc
        state.canvasWidth = canvasWidth
        state.canvasHeight = canvasHeight
        state.resetCanvasState()
        state.currentStorageIndex += 1
      }
    },
    // 设置是否显示编辑文案的框
    setIsShowEditText(state, payload) {
      let { isShow } = payload
      state.isShowEditText = isShow
    },
    // 切换背景编辑面板
    switchBgPanel(state, payload) {
      let { value } = payload
      state.isShowBgPanel = value
    },
    switchClipBg(state, payload) {
      let { value } = payload
      state.isShowClipBg = value
    }
  }
}
