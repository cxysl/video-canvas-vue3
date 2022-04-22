/*
 * @Author: chengsl
 * @Date: 2022-04-20 10:48:37
 * @LastEditors: chengsl
 * @LastEditTime: 2022-04-20 18:09:03
 * @Description: file content
 */
/**
 * element ui弹窗可拖拽
 */
export default {
  name: 'el-dialog-drag',
  bind(el, _, vnode) {
    const dragDom = el.querySelector('.el-dialog')
    const dialogHeaderEl = el.querySelector('.el-dialog__header')
    dragDom.style.cssText += ';top:0px;'
    dragDom.parentNode.style.overflow = 'hidden'
    dialogHeaderEl.style.cssText += ';cursor:move;'

    dialogHeaderEl.onmousedown = (e) => {
      const disX = e.clientX - dialogHeaderEl.offsetLeft
      const disY = e.clientY - dialogHeaderEl.offsetTop

      const dragDomWidth = dragDom.offsetWidth
      const dragDomHeight = dragDom.offsetHeight

      const screenWidth = document.body.clientWidth
      const screenHeight = document.body.clientHeight

      const minDragDomLeft = dragDom.offsetLeft
      const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth

      const minDragDomTop = dragDom.offsetTop
      const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomHeight

      const styleLeftStr = getComputedStyle(dragDom).left
      const styleTopStr = getComputedStyle(dragDom).top
      if (!styleLeftStr || !styleTopStr) {
        return
      }
      let styleLeft
      let styleTop

      // Format may be "##%" or "##px"
      if (styleLeftStr.includes('%')) {
        styleLeft =
          +document.body.clientWidth * (+styleLeftStr.replace(/%/g, '') / 100)
        styleTop =
          +document.body.clientHeight * (+styleTopStr.replace(/%/g, '') / 100)
      } else {
        styleLeft = +styleLeftStr.replace(/px/g, '')
        styleTop = +styleTopStr.replace(/px/g, '')
      }

      document.onmousemove = (e) => {
        // tslint:disable-line
        let left = e.clientX - disX
        let top = e.clientY - disY

        // Handle edge cases
        if (-left > minDragDomLeft) {
          left = -minDragDomLeft
        } else if (left > maxDragDomLeft) {
          left = maxDragDomLeft
        }
        if (-top > minDragDomTop) {
          top = -minDragDomTop
        } else if (top > maxDragDomTop) {
          top = maxDragDomTop
        }

        // Move current element
        dragDom.style.cssText += `;left:${left + styleLeft}px;top:${
          top + styleTop
        }px;`

        // Emit onDialogDrag event
        // See https://stackoverflow.com/questions/49264426/vuejs-custom-directive-emit-event
        if (vnode.componentInstance) {
          vnode.componentInstance.$emit('onDialogDrag')
        } else if (vnode.elm) {
          vnode.elm.dispatchEvent(new CustomEvent('onDialogDrag'))
        }
      }

      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
}
