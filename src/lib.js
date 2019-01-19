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
      watch: {
        breakpoints: {
          deep: true,
          handler: () => {
            this.teardownListeners()
            this.setupListeners()
          },
        },
      },
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
        this.listeners.add(subscribeToMediaQuery(mediaQuery, enter))
      }
      this.hasSetupListeners = true
    }
  }

  teardownListeners () {
    for (const unsub of this.listeners) {
      unsub()
      this.listeners.delete(unsub)
    }
    this.hasSetupListeners = false
  }

  get api () {
    const vm = this.vm
    return {
      get breakpoints () {
        return vm.breakpoints
      },
      set breakpoints (val) {
        vm.breakpoints = val
      },
      get current () {
        return vm.currentBreakpoint
      },
    }
  }
}
