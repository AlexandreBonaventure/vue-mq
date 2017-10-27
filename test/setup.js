const hooks = require('require-extension-hooks')

// Setup browser environment
require('browser-env')()

hooks('js').plugin('babel', {
  presets: [
    'env',
  ],
  "plugins": [
    ["transform-object-rest-spread"]
  ]
}).push()
