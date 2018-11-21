import { setupListeners, convertBreakpointsToMediaQueries, transformValuesFromBreakpoints } from './helpers.js'
import MqLayout from './component.js'

const DEFAULT_BREAKPOINT = {
  sm: 450,
  md: 1250,
  lg: Infinity,
}

const install = function (Vue, { breakpoints = DEFAULT_BREAKPOINT, defaultBreakpoint = 'sm' } = {}) {
  let hasSetupListeners = false
  // Init reactive component
  const reactorComponent = new Vue({
    data: () => ({
      currentBreakpoint: defaultBreakpoint,
    })
  })
  Vue.filter('mq', (currentBreakpoint, values) => {
    return transformValuesFromBreakpoints(Object.keys(breakpoints), values, currentBreakpoint)
  })
  Vue.mixin({
    computed: {
      $mq() {
        return reactorComponent.currentBreakpoint
      },
    },
    beforeMount() {
      if (!hasSetupListeners) {
        const mediaQueries = convertBreakpointsToMediaQueries(breakpoints)
        setupListeners(mediaQueries)
        hasSetupListeners = true
      }
    }
  })
  Vue.prototype.$mqAvailableBreakpoints = breakpoints
  Vue.component('MqLayout', MqLayout)
}

export default { install }
