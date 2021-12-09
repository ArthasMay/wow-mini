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
        // 为插入新的节点铺垫
        
      }
    }
  }
}


