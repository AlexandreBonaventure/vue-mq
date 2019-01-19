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
  Vue.filter('mq', (currentBreakpoint, values) => {
    return transformValuesFromBreakpoints(
      Object.keys(breakpoints),
      values,
      currentBreakpoint
    )
  })
  Vue.mixin({
    computed: {
      $mq () {
        return mq.vm.currentBreakpoint
      },
    },
    beforeMount () {
      mq.setupListeners()
    },
  })
  Vue.prototype.$mqAvailableBreakpoints = mq.vm.breakpoints
  Vue.component('MqLayout', MqLayout)
}

export default { install }
