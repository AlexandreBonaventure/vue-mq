import test from 'tape'
import plugin from '../../src/index.js'
import Vue from 'vue'

let windowWidth = 200
const subscribers = {}
window.matchMedia = (query) => {
  const queryMap = {
    '(min-width: 0px) and (max-width: 349px)': () => windowWidth < 350,
    '(min-width: 350px) and (max-width: 899px)': () => windowWidth < 900 && windowWidth >= 350,
    '(min-width: 900px)': () => windowWidth >= 900,
  }

  const queryValue = queryMap[query];
  const matches = queryValue ? queryValue() : false;
  return {
    matches,
    addListener(cb) {
      subscribers[query] = subscribers[query] || []
      subscribers[query].push(cb)
    },
    removeListener: () => {}
  }
}

function triggerQueryChange(query, matches) {
  subscribers[query].forEach(cb => cb({ matches }))
}

Vue.use(plugin, {
  breakpoints: {
    sm: 350,
    md: 900,
    lg: Infinity,
  }
})

test('should register $mq property', (t) => {
  t.plan(1)
  const component = new Vue()
  const result = '$mq' in component
  t.ok(result)
})

test('should react to mediaQueries correctly', (t) => {
  t.plan(2)
  const component = new Vue()
  t.equal(component.$mq, 'sm')
  triggerQueryChange('(min-width: 350px) and (max-width: 899px)', true)
  t.equal(component.$mq, 'md')
})

test('should use defaultBreakpoint value', (t) => {
  t.plan(2)
  const component = new Vue()
  t.equal(component.$mq, 'sm')
  triggerQueryChange('(min-width: 350px) and (max-width: 899px)', true)
  t.equal(component.$mq, 'md')
})
