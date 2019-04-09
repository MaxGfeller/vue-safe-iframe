<script>
import { cleanHTML } from './parser'

export default {
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
    html () {
      // next tick
      setTimeout(() => {
        this.renderChildren()
      }, 0)
    }
  },
  render (h) {
    return h('iframe', {
      on: {
        load: this.renderChildren
      }
    })
  },
  methods: {
    renderChildren () {
      let parsedHtml = cleanHTML(this.html, {
        openLinksInFrame: this.openLinksInFrame,
        allowScripts: this.allowScripts,
        allowHrefTargets: this.allowHrefTargets
      })
      const head = this.$el.contentDocument.head
      const body = this.$el.contentDocument.body

      let additionalHeaders = '\n'

      if (this.csp) {
        additionalHeaders += `<meta http-equiv="Content-Security-Policy" content="${this.csp}">\n`
      }

      if (this.stylesheet) {
        additionalHeaders += `<style type="text/css">${this.stylesheet}</style>\n`
      }

      body.innerHTML = parsedHtml.body
      head.innerHTML = parsedHtml.head + additionalHeaders
    }
  }
}
</script>