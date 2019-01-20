import { transformValuesFromBreakpoints } from './helpers.js'
import MQ from './lib.js'
import MqLayout from './component.js'

const DEFAULT_BREAKPOINTS = {
  sm: 450,
  md: 1250,
  lg: Infinity,
}

const install = function (
  Vue,
  { breakpoints = DEFAULT_BREAKPOINTS, defaultBreakpoint = 'sm' } = {}
) {
  const mq = new MQ({
    breakpoints,
    defaultBreakpoint,
    Vue,
  })
  Vue.filter('mq', (api, values) => {
    return transformValuesFromBreakpoints(
      Object.keys(breakpoints),
      values,
      api.current
    )
  })
  Vue.mixin({
    beforeMount () {
      mq.setupListeners()
    },
  })

  Object.defineProperty(Vue.prototype, '$mq', {
    get () {
      return mq.api
    },
  })
  if (process.env.NODE_ENV === 'test') {
    // expose full lib
    Vue.prototype.$mqLib = mq
  }
  Vue.prototype.$mqAvailableBreakpoints = mq.vm.breakpoints // DEPRECATION
  Vue.component('MqLayout', MqLayout)
}

export default { install }
