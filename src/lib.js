import {
  subscribeToMediaQuery,
  convertBreakpointsToMediaQueries,
} from './helpers.js'

export default class MQ {
  hasSetupListeners = false
  listeners = new Set()
  vm = null

  constructor ({ breakpoints, defaultBreakpoint, Vue }) {
    // Init reactive component
    this.vm = new Vue({
      data: () => ({
        currentBreakpoint: defaultBreakpoint,
        breakpoints,
      }),
    })
  }

  setupListeners () {
    if (!this.hasSetupListeners) {
      const mediaQueries = convertBreakpointsToMediaQueries(this.vm.breakpoints)
      // setup listeners
      for (const key in mediaQueries) {
        const mediaQuery = mediaQueries[key]
        const enter = () => {
          this.vm.currentBreakpoint = key
        }
        subscribeToMediaQuery(mediaQuery, enter)
      }
      this.hasSetupListeners = true
    }
  }
}
