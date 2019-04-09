const vue = require('rollup-plugin-vue')
const buble = require('rollup-plugin-buble')
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'src/index.js',
  output: {
    name: 'VueSafeIframe',
    exports: 'named',
  },
  plugins: [
    commonjs(),
    vue({
      css: false,
      compileTemplate: true
    }),
    buble()
  ]
}