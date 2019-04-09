const { parse, serialize } = require('parse5')

export function cleanHTML (html, opts) {
  let ast = parse(html)

  if (ast.childNodes.length > 1) {
    ast.childNodes = ast.childNodes.filter((childNode) => childNode.tagName === 'html')
  }
  if (!opts.allowHrefTargets) removeTargets(ast)
  if (!opts.allowScripts) removeScripts(ast)

  alterBaseAttribute(ast, opts.openLinksInFrame)

  return {
    head: serialize(ast.childNodes[0].childNodes.find((childNode) => childNode.nodeName === 'head')),
    body: serialize(ast.childNodes[0].childNodes.find((childNode) => childNode.nodeName === 'body'))
  }
}

function removeTargets (ast) {
  if (!ast.childNodes || !ast.childNodes.length) {
    return
  }

  ast.childNodes.map((childNode) => {
    if (childNode.tagName === 'a') {
      childNode.attrs = childNode.attrs.filter((attr) => attr.name !== 'target')
    }

    removeTargets(childNode)
  })
}

function alterBaseAttribute (ast, linksInFrame) {
  let target = (linksInFrame ? '_self' : '_blank')

  let alteredAttr = false
  ast.childNodes[0].childNodes[0].childNodes.map((childNode) => {
    if (childNode.tagName === 'base') {
      let existingTargetAttr = childNode.attrs.find((attr) => attr.name === 'target')
      if (existingTargetAttr) {
        existingTargetAttr.value = target
      } else {
        childNode.attrs.push({
          name: 'target',
          value: target
        })
      }
      alteredAttr = true
    }
  })

  if (alteredAttr) return

  let baseAttr = {
    nodeName: 'base',
    tagName: 'base',
    attrs: [{ name: 'target', value: target }],
    namespaceURI: 'http://www.w3.org/1999/xhtml',
    childNodes: [],
    parentNode: ast.childNodes[0].childNodes[0]
  }

  ast.childNodes[0].childNodes[0].childNodes.push(baseAttr)
}

function removeScripts (ast) {
  if (!ast.childNodes || !ast.childNodes.length) {
    return
  }

  ast.childNodes = ast.childNodes.filter((childNode) => {
    if (childNode.tagName === 'script') {
      return false
    }
    removeScripts(childNode)
    return true
  })
}
