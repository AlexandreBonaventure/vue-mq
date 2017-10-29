import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'

// rollup.config.js
export default {
  input: 'index.js',
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
    })
  ],
  output: {
    file: './dist/vue-mq.js',    // required
    format: 'umd',  // required
    name: 'vueMq',
  },
};
