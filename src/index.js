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
      defaultBreakpoint: defaultBreakpoint,
      currentBreakpoint: defaultBreakpoint,
    }),
    methods: {
      update(breakpoint, type = 'currentBreakpoint') {
        const isTypeValid = Object.keys(this.$data).includes(type)
        const isBreakPointValid = Object.keys(breakpoints).includes(breakpoint)
        if (isTypeValid && isBreakPointValid) {
          this.$data[type] = breakpoint
        }
      }
    }
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
      if (this.$isServer) reactorComponent.currentBreakpoint = reactorComponent.defaultBreakpoint
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
  Vue.prototype.$mqUpdateCurrentBreakpoint = breakpoint =>
    reactorComponent.update(breakpoint, 'currentBreakpoint')
  Vue.prototype.$mqUpdateDefaultBreakpoint = breakpoint =>
    reactorComponent.update(breakpoint, 'defaultBreakpoint')
  Vue.component('MqLayout', MqLayout)
}

export default { install }
