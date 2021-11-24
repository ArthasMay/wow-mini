import Events from "./Events"

const Behavior = function () {}

Behavior.prototype = Object.create(Object.prototype, {
  constructor: {
    value: Behavior,
    writable: true,
    configurable: true
  }
})

// 组件的声明周期方法
const cycle = ['created', 'attached', 'detached', 'contentChanged']
let index = 1

Behavior.create = function (opt) {
  let id = String(index++)
  let insBehavior = (Behavior.list[opt.is || ''
  ] = Object.create(Behavior.prototype, {
    is: {
      value: opt.is || ''
    },
    _id: {
      value: id
    }
  }))
  
  insBehavior.template = opt.template // Component的template模版
  insBehavior.properties = Object.create(null)
  insBehavior.methods = Object.create(null)
  insBehavior.listeners = Object.create(null)

  let ancestors = (insBehavior.ancestors = []),
    prop = '',
    idx = 0
  for (; idx < opt.behaviors.length; idx++) {
    let curBehavior = opt.behaviors[idx]
    typeof curBehavior === 'String' && 
      (curBehavior = Behavior.list[curBehavior])
    for (prop in curBehavior.properties) {
      insBehavior.properties[prop] = curBehavior.properties[prop]
    }
    for (method in curBehavior.methods) {
      insBehavior.methods[method] = curBehavior.methods[method]
    }
    for (let i = 0; i < curBehavior.ancestors.length; i++) {
      if (ancestors.indexOf(curBehavior.ancestors[i]) < 0) {
        ancestors.push(curBehavior.ancestors[i])
      }
    }
  }

  for (prop in opt.properties) {
    insBehavior.properties[prop] = opt.properties[prop]
  }
  for (listener in opt.listeners) {
    insBehavior.listeners[listener] = opt.listeners[listener]
  }
  for (func in opt) {
    if ('function' === typeof opt[func]) {
      if (cycle.indexOf(func) < 0) {
        insBehavior.methods[func] = opt[func]
      } else {
        insBehavior[func] = opt[func]
      }
    }
  }

  ancestors.push(insBehavior)
  return insBehavior
}

// list: 存放所有注册了的Behavior, Component是继承了若干behavior的组合体
Behavior.list = Object.create(null)

// Behavior原型上的方法

// 判断behavior对象是否具有beh
Behavior.prototype.hasBehavior = function (beh) {
  for (let idx = 0; idx < this.ancestors.length; idx++) {
    if (this.ancestors[idx].is === beh) {
      return true
    }
  }
  return false
}

// 获取behavior对象的所有listener
Behavior.prototype.getAllListeners = function () {
  let tmpObj = Object.create(null)
    ancestors = this.ancestors,
    idx = 0
  for(; idx < ancestors.length; idx++) {
    let ancestor = ancestors[idx]
    for (let key in ancestors.listeners) {
      if (tmpObj[key]) {
        tmpObj[key].push(ancestors.listeners[key])
      } else {
        tmpObj[key] = [ancestors.listeners[key]]
      }
    }
  }
  return tmpObj
}

// 获取behavior对象所有 life time func，父子组件的, 创建一个Events对象去管理和调度
Behavior.prototype.getAllLifeTimeFuncs = function () {
  let tmpObj = Object.create(null),
    ancestors = this.ancestors
  cycle.forEach(function(key) {
    let lifeTimeFunc = (tmpObj[key] = Events.create('LifeTime Method')),
      idx = 0
    for (; idx < ancestors.length; idx++) {
      let ancestor = ancestors[idx]
      ancestor[key] && (lifeTimeFunc.add(ancestor[key]))
    }
  })
  return tmpObj
}

export default Behavior
