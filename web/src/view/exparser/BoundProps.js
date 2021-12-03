// 管理data与绑定元素的更新 => data 数据 单向更新 ele的属性
const BoundProps = function () {}

BoundProps.prototype = Object.create(Object.prototype, {
  constructor: {
    value: BoundProps,
    writable: !0,
    configurable:!0
  }
})

BoundProps.create = function () {
  const tempObj = Object.create(BoundProps.prototype)
  tempObj._bindings = Object.create(null)
  return tempObj
}

BoundProps.prototype.add = function (exp, targetElem, targetProp, updateFunc) {
  const propDes = {
    exp: exp,
    targetElem: targetElem,
    targetProp: targetProp,
    updateFunc: updateFunc
  }
}
