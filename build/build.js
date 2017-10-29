
require('rollup-make-bundles').easy({
  entry: 'src/index.js',
  presetPlugins: true,
  moduleName: 'vueMq',
}, {
  dest: 'dist',
  name: 'vue-mq'
});
