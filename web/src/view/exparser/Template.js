
const dollarSign = String.fromCharCode(36)

function dashToCamel(txt) { // data-name -> dataName
  return txt.replace(/-([a-z])/g, function (match, p1) {
    return p1.toUpperCase()
  })
}

const Instance = function () {}
Instance.prototype = Object.create(Object.prototype, {
  constructor: {
    value: Instance,
    writable: !0,
    configurable: !0
  }
})

function getAttributes (attributes) {
  let tmpObj = Object.create(null)
  let idx = 0
  for (; idx < attributes.length; idx++) {
    tmpObj[attributes[idx].name] = attributes[idx].value
  }
  return tmpObj
}

const setObjAttr = function (obj, key, value) {
  obj[key] = value
}

function domRendering (nodes, shadowRoot, idMap, slots, binding) { // 将 nodes 追加到ShadowRoot下
  let newNode = nul, attrIdx = 0, attr = null, rootIdx = 0
  for (; rootIdx < nodes.length; rootIdx++) {

  }
}

const Template = function () {}
Template.prototype = Object.create(Object.prototype, {
  constructor: {
    value: Template,
    writable: !0,
    configurable: !0
  }
})

let componentSystem = null // 组件系统
Template._setComponentSystem = function (obj) {
  componentSystem = obj // Component component的构造函数`对象`
}

let globalOptions = function () {
  return {
    renderingMode: 'native',
    keepWhiteSpace: false,
    parseTextContent: false
  }
}

Template._setGlobalOptionsGetter = function (opt) {
  globalOptions = opt
}

let slot = {
  name: 'virtual',
  virtual: 'slot', 
  slot: '',
  attrs: [],
  children: []
}

let virtual = {
  name: 'virtual',
  slot: '',
  attrs: [],
  prerendered: document.createElement('virtual'),
  children: []
}

Template.create = function (ele, data, behaviorMethods, opts) { // opts: Element.options  ele: dom
  let globOpt = globalOptions()
  let renderingMode = opts.renderingMode || globOpt.renderingMode
  let slotRef = slot
  if (renderingMode === 'native') {
    slotRef = virtual
  }

  // 确定配置项
  let eleAttributes = getAttributes(ele.attributes)
  let textParseOpt = {
    parseTextContent: undefined !== eleAttributes['parse-text-content'] || opts.parseTextContent || globOpt.parseTextContent,
    keepWhiteSpace: undefined !== eleAttributes['keep-white-space'] || opts.keepWhiteSpace || globOpt.keepWhiteSpace
  }
  
  let content = ele.content
  if (ele.tagName !== 'Template') {
    content = document.createDocumentFragment()
    for (; ele.childNodes.length;) {
      content.appendChild(ele.childNodes[0])
    }
  }

  // 模拟构建 shadow dom
  const childNodeFn = function (tagTree, contentChildNodes, tempArr, textParseOpt) {
    let exp, nodeIdx = 0
    for (; nodeIdx < contentChildNodes.length; nodeIdx++) {
      let nodeItem = contentChildNodes[idx]
      let treeLengthList = tempArr.concat(tagTree.length) // treeLengthList 记录树的长度
      if (nodeItem.nodeType !== 8) { // if not Node.COMMENT_NODE 非注释
        if (nodeItem.nodeType !== 3)  { // if not Node.TEXT_NODE 非文字
          if (nodeItem.tagName !== 'WX-CONTENT' && nodeItem.tagName !== 'SLOT') { // 非占位和插槽dom节点
            let isCustomEle = nodeItem.tagName.indexOf('-') > 0 && renderingMode !== 'native'
            let prerendered = null
            isCustomEle || (prerendered = document.createElement(nodeItem.tagName))
            let id = ''
            let nodeItemAttributes = nodeItem.attributes
            let attrs = []
            if (nodeItemAttributes) {
              let pareOpts = {}, attrIdx = 0
              for (; attrIdx < nodeItemAttributes.length; attrIdx ++) {
                let nodeItemAttr = nodeItemAttributes[attrIdx]
                if (nodeItemAttr.name === 'id') {
                  id = nodeItemAttr.value
                } else if (nodeItemAttr.name === 'parse-text-content') {
                  pareOpts.parseTextContent = !0
                } else if (nodeItemAttr.name === 'keep-white-space') {
                  pareOpts.keepWhiteSpace = !0
                } else {
                  exp = undefined
                  let attrSetter
                  let attrName = nodeItemAttr.name
                  
                  if (nodeItemAttr.name.slice(-1) === dollarSign) { // 属性名以`$`符号结尾的
                    if (isCustomEle) {
                      attrSetter = setObjAttr
                      attrName = dashToCamel(nodeItemAttr.name.slice(0, -1))
                    } else {
                      attrSetter = setObjAttr
                      attrName = nodeItemAttr.name.slice(0, -1)
                    }
                  } else {
                    if (nodeItemAttr.name.slice(-1) === ':') { // 整理后isCustomEle ? setAttr : setObjAttr 这是有误的
                      attrSetter = setObjAttr
                      attrName = dashToCamel(nodeItemAttr.name.slice(0, -1))
                    } else {
                      
                    }
                  }
                }
              }
            }
          }
        }
        
      }
    }
  }
}



