
const template = {
  template: '<div><p>sss</p></div>'
}

function test () {
  // let insElement = document.createElement('template')
  // insElement.innerHTML = template.template
  
  // let content = 

  let value = "left: {{_progressLeft}}px"
  let slices = value.split(/\{\{(.*?)\}\}/g)
  console.log(slices)
  let methodSlices = slices[1].match(/^(!?)([-_a-zA-Z0-9]+)(?:\((([-_a-zA-Z0-9]+)(,[-_a-zA-Z0-9]+)*)\))?$/) || [!1, '']
  console.log(methodSlices)

  // console.log(!!'')
}

test()