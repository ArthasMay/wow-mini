import Observer from "./Observer"

// Element 是虚拟dom的构造函数，用于构造虚拟dom对象
const Element = function () {}
Element.prototype = Object.create(Object.prototype, {
  constructor: {
    value: Element,
    writable: !0,
    configurable: !0
  }
})

let componentSystem = null
Element._setComponentSystem = function(componentSys) {
  componentSystem = componentSys
}

Element.initialize = function (ele) {
  ele.__attached = false
  ele.parentNode = null
  ele.childNodes = []
  ele.__slotParent = null              // 如果是slot节点吗，挂载slot的父节点
  ele.__slotChildren = ele.childNodes  
  ele.__subtreeObserversCount = 0
}

const attachedElement = function (ele) {
  // shadow tree上的节点进行attached初始化
  if (!ele.parentNode || ele.parentNode.__attached) {
    let setAttachedRecursively = function (ele) {
      ele.__attached = !0
      ele.shadowRoot instanceof Element && 
        setAttachedRecursively(ele.shadowRoot)
      let childNodes = ele.childNodes
      for (let idx = 0; idx < childNodes.length; idx++) {
        setAttachedRecursively(childNodes[idx])
      }
    }
  }
  setAttachedRecursively(ele)
  
  // 执行attached的声明周期函数
  let callAttachedLifeTimeFuncRecursively = function (ele) {
    ele.__lifeTimeFuncs && componentSystem._callLifeTimeFuncs(ele, 'attached')
    ele.shadowRoot instanceof Element && 
    callAttachedLifeTimeFuncRecursively(ele.shadowRoot)
    let childNodes = ele.childNodes
    for (let idx = 0; idx < childNodes.length; idx++) {
      callAttachedLifeTimeFuncRecursively(childNodes[idx])
    }
  }
}

const detachedElement = function (ele) {
  if (ele.__attached) {
    const detachRecursively = function (ele) {
      ele.__attached = !1
      ele.shadowRoot instanceof Element && detachRecursively(ele.shadowRoot)
      let childNodes = ele.childNodes
      if (childNodes) {
        for (let idx = 0; idx < childNodes.length; idx++) {
          detachRecursively(childNodes[idx])
        }
      }
    }
    detachRecursively(ele)
    
    const callDetachedLifeTimeFuncRecursively = function (ele) {
      ele.__lifeTimeFuncs && componentSystem._callLifeTimeFuncs(ele, 'detached')
      ele.shadowRoot instanceof Element && callDetachedLifeTimeFuncRecursively(ele.shadowRoot)
      let childNodes = ele.childNodes
      if (childNodes) {
        for (let idx = 0; idx < childNodes.length; idx++) {
          callDetachedLifeTimeFuncRecursively(childNodes[idx])
        }
      }
    }
    callDetachedLifeTimeFuncRecursively(ele)
  }
}

// 子组件观察者
const childObserver = function (ele, observerName, targetNode) {
  if (
    (ele.__childObservers && !ele.__childObservers.empty) ||
    ele.__subtreeObserversCount
  ) {
    let opt = null
    if (observerName === 'add') {
      opt = {
        type: 'childList',
        targetNode: ele,
        addedNodes: [targetNode]
      }
    } else {
      opt = {
        type: 'childList',
        targetNode: ele,
        removedNodes: [targetNode]
      }
    }
    Observer._callObservers(ele, '__childObservers', opt)
  }
}

const attachShadowRoot = function (
  componentObj,
  newNode,
  oldNode,
  isRemoveOldNode
) {
  // 增、 删、 改节点
  let copyOfOriginalElement = componentObj
  // 查找dom根节点
  if (copyOfOriginalElement instanceof Element) {
    for (; copyOfOriginalElement.__virtual;) {
      let slotParent =  copyOfOriginalElement.__slotParent
      if (!slotParent) {
        return
      }
      if (newNode && !oldNode) {
        // 为插入新的节点铺垫，暂时不知道干什么的
        let oldNodeIdx = slotParent.__slotChildren.indexOf(
          copyOfOriginalElement
        )
        // 这句完全不知道干啥的
        oldNode = slotParent.__slotChildren[oldNodeIdx + 1]
      }
      copyOfOriginalElement instanceof Element && 
      (copyOfOriginalElement = copyOfOriginalElement.__domElement)
    }

    let newDomEle = null
    if (newNode) {
      // 找newNode的dom节点
      if (newNode.__virtual) {
        let fragment = document.createDocumentFragment()
        let appendDomElement = function (ele) {
          for (
            let slotIdx = 0;
            slotIdx < ele.__slotChildren.length;
            slotIdx++
          ) {
            let slotChild = ele.__slotChildren[slotIdx]
            slotChild.__virtual 
            ? appendDomElement(slotChild) 
            : fragment.appendChild(slotChild.__domElement)
          }
        }
        appendDomElement(newNode)
        newDomEle = fragment
      } else {
        newDomEle = newNode.__domElement
      }
    }

    let oldDomEle = null
    if (oldNode) {
      if (oldNode.__virtual) {
        let oldParentNode = componentObj
        let oldNodeIdx = 0
        if (isRemoveOldNode) {
          let removeDomElement = function (ele) {
            for (
              let slotChildIdx = 0;
              slotChildIdx < ele.__slotChildren.length;
              slotChildIdx++
            ) {
              let slotChild = ele.__slotChildren[slotIdx]
              slotChild.__virtual 
              ? removeDomElement(slotChild)
              : copyOfOriginalElement.removeChild(slotChild.__domElement)
            }
          }
          removeDomElement(oldNode)
          isRemoveOldNode = !1
          oldNodeIdx = componentObj.__slotChildren.indexOf(oldNode) + 1
        } else {
          oldParentNode = oldNode.__slotParent
          oldNodeIdx = oldParentNode.__slotChildren.indexOf(oldNode)
        }
        if (newNode) {
          let findNonVirtualNode = function (ele, idx) {
            for (; idx < ele.__slotChildren.length; idx++) {
              let slotChild = ele.__slotChildren[idx]
              if (!slotChild.__virtual) {
                return slotChild
              }
              let childNode = findNonVirtualNode(slotChild, 0)
              if (childNode) {
                return childNode
              }
            }
          }
          oldNode = null
          let curOldParentNode = oldParentNode
          for(
            ;
            (oldNode = findNonVirtualNode(curOldParentNode, oldParentNode)),
            !oldNode && curOldParentNode.__virtual;
            curOldParentNode = curOldParentNode.__slotParent
          ) {
            oldNodeIdx = curOldParentNode.__slotParent.__slotChildren.indexOf(
              curOldParentNode
            ) + 1
          }
          oldNode && (oldDomEle = oldNode.__domElement) // ??是否存在的!oldNode 但nOrigParentNode.__virtual为false?
        }
      } else {
        oldDomEle = oldNode.__domElement
      }
    }

    if (isRemoveOldNode) {
      newDomEle
      ? copyOfOriginalElement.replaceChild(newDomEle, oldDomEle)
      : copyOfOriginalElement.removeChild(oldDomEle)
    } else {
      newDomEle &&
        (oldDomEle
          ? copyOfOriginalElement.insertBefore(newDomEle, oldDomEle)
          : copyOfOriginalElement.appendChild(newDomEle))
    }
  }
}

