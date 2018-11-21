
import {
  convertBreakpointsToMediaQueries,
  transformValuesFromBreakpoints,
  selectBreakpoints
} from '../../src/helpers.js'

describe('helpers.js', () => {
  test('#convertBreakpointsToMediaQueries', () => {
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
    expect(result).toEqual(expected)
  })
  test('#selectBreakpoints', () => {
    const breakpoints = ['sm', 'md', 'lg']
    const result = selectBreakpoints(breakpoints, 'md')
    expect(result).toEqual(['md', 'lg'])
  })
  describe('#transformValuesFromBreakpoints', () => {
    test('should work with falsy values', () => {
      const breakpoints = ['sm', 'md', 'lg']
      const values = {
        sm: false,
        lg: true,
      }
      const result1 = transformValuesFromBreakpoints(breakpoints, values, 'sm')
      expect(result1).toBe(false)
    })
    test('should return values correctly', () => {
      const breakpoints = ['sm', 'md', 'lg']
      const values = {
        sm: 1,
        md: 2,
        lg: 3,
      }
      const result1 = transformValuesFromBreakpoints(breakpoints, values, 'sm')
      const result2 = transformValuesFromBreakpoints(breakpoints, values, 'md')
      const result3 = transformValuesFromBreakpoints(breakpoints, values, 'lg')
      expect(result1).toBe(1)
      expect(result2).toBe(2)
      expect(result3).toBe(3)
    })
    test('should return values with mobile-first override', () => {
      const breakpoints = ['sm', 'md', 'lg']
      const values = {
        sm: 1,
        lg: 3,
      }
      const result1 = transformValuesFromBreakpoints(breakpoints, values, 'sm')
      const result2 = transformValuesFromBreakpoints(breakpoints, values, 'md')
      expect(result1).toBe(1)
      expect(result2).toBe(1)
    })
  })
})
