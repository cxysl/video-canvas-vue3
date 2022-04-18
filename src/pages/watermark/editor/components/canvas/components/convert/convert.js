// import tbFontData from '../../../../../../../itemsManage/watermark/editor/fonts/data'
export function convertToChunks(modeData) {
  // 把官方的 DSL 转成我们的 chunks
  /**
   * 后期优化方案
   * 1、重构编辑器，全部使用官方协议的字段变量
   *    后端支持：然后需要改下数据库已存的所有水印协议、海报协议（改成官方的） 、还有插件项目的后端转换项目（把别人的水印转成我们的水印/海报 协议）
   *    前端涉及项目：营销、boss、抖店短信、node服务那边的渲染项目    4个项目
   */
  let modeDateTemp = []
  modeData.forEach(tb => {
    let chunks = []
    tb.layers.forEach(item => {
      //找茬发现 linkId 不为0 的元素是赠品元素 && item.linkId == 0
      if (item.visible) {
        let chunk = Object.assign({}, item)
        chunk.rotate = item.rotate
        chunk.type =
          item.layerType == 'image'
            ? 'img'
            : item.layerType == 'text'
            ? 'text'
            : ''
        chunk.opacity = item.opacity
        chunk.top = item.y
        chunk.left = item.x
        chunk.width = item.width
        chunk.height = item.height
        chunk.index = item.index

        if (item.layerType == 'image') {
          chunk.src = item.image
          chunk.transformY = 1
          chunk.transformX = 1
        } else if (item.layerType == 'text') {
          chunk.priceTag = item.algoType == 'price' //item.kind == "priceTag";
          chunk.xFontSpacing = 0
          // Number(
          //   parseFloat(item.letterSpacing / item.fontSize).toFixed(2)
          // )
          chunk.yFontSpacing = 1
          // Number(
          //   parseFloat(item.lineHeight / item.fontSize).toFixed(2)
          // )
          //   item.lineHeight;
          chunk.color = item.fill.color.substring(1)
          chunk.textAlign = item.textAlign
          chunk.textContent = item.text //item.name;
          if (chunk.priceTag && chunk.textContent == '?????') {
            chunk.textContent = '???'
          }
          chunk.fontFamily = item.fontFamily || 'AlibabaPuHuiTiR-MA'
          chunk.fontSize = item.fontSize
          chunk.fontWeight =
            item.fontWeight == 'bold'
              ? true
              : item.fontWeight == 'normal'
              ? false
              : false
          chunk.italic = item.fontStyle == 'italic'
          chunk.textDecoration =
            item.textDecoration == ' linethrough'
              ? 'line-through'
              : item.textDecoration == 'underline'
              ? 'underline'
              : ''
          /**
           * 由于字体原因 网上找的字体文件 有些效果还是和官方效果不一样 导致宽度不够或过多，宽度不够会换行，这里兼容下
           * +12px 显示，下面转回来的时候再减12个px
           */
          chunk.width += 12
        }
        chunk.canBeOption = item.styleEditAble && item.contentEditAble
        // chunk.canBeOption = true
        // if (
        //   [
        //     'priceTag',
        //     'subprice',
        //     'priceUnit',
        //     'controlTextLine1',
        //     'controlTextLine2',
        //     'controlDecoration1',
        //     'controlDecoration2'
        //   ].indexOf(item.kind) > -1
        // ) {
        //   chunk.canBeOption = false
        // }

        chunk.algoType = item.algoType
        chunk.kind = item.kind
        chunk.name = item.name
        chunk.dslType = item.type
        chunk.adsorbing = ['false', 'false']
        chunks.push(chunk)
      }
    })
    modeDateTemp.push({
      chunks,
      width: tb.width,
      height: tb.height,
      v: tb.v,
      mode: tb.mode,
      customziedWatermarkId: null,
      watermark: '',
      watermarkImagedata: ''
    })
  })
  return modeDateTemp
}
/**
 * 我们字体和官方字体名称不一样
 */
// function getTbFontFamily(bbtFontFamily) {
//   let flag = ''
//   tbFontData.forEach(item => {
//     if (item.value == bbtFontFamily) {
//       flag = item.tbValue
//     }
//   })
//   return flag || 'AlibabaPuHuiTiR-MA'
// }

/**
 * 转换文本
 * 我们的转成官方的
 */
function convertText(str) {
  //兼容官方的文字换行  官方用的 \n 或 \r
  str = str.replaceAll('<div>', '\n').replaceAll('</div>', '')
  //兼容官方的文字间空格
  str = str.replaceAll('&nbsp;', ' ')
  // 兼容（只是去掉乱码（html标签），效果不一样（我们的编辑器会识别html标签和及其样式）） 官方不识别 html 标签
  str = str.replace(/<[^>]+>/g, '')
  return str
}
export function convertToTbLayers(tbdsl, chunks) {
  //把我们的协议转成官方的协议
  let layers = []
  chunks.forEach((item, index) => {
    let layer = Object.assign({}, item)
    layer.visible = true
    layer.rotate = item.rotate
    layer.layerType =
      item.type == 'img' ? 'image' : item.type == 'text' ? 'text' : ''
    layer.opacity = item.opacity > 1 ? item.opacity / 100 : item.opacity
    layer.y = item.top
    layer.x = item.left
    layer.width = item.width
    layer.height = item.height
    layer.index = index //先测试下 官方的index有1000多的值

    if (item.type == 'img') {
      layer.image = item.src
    } else if (item.type == 'text') {
      layer.algoType = item.algoType

      //我们的是按数值(倍数)  官方是按像素（px）
      layer.letterSpacing = Number(item.xFontSpacing)
      // 测试发现 官方没有行间距 只是行高
      // layer.lineHeight = item.lineHeight
      let fill = {
        color: '#' + item.color,
        type: 'color'
      }
      layer.fill = fill
      layer.textAlign = item.textAlign
      layer.text = item.textContent
      layer.fontFamily = item.fontFamily || 'AlibabaPuHuiTiR-MA'
      // getTbFontFamily(item.fontFamily) || 'AlibabaPuHuiTiR-MA'
      layer.fontSize = item.fontSize
      layer.fontWeight = item.fontWeight == false ? 'normal' : 'bold'
      layer.fontStyle = item.italic ? 'italic' : 'normal'
      layer.textDecoration =
        item.textDecoration == 'line-through'
          ? 'linethrough'
          : item.textDecoration == 'underline'
          ? 'underline'
          : item.textDecoration == ''
          ? 'none'
          : ''
      layer.text = convertText(item.textContent)
      // if (item.textContent.indexOf('<div>') != -1) {
      //   console.log('bbt:', item.textContent)
      //   layer.text = item.textContent
      //     .replaceAll('<div>', '\n')
      //     .replaceAll('</div>', '')
      //   console.log('tb:', layer.text)
      // }

      // 见上面68行说明
      layer.width -= 12
    }
    layer.type = item.dslType
    /**
     * 过经过测试, 多余的 key 不影响,
     * 要删的话 只能保存操作是才删，预览不能删（因为后面还要操作）
     */
    // Object.keys(layer).map(key => {
    //   let delKey = [
    //     'adsorbing',
    //     'src',
    //     'textContent',
    //     'italic',
    //     'transformY',
    //     'transformX',
    //     'top',
    //     'left',
    //     'xFontSpacing',
    //     'yFontSpacing',
    //     'priceTag',
    //     'canBeOption',
    //     'dslType'
    //   ]
    //   if (delKey.indexOf(key) != -1) {
    //     delete layer[key]
    //   }
    // })
    layers.push(layer)
  })
  tbdsl.layers = layers
  return tbdsl
}
