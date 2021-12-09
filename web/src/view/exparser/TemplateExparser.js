import Events from "./Events"

const TemplateParser = function () {}
TemplateParser.prototype = Object.create(Object.prototype, {
  constructor: {
    value: TemplateParser,
    writable: !0,
    configurable: !0
  }
})


/**
 * @method
 * 模版上绑定属性语法解析
 *
 * @param {String} value 组件模版绑定的属性值 
 * @param {Object} methods 组件模版的方法列表
 */
TemplateParser.parse = function (value, methods) {
  let tempObj = Object.create(TemplateParser.prototype)
  let slices = value.split(/\{\{(.*?)\}\}/g) // 将 wx-icon-{{type}} {{name}} 分割为三组，取出 {{}} 中的绑定属性
  let bindedPropList = []                    // 存储模版上的绑定属性名列表
  for (let idx = 0; idx < slices.length; idx++) {
    if (idx % 2) { // 下标为单数的（譬如1）为绑定的属性名/方法名
      let methodSlices = slices[idx].match(/^(!?)([-_a-zA-Z0-9]+)(?:\((([-_a-zA-Z0-9]+)(,[-_a-zA-Z0-9]+)*)\))?$/) || [!1, ''] // 正则捕获组
      let args = null
      if (methodSlices[3]) { 
        // 绑定是带参数方法
        // _getMaxlength(maxlength,name) 中间不能有空格 -> 下标3的是绑定表达式参数（如果绑定的是方法）
        args = methodSlices[3].split(',')
        for (let argIdx = 0; argIdx < args.length; argIdx++) {
          bindedPropList.indexOf(args[argIdx]) < 0 && bindedPropList.push(args[argIdx])
        }
      } else { // 直接绑定属性 or 不带参方法
        bindedPropList.indexOf(methodSlices[2]) < 0 && bindedPropList.push(methodSlices[2])
      }
      slices[idx] = {
        not: !!methodSlices[1], // !!'' === false
        prop: methodSlices[2],  // 方法名/属性名
        callee: args            // 参数
      }

      tempObj.bindedProps = bindedPropList // 关联的data key
      tempObj.isSingleLetiable = slices.length === 3 && slices[0] === '' && slices[2] === '' // 仅表达式{{type}}这样的  非 left: {{_progressLeft}}px 
      tempObj._slices = slices
      tempObj._methods = methods
      return tempObj
    }
  }
}

/**
 * @method
 * 执行绑定属性计算
 * 
 * @param {*} ele 
 * @param {*} data 
 * @param {*} methods 
 * @param {*} opt slice[1] 绑定属性的计算对象
 */
const propCalculate = function(ele, data, methods, opt) { 
  let res = ''
  if (opt.callee) { // 绑定带参方法
    let args = [], idx = 0
    for (; idx < args.length; idx++) {
      args[idx] = data[opt.callee[idx]]
    }
    res = Events.safeCallback('TemplateExparser Method', methods[opt.prop], ele, args)
    undefined !== res && res != null || (res = '')
  } else { // 直接绑定属性的情况
    res = data[opt.prop]
  }
  if(opt.not) { // 处理 `!` 取反
    return !res
  } else {
    return res
  }
}

TemplateParser.prototype.calculate = function (ele, data) { // 解析模版返回结果
  let slices = this._slices
  let opt = null
  let value = ''
  if (this.isSingleLetiable) { // 仅有表达式
    opt = slices[1]
    value = propCalculate(ele, data, this._methods, opt)
  } else {
    for (let idx= 0; idx < slices.length; idx++) {
      opt = slices[idx]
      if (idx % 2) {
        value += propCalculate(ele, data, this._methods, opt)
      } else {
        value += opt
      }
    }
  }
  return value
}

export default TemplateParser