import Vue from 'vue'
import Plugin from '../src/index.js'

Vue.use(Plugin)

new Vue({
  components: {
    Prism: window.PrismComponent,
  },
  template: `
    <div class="helvetica tc pa4">
      <h1 class="f4 silver">currentBreakpoint: {{$mq}}</h1>
      <h1>{{$mq | mq({ sm: 'small and medium', lg: 'large'})}}</h1>
      <div class="center measure-wide tc">
        <mq-layout mq="lg">
          <prism language="html" code="&lt;mq-layout mq=&quot;lg&quot;&gt; only large &lt;/mq-layout&gt;"/>
        </mq-layout>
        <mq-layout mq="md+">
          <prism language="html" code="&lt;mq-layout mq=&quot;md+&quot;&gt; md and larger &lt;/mq-layout&gt;"/>
        </mq-layout>
      </div>
    </div>
  `,
}).$mount('#app')
