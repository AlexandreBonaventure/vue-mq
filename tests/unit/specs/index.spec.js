import plugin from '@/index.js'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import MatchMediaMock from 'match-media-mock'

const localVueFactory = options => {
  const localVue = createLocalVue()
  localVue.use(plugin, options)
  return localVue
}

describe('index.js', () => {
  let results
  let matchMediaMock
  function changeMediaQuery (mq) {
    matchMediaMock.setConfig(mq)
    for (const result of results) {
      result.callListeners()
    }
  }
  beforeEach(() => {
    results = new Set()
    matchMediaMock = MatchMediaMock.create()
    matchMediaMock.setConfig({ type: 'screen', width: 1200 })
    window.matchMedia = jest.fn(query => {
      const result = matchMediaMock(query)
      results.add(result)
      return result
    })
  })
  describe('plugin', () => {
    test('should default to defaultBreakpoint in options', () => {
      const localVue = localVueFactory({ defaultBreakpoint: 'md' })
      const vm = new localVue({
        render (h) {
          return h('div')
        },
      })
      expect(vm.$mq.current).toBe('md')
    })
    test('should subscribe to media queries', () => {
      const wrapper = shallowMount(
        {
          render (h) {
            return h('div')
          },
        },
        { localVue: localVueFactory() }
      )
      expect(window.matchMedia).toBeCalledWith('(min-width: 1250px)')
      expect(window.matchMedia).toBeCalledWith(
        '(min-width: 450px) and (max-width: 1249px)'
      )
      expect(window.matchMedia).toBeCalledWith(
        '(min-width: 0px) and (max-width: 449px)'
      )
    })
  })
  describe('$mq', () => {
    test('should register $mq property', () => {
      const wrapper = shallowMount(
        {
          render (h) {
            return h('div')
          },
        },
        { localVue: localVueFactory() }
      )
      expect('$mq' in wrapper.vm).toBe(true)
    })
    test('should set $mq.current accordingly when media query change', () => {
      const wrapper = shallowMount(
        {
          render (h) {
            return h('div')
          },
        },
        { localVue: localVueFactory() }
      )
      changeMediaQuery({ type: 'screen', width: 700 })
      expect(wrapper.vm.$mq.current).toBe('md')
    })
    test('should expose breakpoints at $mq.breakpoints', () => {
      const wrapper = shallowMount(
        {
          render (h) {
            return h('div')
          },
        },
        {
          localVue: localVueFactory({
            breakpoints: {
              sm: 450,
              md: 300,
              lg: Infinity,
            },
          }),
        }
      )
      expect(wrapper.vm.$mq.breakpoints).toEqual({
        sm: 450,
        md: 300,
        lg: Infinity,
      })
    })
  })
  describe('change breakpoints', () => {
    beforeEach(() => {})
    test('can mutate breakpoint', () => {
      const wrapper = shallowMount(
        {
          render (h) {
            return h('div')
          },
        },
        { localVue: localVueFactory() }
      )
      wrapper.vm.$mq.breakpoints = {
        sm: 300,
      }
      expect(wrapper.vm.$mq.breakpoints).toEqual({
        sm: 300,
      })
    })
    test('should teardown and setup listeners', async () => {
      const wrapper = shallowMount(
        {
          render (h) {
            return h('div')
          },
        },
        { localVue: localVueFactory() }
      )
      wrapper.vm.$mqLib.setupListeners = jest.fn(
        wrapper.vm.$mqLib.setupListeners
      )
      wrapper.vm.$mqLib.teardownListeners = jest.fn(
        wrapper.vm.$mqLib.teardownListeners
      )
      wrapper.vm.$mq.breakpoints = {
        sm: 300,
      }
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.$mqLib.teardownListeners).toBeCalled()
      expect(wrapper.vm.$mqLib.setupListeners).toBeCalled()
    })
    test('should set current breakpoint', async () => {
      const wrapper = shallowMount(
        {
          render (h) {
            return h('div')
          },
        },
        { localVue: localVueFactory() }
      )
      wrapper.vm.$mq.breakpoints = {
        xs: 300,
      }
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.$mq.current).toBe('xs')
    })
  })
})
