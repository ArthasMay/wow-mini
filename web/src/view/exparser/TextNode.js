import Observer from "./Observer"

const TextNode = function () {}

TextNode.prototype = Object.create(Object.prototype, {
  constructor: {
    value: TextNode,
    writable: !0,
    configurable: !0
  }
})

// Create: 创建`TextNode`对象的工厂方法
TextNode.create = function (txt) {
  const tempObj = Object.create(TextNode.prototype)
  tempObj.$$ = tempObj.__domElement = document.createTextNode(txt || '') // $$ 关联 __domElement属性: 真实的dom节点
  tempObj.__domElement.__wxElement = tempObj                             // __wxElement: exparser中描述dom节点的对象，可以理解为 Virtual Dom节点
  tempObj.__subtreeObserversCount = 0
  tempObj.parentNode = null
  return tempObj 
}

Object.defineProperty(TextNode.prototype,  'textContent', {
  get: function () {
    return this.__domElement.textContent
  },
  set: function (txt) {
    this.__domElement.textContent = txt
    if ((this.__textObservers && !this.__textObservers.empty) ||  
      this.__subtreeObserversCount) 
    {
      Observer._callObservers(this, '__textObservers', {
        type: 'characterData',
        target: this
      })
    }
  }
})

export default TextNode


