import { convertBreakpointsToMediaQueries, transformValuesFromBreakpoints } from './helpers.js'
import MqLayout from './component.js'

const DEFAULT_BREAKPOINT = {
  sm: 450,
  md: 1250,
  lg: Infinity,
}

const install = function (Vue, { breakpoints = DEFAULT_BREAKPOINT } = {}) {
  // Init reactive component
  const reactorComponent = new Vue({
    data: () => ({
      currentBreakpoint: null,
    })
  })

  /**
   * SSR support, if window is not definded, set the smallest breakpoint as default
   */
  if (typeof window === 'undefined') {
    // node stuff
    reactorComponent.currentBreakpoint = smallestBreakPoint(breakpoints)
  } else {
    const mediaQueries = convertBreakpointsToMediaQueries(breakpoints)
    Object.keys(mediaQueries).map((key) => {
      const mediaQuery = mediaQueries[key]
      const enter = () => { reactorComponent.currentBreakpoint = key }
      _subscribeToMediaQuery(mediaQuery, enter)
    })
  }

  function _subscribeToMediaQuery(mediaQuery, enter) {
    const mql = window.matchMedia(mediaQuery)
    const cb = ({ matches }) => {
      if (matches) enter()
    }
    mql.addListener(cb) //subscribing
    cb(mql) //initial trigger
  }

  const smallestBreakpoint = (breakpoints) => {
    let arr = Object.values(breakpoints);
    return Math.min(...arr);
  }

  Vue.filter('mq', (currentBreakpoint, values) => {
    return transformValuesFromBreakpoints(Object.keys(breakpoints), values, currentBreakpoint)
  })
  Vue.mixin({
    computed: {
      $mq() {
        return reactorComponent.currentBreakpoint
      },
    }
  })
  Vue.prototype.$mqAvailableBreakpoints = breakpoints
  Vue.component('MqLayout', MqLayout)
}

export default { install }
