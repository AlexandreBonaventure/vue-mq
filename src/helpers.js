import json2mq from 'json2mq'

export function convertBreakpointsToMediaQueries(breakpoints) {
  const keys = Object.keys(breakpoints)
  const breakpointValues = [0, ...Object.values(breakpoints).slice(0, -1)]
  const mediaQueries = breakpointValues.reduce((sum, value, index) => {
    const options = Object.assign(
      {
        minWidth: value,
      },
      index < keys.length - 1 ? { maxWidth: breakpointValues[index+1] - 1 } : {}
    )
    const mediaQuery = json2mq(options)
    return Object.assign(
      sum,
      {
        [keys[index]]: mediaQuery,
      }
    )
  }, {})
  return mediaQueries
}

export function transformValuesFromBreakpoints(breakpoints, values, currentBreakpoint) {
  const findClosestValue = (currentBreakpoint) => {
    const index = breakpoints.findIndex(b => b === currentBreakpoint)
    const newBreakpoint = index !== -1 || index !== 0 ? breakpoints[index-1] : null
    if (!newBreakpoint) return values[index]
    return values[newBreakpoint] || findClosestValue(newBreakpoint)
  }
  const result = values[currentBreakpoint] || findClosestValue(currentBreakpoint)
  return result
}
