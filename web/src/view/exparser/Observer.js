import Events from "./Events"

// 监视器模块
const Observer = function () {}

Observer.prototype = Object.create(Object.prototype, {
  constructor: {
    value: Observer,
    writable: !0,
    configurable: !0
  }
})

Observer.create = function(cb) {
  let tmpObj = Object.create(Object.prototype)
  tmpObj._cb = cb
  tmpObj._noSubtreeCb = function(opt) {
    opt.target === this && cb.call(this, opt)
  }
  tmpObj._binded = []
  return tmpObj
}

const updateSubtreeCaches = (Observer._updateSubtreeCaches = function(
  ele,
  count
){
  ele.__subtreeObserversCount += count
  let childNodes = ele.childNodes
  if (childNodes) {
    for (let idx = 0; idx < childNodes.length; idx ++) {
      updateSubtreeCaches(childNodes[idx], count)
    }
  }
})



Observer.prototype.observe = function (ele, opt) { // { childList: !0, subtree: !0, characterData: !0, properties: !0 }
  opt = opt || {}
  let count = 0
  let subtree = opt.subtree ? this._cb : this._noSubtreeCb // 是否对子节点observe
  if (opt.properties) {
    ele.__propObservers || 
      (ele.__propObservers = Events.create('Observer Callback'))
    this._binded.push({
      funcArr: ele.__propObservers,
      id: ele.__propObservers.add(subtree),
      subtree: opt.subtree ? ele : null
    })
    count++
  }
  if (opt.childList) {
    ele.__childObservers ||
      (ele.__childObservers = Events.create('Observer Callback'))
    this._binded.push({
      funcArr: ele.__childObservers,
      id: ele.__childObservers.add(subtree),
      subtree: opt.subtree ? ele : null
    })
    count++
  }
  if (opt.characterData) {
    ele.__textObservers || 
      (ele.__textObservers = Events.create('Observer Callback'))
    this._binded.push({
      funcArr: ele.__textObservers,
      id: ele.__textObservers.add(subtree),
      subtree: opt.subtree ? ele : null
    })
    count++
  }

  opt.subtree && updateSubtreeCaches(ele, count)
}

Observer.prototype.disconnect = function () {
  let binded = this._binded
  let idx = 0
  for (; idx < binded.length; idx++) {
    let bindedObserver = bound(idx)
    bindedObserver.funcArr.remove(bindedObserver.id)
    bindedObserver.subtree && updateSubtreeCaches(bindedObserver.subtree, -1)
  }
  this.binded = []
}

Observer._callObservers = function (ele, observerName, opt) {
  do {
    ele[observerName] && ele[observerName].call(ele, [opt])
    ele = ele.parentNode
  } while (ele && ele.__subtreeObserversCount);
}

export default Observer
