/**
 * @jest-environment node
 */

import plugin from '../../src/index.js'
import Vue from 'vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import { render } from '@vue/server-test-utils'

const localVueFactory = (options) => {
  const localVue = createLocalVue()
  localVue.use(plugin, options)
  return localVue
}

describe('index.js', () => {
  test('should update defaultBreakpoint with instance method', async () => {
    const localVue = localVueFactory({ defaultBreakpoint: 'md' })
    localVue.prototype.$mqUpdateDefaultBreakpoint('sm')
    const vm = new localVue({
      render(h) { return h('div') }
    })
    expect(vm.$isServer).toBe(true)
    expect(vm.$mq).toBe('sm')
  })
})
