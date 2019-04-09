var ref = require('parse5');
var parse = ref.parse;
var serialize = ref.serialize;

function cleanHTML (html, opts) {
  var ast = parse(html);

  if (ast.childNodes.length > 1) {
    ast.childNodes = ast.childNodes.filter(function (childNode) { return childNode.tagName === 'html'; });
  }
  if (!opts.allowHrefTargets) { removeTargets(ast); }
  if (!opts.allowScripts) { removeScripts(ast); }

  alterBaseAttribute(ast, opts.openLinksInFrame);

  return {
    head: serialize(ast.childNodes[0].childNodes.find(function (childNode) { return childNode.nodeName === 'head'; })),
    body: serialize(ast.childNodes[0].childNodes.find(function (childNode) { return childNode.nodeName === 'body'; }))
  }
}

function removeTargets (ast) {
  if (!ast.childNodes || !ast.childNodes.length) {
    return
  }

  ast.childNodes.map(function (childNode) {
    if (childNode.tagName === 'a') {
      childNode.attrs = childNode.attrs.filter(function (attr) { return attr.name !== 'target'; });
    }

    removeTargets(childNode);
  });
}

function alterBaseAttribute (ast, linksInFrame) {
  var target = (linksInFrame ? '_self' : '_blank');

  var alteredAttr = false;
  ast.childNodes[0].childNodes[0].childNodes.map(function (childNode) {
    if (childNode.tagName === 'base') {
      var existingTargetAttr = childNode.attrs.find(function (attr) { return attr.name === 'target'; });
      if (existingTargetAttr) {
        existingTargetAttr.value = target;
      } else {
        childNode.attrs.push({
          name: 'target',
          value: target
        });
      }
      alteredAttr = true;
    }
  });

  if (alteredAttr) { return }

  var baseAttr = {
    nodeName: 'base',
    tagName: 'base',
    attrs: [{ name: 'target', value: target }],
    namespaceURI: 'http://www.w3.org/1999/xhtml',
    childNodes: [],
    parentNode: ast.childNodes[0].childNodes[0]
  };

  ast.childNodes[0].childNodes[0].childNodes.push(baseAttr);
}

function removeScripts (ast) {
  if (!ast.childNodes || !ast.childNodes.length) {
    return
  }

  ast.childNodes = ast.childNodes.filter(function (childNode) {
    if (childNode.tagName === 'script') {
      return false
    }
    removeScripts(childNode);
    return true
  });
}

var script = {
  props: {
    html: {
      type: String,
      default: ''
    },
    openLinksInFrame: {
      type: Boolean,
      default: false
    },
    allowScripts: {
      type: Boolean,
      default: false
    },
    allowHrefTargets: {
      type: Boolean,
      default: false
    },
    csp: {
      type: String,
      default: null
    },
    stylesheet: {
      type: String,
      default: null
    }
  },
  watch: {
    html: function html () {
      var this$1 = this;

      // next tick
      setTimeout(function () {
        this$1.renderChildren();
      }, 0);
    }
  },
  render: function render (h) {
    return h('iframe', {
      on: {
        load: this.renderChildren
      }
    })
  },
  methods: {
    renderChildren: function renderChildren () {
      var parsedHtml = cleanHTML(this.html, {
        openLinksInFrame: this.openLinksInFrame,
        allowScripts: this.allowScripts,
        allowHrefTargets: this.allowHrefTargets
      });
      var head = this.$el.contentDocument.head;
      var body = this.$el.contentDocument.body;

      var additionalHeaders = '\n';

      if (this.csp) {
        additionalHeaders += "<meta http-equiv=\"Content-Security-Policy\" content=\"" + (this.csp) + "\">\n";
      }

      if (this.stylesheet) {
        additionalHeaders += "<style type=\"text/css\">" + (this.stylesheet) + "</style>\n";
      }

      body.innerHTML = parsedHtml.body;
      head.innerHTML = parsedHtml.head + additionalHeaders;
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

/* script */
var __vue_script__ = script;

/* template */

  /* style */
  var __vue_inject_styles__ = undefined;
  /* scoped */
  var __vue_scope_id__ = undefined;
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = undefined;
  /* style inject */
  
  /* style inject SSR */
  

  
  var component = normalizeComponent_1(
    {},
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  );

function install(Vue) {
	if (install.installed) { return }
	install.installed = true;
	Vue.component('VueSafeIframe', component);
}

var plugin = {
	install: install
};

var GlobalVue = null;
if (typeof window !== 'undefined') {
	GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
	GlobalVue = global.Vue;
}
if (GlobalVue) {
	GlobalVue.use(plugin);
}

var SafeIFrame = component;

export default plugin;
export { SafeIFrame, install };
