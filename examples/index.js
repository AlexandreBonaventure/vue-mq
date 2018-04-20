import Vue from 'vue'
import Plugin from '../src/index.js'
import App from './App';

Vue.use(Plugin)

new Vue({
  el: '#app',
  render(h){ return h(App) }
})
