import { subscribeToMediaQuery, convertBreakpointsToMediaQueries, transformValuesFromBreakpoints } from './helpers.js'
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
    created () {
      if (this.$isServer) reactorComponent.currentBreakpoint = defaultBreakpoint
    },
    mounted() {
      if (!hasSetupListeners) {
        const mediaQueries = convertBreakpointsToMediaQueries(breakpoints)
        // setup listeners
        for (const key in mediaQueries) {
          const mediaQuery = mediaQueries[key]
          const enter = () => { reactorComponent.currentBreakpoint = key }
          subscribeToMediaQuery(mediaQuery, enter)
        }
        hasSetupListeners = true
      }
    }
  })
  Vue.prototype.$mqAvailableBreakpoints = breakpoints
  Vue.component('MqLayout', MqLayout)
}

export default { install }
