
const VirtualNode = function () {}

VirtualNode.prototype = Object.create(Object.prototype, {
  constructor: {
    value: VirtualNode,
    writable: !0,
    configurable: !0
  }
})


VirtualNode.create = function (is) {
  const insVirtualNode = Object.create(VirtualNode.prototype)
  insVirtualNode.__virtual = true
  insVirtualNode.is = is
  
  return insVirtualNode
}

export default VirtualNode