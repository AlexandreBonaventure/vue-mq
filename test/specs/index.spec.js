import plugin from '../../src/index.js'
import Vue from 'vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import MatchMediaMock from 'match-media-mock'

const localVueFactory = (options) => {
  const localVue = createLocalVue()
  localVue.use(plugin, options)
  return localVue
}

describe('index.js', () => {
  let results
  let matchMediaMock  
  beforeEach(() => {
    results = new Set()
    matchMediaMock = MatchMediaMock.create()
    matchMediaMock.setConfig({type: 'screen', width: 1200})
    window.matchMedia = jest.fn((query) => {
      const result = matchMediaMock(query)
      results.add(result)
      return result
    })
  })
  test('should register $mq property', () => {
    const wrapper = shallowMount({ render(h) { return h('div') } }, { localVue: localVueFactory() })
    expect('$mq' in wrapper.vm).toBe(true)
  })
  test('should default to defaultBreakpoint in options', () => {
    const localVue = localVueFactory({ defaultBreakpoint: 'md' })
    const vm = new localVue({ 
      render(h) { return h('div') } 
    })
    expect(vm.$mq).toBe('md')
  })
  test('should subscribe to media queries', () => {
    const wrapper = shallowMount({ render(h) { return h('div') } }, { localVue: localVueFactory() })
    expect(window.matchMedia).toBeCalledWith('(min-width: 1250px)')
    expect(window.matchMedia).toBeCalledWith('(min-width: 450px) and (max-width: 1249px)')
    expect(window.matchMedia).toBeCalledWith('(min-width: 0px) and (max-width: 449px)')
  })
  test('should set $mq accordingly when media query change', () => {
    const wrapper = shallowMount({ render(h) { return h('div') } }, { localVue: localVueFactory() })
    matchMediaMock.setConfig({type: 'screen', width: 700})
    Array.from(results)[1].callListeners()
    expect(wrapper.vm.$mq).toBe('md')
  })
})
