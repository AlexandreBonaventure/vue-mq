import plugin from '../../src/index.js'
import Vue from 'vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'

window.matchMedia = jest.fn((query) => {
  return {
    matches: true,
    addListener(cb) {},
    removeListener: () => {}
  }
})
const generateVueWithPlugin = (options) => {
  const localVue = createLocalVue()
  localVue.use(plugin, options)
  return localVue
}

describe('index.js', () => {
  test('should register $mq property', () => {
    const wrapper = shallowMount({ render(h) { return h('div') } }, { localVue: generateVueWithPlugin() })
    expect('$mq' in wrapper.vm).toBe(true)
  })
  test('should default to defaultBreakpoint in options', () => {
    const wrapper = shallowMount({ render(h) { return h('div') } }, { localVue: generateVueWithPlugin({ defaultBreakpoint: 'md' }) })
    expect(wrapper.vm.$mq).toBe('md')
  })
})
