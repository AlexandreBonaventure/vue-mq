/**
 * Created by 方剑成 on 2017/4/23.
 */
if (typeof Object.assign != 'function') {
  Object.assign = function(target) {
    'use strict';
    var arguments$1 = arguments;

    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    target = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments$1[index];
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };
}

var Object_assign = Object.assign;

var camel2hyphen$1 = function (str) {
  return str
          .replace(/[A-Z]/g, function (match) {
            return '-' + match.toLowerCase();
          })
          .toLowerCase();
};

var camel2hyphen_1 = camel2hyphen$1;

var camel2hyphen = camel2hyphen_1;

var isDimension = function (feature) {
  var re = /[height|width]$/;
  return re.test(feature);
};

var obj2mq = function (obj) {
  var mq = '';
  var features = Object.keys(obj);
  features.forEach(function (feature, index) {
    var value = obj[feature];
    feature = camel2hyphen(feature);
    // Add px to dimension features
    if (isDimension(feature) && typeof value === 'number') {
      value = value + 'px';
    }
    if (value === true) {
      mq += feature;
    } else if (value === false) {
      mq += 'not ' + feature;
    } else {
      mq += '(' + feature + ': ' + value + ')';
    }
    if (index < features.length-1) {
      mq += ' and ';
    }
  });
  return mq;
};

var json2mq = function (query) {
  var mq = '';
  if (typeof query === 'string') {
    return query;
  }
  // Handling array of media queries
  if (query instanceof Array) {
    query.forEach(function (q, index) {
      mq += obj2mq(q);
      if (index < query.length-1) {
        mq += ', ';
      }
    });
    return mq;
  }
  // Handling single media query
  return obj2mq(query);
};

var index$1 = json2mq;

function convertBreakpointsToMediaQueries(breakpoints) {
  var keys = Object.keys(breakpoints);
  var breakpointValues = [0 ].concat( Object.values(breakpoints).slice(0, -1));
  var mediaQueries = breakpointValues.reduce(function (sum, value, index) {
    var options = Object_assign(
      {
        minWidth: value,
      },
      index < keys.length - 1 ? { maxWidth: breakpointValues[index+1] - 1 } : {}
    );
    var mediaQuery = index$1(options);
    return Object_assign(
      sum,
      ( obj = {}, obj[keys[index]] = mediaQuery, obj )
    )
    var obj;
  }, {});
  return mediaQueries
}

function transformValuesFromBreakpoints(breakpoints, values, currentBreakpoint) {
  var findClosestValue = function (currentBreakpoint) {
    var index = breakpoints.findIndex(function (b) { return b === currentBreakpoint; });
    var newBreakpoint = index !== -1 || index !== 0 ? breakpoints[index-1] : null;
    if (!newBreakpoint) { return values[index] }
    return values[newBreakpoint] || findClosestValue(newBreakpoint)
  };
  var result = values[currentBreakpoint] || findClosestValue(currentBreakpoint);
  return result
}

var DEFAULT_BREAKPOINT = {
  sm: 450,
  md: 1250,
  lg: Infinity,
};

var install = function (Vue, ref) {
  if ( ref === void 0 ) ref = {};
  var breakpoints = ref.breakpoints; if ( breakpoints === void 0 ) breakpoints = DEFAULT_BREAKPOINT;

  // Init reactive component
  var reactorComponent = new Vue({
    data: function () { return ({
      currentBreakpoint: null,
    }); }
  });

  var mediaQueries = convertBreakpointsToMediaQueries(breakpoints);
  Object.keys(mediaQueries).map(function (key) {
    var mediaQuery = mediaQueries[key];
    var enter = function () { reactorComponent.currentBreakpoint = key; };
    _subscribeToMediaQuery(mediaQuery, enter);
  });

  function _subscribeToMediaQuery(mediaQuery, enter) {
    var mql = window.matchMedia(mediaQuery);
    var cb = function (ref) {
      var matches = ref.matches;

      if (matches) { enter(); }
    };
    mql.addListener(cb); //subscribing
    cb(mql); //initial trigger
  }

  Vue.filter('mq', function (currentBreakpoint, values) {
    return transformValuesFromBreakpoints(Object.keys(breakpoints), values, currentBreakpoint)
  });
  Vue.mixin({
    computed: {
      $mq: function $mq() {
        return reactorComponent.currentBreakpoint
      },
    }
  });
};

var index = { install: install };

export default index;
