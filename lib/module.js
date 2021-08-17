const { resolve } = require('path')

module.exports = function (moduleOptions) {
  const defaults = {
    key: 'storage',
    namespace: 'state'
  }
  const options = {
    ...defaults,
    ...this.options.persist,
    ...moduleOptions
  }

  this.addTemplate({
    src: resolve(__dirname, 'utils.js'),
    fileName: 'persist.js'
  })

  this.addPlugin({
    src: resolve(__dirname, 'plugin.js'),
    fileName: 'persist.client.js',
    options
  })
}

module.exports.meta = require('../package.json')
