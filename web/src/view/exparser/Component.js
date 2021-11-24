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