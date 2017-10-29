import Vue from 'vue'
import Plugin from '../src/index.js'

Vue.use(Plugin)

new Vue({
  template: `
    <div class="helvetica tc pa4">
      <h1 class="f4 silver">currentBreakpoint: {{$mq}}</h1>
      <h1>{{$mq | mq({ sm: 'small and medium', lg: 'large'})}}</h1>
    </div>
  `,
}).$mount('#app')