const updateSubtree = function (ele, newNode, oldNode, willRemoveOldNode) {
  let oldNodeIndex = -1
  if (oldNode) {
    oldNodeIndex = ele.childNodes.indexOf(oldNode)
    if (oldNodeIndex < 0) {
      return false
    }
  }

  if (willRemoveOldNode) {
    if (newNode === oldNode) {
      willRemoveOldNode = !1
    } else {
      if (ele.__subtreeObserversCount) {
        Observer._updateSubtreeCaches(oldNode, -ele.__subtreeObserversCount)
      }
      oldNode.parentNode = null
      oldNode.__slotParent = null
    }
  }

  let parentNode = null
  let originalParentNode = ele
  ele.__slots && (originalParentNode = ele.__slots[''])

  if (newNode) {
    parentNode = newNode.parentNode
    newNode.parentNode = ele
    newNode.__slotParent = originalParentNode
    let subtreeObserversCount = ele.__subtreeObserversCount
    if (parentNode) {
      let originalIndexOfNewNode = parentNode.childNodes.indexOf(newNode)
      parentNode.childNodes.splice(originalIndexOfNewNode, 1)
      parentNode === ele && 
      originalParentNode < oldNodeIndex &&
      oldNodeIndex--
      subtreeObserversCount -= parentNode.__subtreeObserversCount
    }
    subtreeObserversCount && Observer._updateSubtreeCaches(newNode, subtreeObserversCount)
  }
  attachShadowRoot(originalParentNode, newNode, oldNode, willRemoveOldNode)
  if (newNode) {
    ele.childNodes.splice(oldNodeIndex, willRemoveOldNode ? 1 : 0, newNode)
  } else {
    ele.childNodes.splice(oldNodeIndex, willRemoveOldNode ? 1 : 0)
  }
  if (willRemoveOldNode) {
    detachedElement(oldNode)
    childObserver(ele, 'remove', oldNode)
  }

  if (newNode) {
    if (parentNode) {
      detachedElement(newNode)
      childObserver(ele, 'remove', newNode)
    }
    attachedElement(newNode)
    childObserver(ele, 'add', newNode)
  }
  return true
}

const childHandle = function (element, newNode, oldNode, willRemoveOldNode) {
  let retNode = willRemoveOldNode ? oldNode : newNode
  let isDone = updateSubtree(element, newNode, oldNode, willRemoveOldNode)
  return isDone ? retNode : null
}

Element.__attachShadowRoot = function (ele, node) {
  attachShadowRoot(ele, node, null, !1)
}

Element.appendChild = function (ele, newNode) {
  childHandle(ele, newNode, null, !1)
}

Element.insertBefore = function (ele, newNode, refNode) {
  childHandle(ele, newNode, refNode, !1)
}

Element.removeChild = function (ele, removedNode) {
  childHandle(ele, null, removedNode, !0)
}

Element.replaceChild = function (ele, newNode, oldNode) {
  childHandle(ele, newNode, oldNode, !0)
}

Element.replaceDecumentElement = function (ele, oldNode) {
  if (!ele.__attached) {
    oldNode.parentNode.replaceChild(ele.__domElement, oldNode)
    attachedElement(ele)
  }
}

// 原型方法
Element.prototype.appendChild = function (child) {
  return childHandle(this, child, null, !1)
}

Element.prototype.insertBefore = function (newChild, targetChild) {
  return childHandle(this, newChild, targetChild, !1)
}

Element.prototype.removeChild = function (oldChild) {
  return childHandle(this, null, oldChild, !0)
}

Element.prototype.replaceChild = function (newChild, targetChild) {
  return childHandle(this, newChild, targetChild, !0)
}

// Element.prototype.triggleE

