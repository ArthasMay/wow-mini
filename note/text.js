
const template = {
  template: '<div c><p>sss</p></div><div>sss<div>'
}

function test () {
  // let insElement = document.createElement('template')
  // insElement.innerHTML = template.template
  
  // let content = 

  // let value = "left: {{_progressLeft}}px"
  // let slices = value.split(/\{\{(.*?)\}\}/g)
  // console.log(slices)
  // let methodSlices = slices[1].match(/^(!?)([-_a-zA-Z0-9]+)(?:\((([-_a-zA-Z0-9]+)(,[-_a-zA-Z0-9]+)*)\))?$/) || [!1, '']
  // console.log(methodSlices)

  // console.log(!!'')

  // console.log(insElement.content.childNodes)

  
}

const Element = function () {}
Element.prototype = Object.create(Object.prototype, {
  constructor: {
    value: Element,
    writable: true,
    configurable: true
  }
})

const VirtualNode = function () {}
VirtualNode.prototype = Object.create(Element.prototype, {
  constructor: {
    value: VirtualNode,
    writable: true,
    configurable: true
  }
})

// createVirtualNode
VirtualNode.create = function (is) {
  const insVirtualNode = Object.create(VirtualNode.prototype)
  insVirtualNode.__virtual = true
  insVirtualNode.is = is
  // Element.initialize(insVirtualNode, null) // 第二个null参数没用？
  return insVirtualNode
}

// test()



;(function testName(oldNode) {
  oldNode = "sss"
  console.log(oldNode)
}())

