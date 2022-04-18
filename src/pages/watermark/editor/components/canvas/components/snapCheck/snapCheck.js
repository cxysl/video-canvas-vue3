export function snapCheckLine(self) {
  if (self.active == '') {
    return
  }
  let chunksTemp = self.chunks
  //兼容画布比例
  let zoom = self.size / 100
  let canvasHeight = self.canvasHeight
  let canvasWidth = self.canvasWidth
  let snapTolerance = self.snapTolerance
  //兼容旋转后的元素
  let parentBounds = document
    .querySelector('.editor-canvas')
    .getBoundingClientRect()
  let chunksPositionTemp = [...document.querySelectorAll('.editor-el')].map(
    item => {
      let src =
        item.querySelector('.editor-el-img') == null
          ? null
          : item
              .querySelector('.editor-el-img')
              .getElementsByTagName('img')[0]
              .getAttribute('src')
      let textContent =
        item.querySelector('.editor-el-text') == null
          ? null
          : item
              .querySelector('.editor-el-text')
              .getElementsByTagName('span')[0].innerHTML
      let child = item.getBoundingClientRect()
      return {
        width: (child.width - 2) / zoom,
        height: (child.height - 2) / zoom,
        top: (child.top - parentBounds.top) / zoom,
        left: (child.left - parentBounds.left) / zoom,
        src: src,
        textContent: textContent
      }
    }
  )
  let choiceChunk = chunksTemp[self.active]
  // 初始化辅助线数据   this  变成    self
  // console.log("choiceChunk",choiceChunk)

  // 初始化辅助线数据
  const temArr = new Array(3).fill({
    display: false,
    position: '',
    origin: '',
    lineLength: ''
  })
  const refLine = { vLine: [], hLine: [] }
  for (let i in refLine) {
    refLine[i] = JSON.parse(JSON.stringify(temArr))
  }

  let tem = {
    value: { x: [[], [], []], y: [[], [], []] },
    display: [],
    position: []
  }
  let top = choiceChunk.top || 0
  let left = choiceChunk.left || 0
  let width = choiceChunk.width || 0
  let height = choiceChunk.height || 0
  // eslint-disable-next-line
  let bottom = canvasHeight - top - height
  // eslint-disable-next-line
  let right = canvasWidth - left - width
  if (choiceChunk.rotate != 0) {
    chunksPositionTemp.forEach(obj => {
      if (
        obj.src != null
          ? obj.src == choiceChunk.src
          : obj.textContent == choiceChunk.textContent
      ) {
        width = obj.width
        height = obj.height
        top = obj.top
        left = obj.left
        bottom = canvasHeight - top - height
        right = canvasWidth - left - width
      }
    })
  }
  //遍历其他元素 进行对齐判断
  chunksTemp.forEach((item, index) => {
    if (index == self.active || (!self.isShowGift && item.linkId != 0)) {
      //和自己不用检测
      return true
    }
    let w = item.width
    let h = item.height
    let l = item.left
    let t = item.top

    if (item.rotate != 0) {
      //没旋转的不用做转换
      chunksPositionTemp.forEach(obj => {
        if (
          obj.src != null
            ? obj.src == item.src
            : obj.textContent == item.textContent
        ) {
          w = obj.width
          h = obj.height
          t = obj.top
          l = obj.left
        }
      })
    }
    let activeLeft = left
    let activeRight = left + width
    let activeTop = top
    let activeBottom = top + height

    const r = l + w // 对齐目标right
    const b = t + h // 对齐目标的bottom

    const hc = activeTop + height / 2 - (t + h / 2) // 水平中线
    const vc = activeLeft + width / 2 - (l + w / 2) // 垂直中线
    //其他      自己
    const ts = t - activeBottom // 上 匹配  下
    const TS = b - activeBottom // 下 匹配 下
    const bs = t - activeTop // 上 匹配 上
    const BS = b - activeTop // 下 匹配 上

    const ls = l - activeRight // 左 匹配 右
    const LS = r - activeRight // 右 匹配 右
    const rs = l - activeLeft // 左 匹配 左
    const RS = r - activeLeft // 右 匹配 左

    tem['display'] = [
      Math.abs(ts) <= snapTolerance,
      Math.abs(TS) <= snapTolerance,
      Math.abs(bs) <= snapTolerance,
      Math.abs(BS) <= snapTolerance,
      Math.abs(hc) <= snapTolerance,
      Math.abs(hc) <= snapTolerance,
      Math.abs(ls) <= snapTolerance,
      Math.abs(LS) <= snapTolerance,
      Math.abs(rs) <= snapTolerance,
      Math.abs(RS) <= snapTolerance,
      Math.abs(vc) <= snapTolerance,
      Math.abs(vc) <= snapTolerance
    ]
    tem['position'] = [
      t,
      b,
      t,
      b,
      t + h / 2,
      t + h / 2,
      l,
      r,
      l,
      r,
      l + w / 2,
      l + w / 2
    ]

    let ishc = false
    let isvc = false
    if (Math.abs(hc) <= snapTolerance) {
      tem.value.y[2].push(l, r, activeLeft, activeRight)
      chunksTemp[self.active].top += hc
      chunksTemp[self.active].adsorbing[1] = 'left'
      ishc = true
    }
    if (Math.abs(vc) <= snapTolerance) {
      tem.value.x[2].push(t, b, activeTop, activeBottom)
      chunksTemp[self.active].left += vc
      chunksTemp[self.active].adsorbing[0] = 'top'
      isvc = true
    }

    if (Math.abs(ts) <= snapTolerance) {
      tem.value.y[0].push(l, r, activeLeft, activeRight)
      !ishc ? (chunksTemp[self.active].top += ts) : ''
      chunksTemp[self.active].adsorbing[0] = 'top'
    }
    if (Math.abs(bs) <= snapTolerance) {
      tem.value.y[0].push(l, r, activeLeft, activeRight)
      !ishc ? (chunksTemp[self.active].top += bs) : ''
      chunksTemp[self.active].adsorbing[0] = 'top'
    }
    if (Math.abs(TS) <= snapTolerance) {
      tem.value.y[1].push(l, r, activeLeft, activeRight)
      !ishc ? (chunksTemp[self.active].top += TS) : ''
      chunksTemp[self.active].adsorbing[0] = 'top'
    }
    if (Math.abs(BS) <= snapTolerance) {
      tem.value.y[1].push(l, r, activeLeft, activeRight)
      !ishc ? (chunksTemp[self.active].top += BS) : ''
      chunksTemp[self.active].adsorbing[0] = 'top'
    }

    if (Math.abs(ls) <= snapTolerance) {
      tem.value.x[0].push(t, b, activeTop, activeBottom)
      !isvc ? (chunksTemp[self.active].left += ls) : ''
      chunksTemp[self.active].adsorbing[1] = 'left'
    }
    if (Math.abs(rs) <= snapTolerance) {
      tem.value.x[0].push(t, b, activeTop, activeBottom)
      !isvc ? (chunksTemp[self.active].left += rs) : ''
      chunksTemp[self.active].adsorbing[1] = 'left'
    }
    if (Math.abs(LS) <= snapTolerance) {
      tem.value.x[1].push(t, b, activeTop, activeBottom)
      !isvc ? (chunksTemp[self.active].left += LS) : ''
      chunksTemp[self.active].adsorbing[1] = 'left'
    }
    if (Math.abs(RS) <= snapTolerance) {
      tem.value.x[1].push(t, b, activeTop, activeBottom)
      !isvc ? (chunksTemp[self.active].left += RS) : ''
      chunksTemp[self.active].adsorbing[1] = 'left'
    }

    if (
      Math.abs(chunksTemp[self.active].top - self.mouseClickPositionTemp.top) >
      snapTolerance
    ) {
      chunksTemp[self.active].top = self.mouseClickPositionTemp.top
      chunksTemp[self.active].adsorbing[0] = 'false'
    }
    if (
      Math.abs(
        chunksTemp[self.active].left - self.mouseClickPositionTemp.left
      ) > snapTolerance
    ) {
      chunksTemp[self.active].left = self.mouseClickPositionTemp.left
      chunksTemp[self.active].adsorbing[1] = 'false'
    }
    // 辅助线坐标与是否显示(display)对应的数组,易于循环遍历
    const arrTem = [0, 1, 0, 1, 2, 2, 0, 1, 0, 1, 2, 2]
    for (let i = 0; i <= arrTem.length; i++) {
      // 前6为Y辅助线,后6为X辅助线
      const xory = i < 6 ? 'y' : 'x'
      const horv = i < 6 ? 'hLine' : 'vLine'
      if (tem.display[i]) {
        const { origin, length } = calcLineValues(
          tem.value[xory][arrTem[i]],
          self.size
        )
        refLine[horv][arrTem[i]].display = tem.display[i]
        refLine[horv][arrTem[i]].position = tem.position[i] * zoom + 'px'
        refLine[horv][arrTem[i]].origin = origin
        refLine[horv][arrTem[i]].lineLength = length
      }
    }
  })
  // console.log('refLine',refLine)
  return self.getRefLineParams(refLine) //刷新 辅助线
}

