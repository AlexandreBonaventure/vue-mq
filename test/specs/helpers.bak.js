import test from 'tape'
import { convertBreakpointsToMediaQueries, transformValuesFromBreakpoints, selectBreakpoints } from '../../src/helpers.js'

test('should transform breakpoints correctly', (t) => {
  t.plan(1)
  const breakpoints = {
    sm: 350,
    md: 900,
    lg: Infinity,
  }
  const expected = {
    sm: '(min-width: 0px) and (max-width: 349px)',
    md: '(min-width: 350px) and (max-width: 899px)',
    lg: '(min-width: 900px)',
  }
  const result = convertBreakpointsToMediaQueries(breakpoints)
  t.deepEqual(result, expected)
})

test('transformValuesFromBreakpoints should return values correctly', (t) => {
  t.plan(3)
  const breakpoints = ['sm', 'md', 'lg']
  const values = {
    sm: 1,
    md: 2,
    lg: 3,
  }
  const result1 = transformValuesFromBreakpoints(breakpoints, values, 'sm')
  t.equal(result1, 1)
  const result2 = transformValuesFromBreakpoints(breakpoints, values, 'md')
  t.equal(result2, 2)
  const result3 = transformValuesFromBreakpoints(breakpoints, values, 'lg')
  t.equal(result3, 3)
})

test('transformValuesFromBreakpoints should return values with mobile-first override', (t) => {
  t.plan(2)
  const breakpoints = ['sm', 'md', 'lg']
  const values = {
    sm: 1,
    lg: 3,
  }
  const result1 = transformValuesFromBreakpoints(breakpoints, values, 'sm')
  t.equal(result1, 1)
  const result2 = transformValuesFromBreakpoints(breakpoints, values, 'md')
  t.equal(result2, 1)
})

test('transformValuesFromBreakpoints should work with falsy values', (t) => {
  t.plan(2)
  const breakpoints = ['sm', 'md', 'lg']
  const values = {
    sm: false,
    lg: true,
  }
  const result1 = transformValuesFromBreakpoints(breakpoints, values, 'sm')
  t.equal(result1, false)
  const result2 = transformValuesFromBreakpoints(breakpoints, values, 'md')
  t.equal(result2, false)
})

test('selectBreakpoints', (t) => {
  t.plan(1)
  const breakpoints = ['sm', 'md', 'lg']
  const result = selectBreakpoints(breakpoints, 'md')
  t.deepEqual(result, ['md', 'lg'])
})
