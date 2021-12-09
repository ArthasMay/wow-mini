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
  
  let bindings = this._bindings
  let bindedProps = exp.bindedProps

  for (let idx = 0; idx < bindedProps.length; idx++) {
    let prop = bindedProps[idx]
    bindings[prop] || (bindings[prop] = [])
    bindings[prop].push(propDes)
  }
}

// 更新变量propKey相关联的元素ele的属性
BoundProps.prototype.update = function (ele, propData, propKey) {
  let _binding = this._bindings[propKey]
  if (_binding) {
    for (let idx = 0; idx < _binding.length; idx++) {
      let boundProp = _binding[idx]
      // ? 每个data中绑定的属性变动都会更新ele的属性吗？
      boundProp.updateFunc(boundProp.targetElem, boundProp.targetProp, boundProp.exp.calculate(ele, propData))
    }
  }
}

export default BoundProps