function calcLineValues(arr, size) {
  // console.log('arr',arr)
  let zoom = size / 100
  const length = (Math.max(...arr) - Math.min(...arr)) * zoom + 'px'
  const origin = Math.min(...arr) * zoom + 'px'
  return { length, origin }
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
// 等间距
export function snapCheckBlock(self) {
  if (self.active == '') {
    return
  }
  let chunksTemp = self.chunks
  //兼容画布比例
  let canvasHeight = self.canvasHeight
  let canvasWidth = self.canvasWidth
  let snapTolerance = self.snapToleranceByBlock
  let choiceChunk = chunksTemp[self.active]
  let zoom = self.size / 100
  //兼容旋转后的元素
  let parentBounds = document
    .querySelector('.editor-canvas')
    .getBoundingClientRect()
  let chunksPositionTemp = [...document.querySelectorAll('.editor-el')].map(
    item => {
      let src =
        item.querySelector('.editor-el-img') == null
          ? null
          : item
              .querySelector('.editor-el-img')
              .getElementsByTagName('img')[0]
              .getAttribute('src')
      let textContent =
        item.querySelector('.editor-el-text') == null
          ? null
          : item
              .querySelector('.editor-el-text')
              .getElementsByTagName('span')[0].innerHTML
      let child = item.getBoundingClientRect()
      return {
        width: (child.width - 2) / zoom,
        height: (child.height - 2) / zoom,
        top: (child.top - parentBounds.top) / zoom,
        left: (child.left - parentBounds.left) / zoom,
        src: src,
        textContent: textContent
      }
    }
  )

  // 初始化等间距数据
  const refBlock = { vBlock: [], hBlock: [] }

  let top = choiceChunk.top || 0
  let left = choiceChunk.left || 0
  let width = choiceChunk.width || 0
  let height = choiceChunk.height || 0

  if (choiceChunk.rotate != 0) {
    chunksPositionTemp.forEach(obj => {
      if (
        obj.src != null
          ? obj.src == choiceChunk.src
          : obj.textContent == choiceChunk.textContent
      ) {
        width = obj.width
        height = obj.height
        top = obj.top
        left = obj.left
      }
    })
  }

  //遍历其他元素 进行对齐判断

  let maxleft = 0
  let maxtop = 0
  let maxright = canvasWidth
  let maxbottom = canvasHeight
  // 暂时 不加 4 个边界
  refBlock['vBlock'] = []
  refBlock['hBlock'] = []
  let matched = []
  chunksTemp.forEach((item, index0) => {
    if (refBlock['hBlock'].length >= 2) {
      return
    }
    let isMatching = false
    let checkSpace = [{}, {}, {}, {}]
    let spaceNum = []
    if (
      index0 == self.active ||
      index0 == 0 ||
      (!self.isShowGift && item.linkId != 0)
    ) {
      //和自己不用
      return true
    }
    let w = item.width
    let h = item.height
    let l = item.left
    let t = item.top

    if (item.rotate != 0) {
      //没旋转的不用做转换
      chunksPositionTemp.forEach(obj => {
        if (
          obj.src != null
            ? obj.src == item.src
            : obj.textContent == item.textContent
        ) {
          w = obj.width
          h = obj.height
          t = obj.top
          l = obj.left
        }
      })
    }

    const r = l + w // 对齐目标right
    const b = t + h // 对齐目标的bottom
    maxleft = Math.min(l, left)
    maxtop = Math.min(t, top)
    maxright = Math.max(r, left + width)
    maxbottom = Math.max(b, top + height)
    if (l < width + left && r > left) {
      isMatching = true
      // 找上下间距
      if (t > top + height) {
        checkSpace[0] = {
          space: t - top - height,
          index: index0,
          type: 'bt' //自己的下找别人的上
        }
        spaceNum[0] = t - top - height
      } else if (b < top) {
        checkSpace[1] = {
          space: top - b,
          index: index0,
          type: 'tb'
        }
        spaceNum[1] = top - b
      }
    }
    if (b > top && t < top + height) {
      isMatching = true
      //找左右间距
      if (l > left + width) {
        checkSpace[2] = {
          space: l - left - width,
          index: index0,
          type: 'rl'
        }
        spaceNum[2] = l - left - width
      } else if (r < left) {
        checkSpace[3] = {
          space: left - r,
          index: index0,
          type: 'lr'
        }
        spaceNum[3] = left - r
      }
    }
    if (isMatching != true) {
      return true
    }
    chunksTemp.forEach((item2, index2) => {
      if (refBlock['hBlock'].length >= 2) {
        return
      }
      // 不用匹配的
      if (
        index2 == index0 ||
        index2 == self.active ||
        index2 == 0 ||
        (!self.isShowGift && item2.linkId != 0)
      ) {
        return true
      }
      let flagGoOn = true
      matched.some(item => {
        if (item.index0 == index2 && item.index2 == index0) {
          flagGoOn = false
          return true
        }
      })
      if (!flagGoOn) {
        return true
      }
      // console.log('active',self.active,'   index0',index0,'   index2',index2)
      let w2 = item2.width
      let h2 = item2.height
      let l2 = item2.left
      let t2 = item2.top
      if (item2.rotate != 0) {
        //没旋转的不用做转换
        chunksPositionTemp.forEach(obj => {
          if (
            obj.src != null
              ? obj.src == item2.src
              : obj.textContent == item2.textContent
          ) {
            w2 = obj.width
            h2 = obj.height
            t2 = obj.top
            l2 = obj.left
          }
        })
      }
      const r2 = l2 + w2 // 对齐目标right
      const b2 = t2 + h2 // 对齐目标的bottom
      let TB = [] // 针对第一个匹配而言
      let BT = []
      let LR = []
      let RL = []
      if (l2 < maxright && r2 > maxleft) {
        // 找上下间距
        // 自己和第二次选的元素间距     第一次选的元素和第二次选的元素的间距
        TB = [t2 - top - height, t - b2]
        BT = [top - b2, t2 - b]
      }
      if (b2 > maxtop && t2 < maxbottom) {
        //找左右间距
        LR = [l2 - left - width, l - r2]
        RL = [left - r2, l2 - r]
      }

      //--- TB ---
      if (Math.abs(TB[0] - spaceNum[1]) <= snapTolerance) {
        refBlock['hBlock'].push({
          top: b,
          left: Math.min(l, left),
          width: Math.max(r, left + width) - Math.min(l, left),
          height: Math.abs(spaceNum[1])
        })
        refBlock['hBlock'].push({
          top: top + height,
          left: Math.min(l2, left),
          width: Math.max(r2, left + width) - Math.min(l2, left),
          height: Math.abs(TB[0])
        })
        matched.push({ index0, index2 })
      } else if (Math.abs(TB[1] - spaceNum[1]) <= snapTolerance) {
        refBlock['hBlock'].push({
          top: b,
          left: Math.min(l, left),
          width: Math.max(r, left + width) - Math.min(l, left),
          height: Math.abs(spaceNum[1])
        })
        refBlock['hBlock'].push({
          top: b2,
          left: Math.min(l2, l),
          width: Math.max(r2, r) - Math.min(l2, l),
          height: Math.abs(TB[1])
        })
        matched.push({ index0, index2 })
      }
      //--- BT ---
      if (Math.abs(BT[0] - spaceNum[0]) <= snapTolerance) {
        refBlock['hBlock'].push({
          top: top + height,
          left: Math.min(l, left),
          width: Math.max(r, left + width) - Math.min(l, left),
          height: Math.abs(spaceNum[0])
        })
        refBlock['hBlock'].push({
          top: b2,
          left: Math.min(l2, left),
          width: Math.max(r2, left + width) - Math.min(l2, left),
          height: Math.abs(BT[0])
        })
        matched.push({ index0, index2 })
      } else if (Math.abs(BT[1] - spaceNum[0]) <= snapTolerance) {
        refBlock['hBlock'].push({
          top: top + height,
          left: Math.min(l, left),
          width: Math.max(r, left + width) - Math.min(l, left),
          height: Math.abs(spaceNum[0])
        })
        refBlock['hBlock'].push({
          top: b,
          left: Math.min(l2, l),
          width: Math.max(r2, r) - Math.min(l2, l),
          height: Math.abs(BT[1])
        })
        matched.push({ index0, index2 })
      }
      //--- LR ---
      if (Math.abs(LR[0] - spaceNum[3]) <= snapTolerance) {
        refBlock['vBlock'].push({
          top: Math.min(t, top),
          left: r,
          width: Math.abs(spaceNum[3]),
          height: Math.max(b, top + height) - Math.min(t, top)
        })
        refBlock['vBlock'].push({
          top: Math.min(t2, top),
          left: left + width,
          width: Math.abs(LR[0]),
          height: Math.max(b2, top + height) - Math.min(t2, top)
        })
        matched.push({ index0, index2 })
      } else if (Math.abs(LR[1] - spaceNum[3]) <= snapTolerance) {
        refBlock['vBlock'].push({
          top: Math.min(t, top),
          left: r,
          width: Math.abs(spaceNum[3]),
          height: Math.max(b, top + height) - Math.min(t, top)
        })
        refBlock['vBlock'].push({
          top: Math.min(t, t2),
          left: r2,
          width: Math.abs(LR[1]),
          height: Math.max(b2, b) - Math.min(t, t2)
        })
        matched.push({ index0, index2 })
      }
      //--- RL ---
      if (Math.abs(RL[0] - spaceNum[2]) <= snapTolerance) {
        refBlock['vBlock'].push({
          top: Math.min(t, top),
          left: left + width,
          width: Math.abs(spaceNum[2]),
          height: Math.max(b, top + height) - Math.min(t, top)
        })
        refBlock['vBlock'].push({
          top: Math.min(t2, top),
          left: r2,
          width: Math.abs(RL[0]),
          height: Math.max(b2, top + height) - Math.min(t2, top)
        })
        matched.push({ index0, index2 })
      } else if (Math.abs(RL[1] - spaceNum[2]) <= snapTolerance) {
        refBlock['vBlock'].push({
          top: Math.min(t, top),
          left: left + width,
          width: Math.abs(spaceNum[2]),
          height: Math.max(b, top + height) - Math.min(t, top)
        })
        refBlock['vBlock'].push({
          top: Math.min(t, t2),
          left: r,
          width: Math.abs(RL[1]),
          height: Math.max(b2, b) - Math.min(t, t2)
        })
        matched.push({ index0, index2 })
      }
    })
  })
  return self.getRefBlockParams(refBlock) //刷新 辅助线
}
