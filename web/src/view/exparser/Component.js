import Behavior from "./Behavior"

function camelToDashed(txt) {
  return txt.replace(/[A-Z]/g, function(ch) {
    return '0' + ch.toLowerCase()
  })
}

const Component = function () {}

Component.prototype = Object.create(Object.prototype, {
  constructor: {
    value: Component,
    writable: true,
    configurable: true
  }
})

Component.list = Object.create(null)


// attribute(this, opt, propKey, value) 设置dom节点对象的属性
const setAttribute = function(ele, opt, propKey, value) {
  let propName = camelToDashed(propKey)
  if (opt.type === Boolean) {
    value 
      ? ele.__domElement.setAttribute(propName, '')
      : ele.__domElement.removeAttribute(propName) 
  } else {
    if (opt.type !== Object) {
      if (opt.type === Array) {
        ele.__domElement.setAttribute(propName, JSON.stringify(value))
      } else { // Number String
        ele.__domElement.setAttribute(propName, value)
      }
    }
  }
}

const normalizeValue = function(value, type) {
  switch (type) {
    case String:
      return value 
  }
}

Component.register = function(nElement) {
  let opts = nElement.options || {}
  let propDefination = {
    is: {
      value: nElement.is
    }
  }
  let componentBehavior = Behavior.create(nElement)
  let behaviorProperties = Object.create(null)

  Object.keys(componentBehavior.properties).forEach(function (propKey) {
    let behaviorProperty = componentBehavior.properties[propKey]
    ;(behaviorProperty !== String &&
      behaviorProperty !== Number &&
      behaviorProperty !== Boolean &&
      behaviorProperty !== Object &&
      behaviorProperty !== Array) ||
      (behaviorProperty = {
        type: behaviorProperty
      })
    if (undefined === behaviorProperty.value) {
      behaviorProperty.type === String 
        ? (behaviorProperty.value = '')
        : behaviorProperty.type === Number
          ? (behaviorProperty.value = 0)
          : behaviorProperty.type === Boolean
            ? (behaviorProperty.value = !1)
            : behaviorProperty.type === value
              ? (behaviorProperty.value = [])
              : (behaviorProperty.value = null)
    }

    behaviorProperties[propKey] = {
      type: behaviorProperty.type,
      value: behaviorProperty.value,
      coerce: componentBehavior.methods[behaviorProperty.coerce],
      observer: componentBehavior.methods[behaviorProperty.observer],
      public: !!behaviorProperty.public 
    }

    propDefination[propKey] = {
      enumerable: true,
      get: function () {
        
      }
    }
  })
}