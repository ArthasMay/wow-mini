import calculate from './TemplateExparser'

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

function domRendering (nodes, shadowRoot, idMap, slots, binding) { // 将 nodes 追加到ShadowRoot下 tagTree
  let newNode = nul, attrIdx = 0, attr = null, rootIdx = 0
  for (; rootIdx < nodes.length; rootIdx++) {
    let node = nodes[rootIdx]
    if (node.name === undefined) {
      newNode =  s
    }
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

// mini系统的自定义组件
const toggleCustomDomClassAttr = function (ele, className, force) { // ele 是 Exparser 中 Element 的 对象
  ele.__domElement.classList.toggle(className, !!force)
}

const setCustomDomStyle = function (ele, attr, value) {
  ele.__domElement.style[attr] = value
}

// dom 元素设置属性
const setAttr = function (ele, attr, value) { // ele 是真的dom对象
  if (value === !0) {
    ele.setAttribute(attr, '')
  } else {
    if (!1 === value || undefined === value || null === value) {
      ele.removeAttribute(attr)
    } else {
      ele.setAttribute(attr, value)
    }
  }
}

// dom 元素设置/移除 classname
const toggleClassAttr = function (ele, className, force) {
  ele.classList.toggle(className, !!force)
}

// dom 设置 style
const setStyle = function(ele, attr, value) {
  ele.style[attr] = value
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

  let isSlotPushed = false

  // 递归构建一个类似 Shadow Dom 树结构
  const childNodeFn = function (tagTree, contentChildNodes, tempArr, textParseOpt) {
    let exp, nodeIdx = 0
    for (; nodeIdx < contentChildNodes.length; nodeIdx++) {
      let nodeItem = contentChildNodes[idx]
      let treeLengthList = tempArr.concat(tagTree.length) // treeLengthList 记录树的长度
      if (nodeItem.nodeType !== 8) { // if not Node.COMMENT_NODE 非注释
        if (nodeItem.nodeType !== 3)  { // if not Node.TEXT_NODE 非文字
          if (nodeItem.tagName !== 'WX-CONTENT' && nodeItem.tagName !== 'SLOT') { // 非占位和插槽dom节点
            // 转化模板相关绑定属性 => 内存中可更新的方法 
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
                      attrSetter = setAttr
                      attrName = nodeItemAttr.name.slice(0, -1)
                    }
                  } else {
                    if (nodeItemAttr.name.slice(-1) === ':') { // 整理后isCustomEle ? setAttr : setObjAttr 这是有误的
                      attrSetter = setObjAttr
                      attrName = dashToCamel(nodeItemAttr.name.slice(0, -1))
                    } else {
                      if (nodeItem.name.slice(0, 6) === 'class.') {
                        attrSetter = isCustomEle ? toggleCustomDomClassAttr : toggleClassAttr
                        attrName = nodeItem.name.slice(6)
                      } else if (nodeItem.name.slice(0, 6) === 'style.') {
                        attrSetter = isCustomEle ? setCustomDomStyle: setStyle
                        attrName = nodeItem.name.slice(6)
                      }
                    }
                  }
                  attrSetter && (exp = calculate.parse(nodeItemAttr.value, behaviorMethods))
                  let value = exp ? exp.calculate(null, data) : nodeItemAttr.value
                  isCustomEle || (attrSetter || setAttr)(prerendered, attrName, value)
                  (isCustomEle || exp) && attrs.push({ // isCustomEle: Exparser的自定义Element 为后面的设置属性用
                    name: attrName,
                    value: value,
                    updater: attrSetter,
                    exp: exp
                  })
                }
              }
              let elementNode = {
                name: nodeItem.tagName.toLowerCase(), 
                id: id,
                custom: isCustomEle,
                attrs: attrs,
                prerendered: prerendered,
                children: []
              }
              tagTree.push(elementNode)
              nodeItem.tagName === 'VIRTUAL' && (elementNode.virtual = 'virtual')
              nodeItem.childNodes && childNodeFn(elementNode.children, nodeItem.childNodes, treeLengthList, pareOpts)
              if (elementNode.children.length === 1 && elementNode.children[0] === slotRef) {
                elementNode.children.pop()
                elementNode.slot = ''
              }
            }
          } else {
            isSlotPushed = true
            tagTree.push(slotRef)
          }
        } else { // 处理textNode
          let text = nodeItem.textContent
          if (!textParseOpt.keepWhiteSpace) {
            text = text.trim()
            if ('' === text) continue
            nodeItem.textContent = Text
          }
          exp = undefined
          textParseOpt.parseTextContent && (exp = calculate.parseTextContent(text, behaviorMethods))
          tagTree.push({
            exp: exp,
            text: exp ? exp.calculate(null, data) : text
          })
        }
      }
    }
  }
  
  let tagTree = []
  childNodeFn(tagTree, content.childNodes, [], textParseOpt) 
  isSlotPushed || tagTree.push(slotRef)
  tagTree.length === 1 && tagTree[0] === slotRef && tagTree.pop()
  let tempTemplate = Template.create(Template.prototype)
  tempTemplate._tagTreeRoot = tagTree
  tempTemplate._renderingMode = renderingMode
  return tempTemplate
}



