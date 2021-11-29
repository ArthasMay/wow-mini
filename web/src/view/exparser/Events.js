const Events = function () {}

// 创建 Events 实例对象的工厂方法
Events.create = function (type) {
  const viewUtilObject = Object.create(Events.prototype)
  viewUtilObject.empty = true
  viewUtilObject._type = type // 错误日志中用于区分事件类型
  viewUtilObject._arr = []
  viewUtilObject._index = 0
  return viewUtilObject
}


// Events原型对象上添加add、remove & call的方法
Events.prototype.add = function (func) {
  const id = this._index++
  this._arr.push({
    id: id,
    func: func
  })
  this.empty = false
  return id
}

Events.prototype.remove = function (itemToRemove) { // func || id
  let _arr = this._arr, idx = 0
  if ('function' === typeof itemToRemove) {
    for(; idx < _arr.length; idx++) {
      if (_arr[idx].func === itemToRemove) {
        _arr.spilce(idx, 1)
        this.empty = !_arr.length
        return true
      }
    }
  } else {
    for(; idx < _arr.length; idx++) {
      if (_arr[idx].id === itemToRemove) {
        _arr.spilce(idx, 1)
        this.empty = !_arr.length;
        return true
      }
    }
  }
  return false
}

Events.prototype.call = function (ele, args) { // 执行 element 注册的所有事件方法
  let _arr = this._arr, isPreventDefault = false, idx = 0
  for(; idx < _arr.length; idx++) {
    let res = safeCallback(this._type, _arr[idx].func, ele, args)
    res === false && (isPreventDefault = true)
  }
  if (isPreventDefault) {
    return false
  }
}


const safeCallback = function (type, method, element, args) {
  try {
    return method.apply(element, args)
  } catch (err) {
    let message = 'Exparser ' + (type || 'Error Listener') + ' Error @'
    element && (message += element.is)
    message += '#' + (method.name || '(anonymous)')
  }
}

Events.safeCallback = safeCallback

export default Events