import Behavior from "./Behavior"
import Events from "./Events"
import Observer from "./Observer"

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
        let propData = this.__propData[propKey]
        return void 0 === propData 
          ? behaviorProperties[propKey].value
          : propData  
      },
      set: function (value) {
        let behProp = behaviorProperties[propKey]
        value = normalizeValue(value, behProp.type)
        let propData = this.__propData[propKey] // old val
        
        if (behProp.coerce) {
          let realVal = Events.safeCallback(
            'Property Filter',
            behProp.coerce,
            this,
            [value, propData]
          )
          void 0 !== realVal && (value = realVal)
        }
        if (value !== propData) {
          // value changed
          this.__propData[propKey] = value
          behProp.public && setAttribute(this, behProp, propKey, value)
          // this.__templateInstance.
          behProp.observer &&
            Events.safeCallback('Property Observer', behProp.observer, this, [
              value, propData
            ])
          if (behProp.public) {
            if (
              (this.__propObservers && !this.__propObservers.empty) ||
              this.__subtreeObserversCount
            ) {
              Observer._callObservers(this, '__propObservers', {
                type: 'properties',
                target: this,
                propertyName: propKey
              })
            }
          }
        }
      }
    }
  }) // end forEach

  let proto = Object.create(Element.prototype, propDefination)
  proto.__behavior = componentBehavior
  for (let methodName in  componentBehavior.methods) {
    proto[methodName] = componentBehavior.method[methodName]
  }
  proto.__lifeTimeFuncs = componentBehavior.getAllLifeTimeFuncs()
  let publicProps = Object.create(null),
    defaultValuesJSON = {}
  for (let propName in behaviorProperties) {
    defaultValuesJSON[propName] = behaviorProperties[propName].value
    publicProps[propName] = !!behaviorProperties[propName].public
  }

  let insElement = document.getElementById(componentBehavior.is)
  if (
    !componentBehavior.template &&
    insElement &&
    insElement.tagName === 'TEMPLATE'
  ) {

  } else {
    insElement = document.createElement('template')
    insElement.template = componentBehavior.template || ''
  }
  
  
}

Component.create = function (tagName) {
  
}

Component.__callLifeTimeFuncs = function (ele, funcName) {
   let func = ele.__lifeTimeFuncs(ele, funcName)
   func.call(ele, [])
}