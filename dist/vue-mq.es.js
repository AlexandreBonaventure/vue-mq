import keys from 'core-js/library/fn/object/keys';
import defineProperty from 'core-js/library/fn/object/define-property';
import assign from 'core-js/library/fn/object/assign';
import isArray from 'core-js/library/fn/array/is-array';
import from from 'core-js/library/fn/array/from';
import isIterable from 'core-js/library/fn/is-iterable';
import 'core-js/modules/es6.array.find-index';
import 'core-js/modules/es6.array.reduce';
import 'core-js/modules/es6.array.map';
import json2mq from 'json2mq';
import getIterator from 'core-js/library/fn/get-iterator';
import set from 'core-js/library/fn/set';
import 'core-js/modules/es6.regexp.to-string';
import 'core-js/modules/es6.date.to-string';
import 'core-js/modules/es7.array.includes';
import 'core-js/modules/es6.string.includes';
import 'core-js/modules/es6.object.define-property';
import 'core-js/modules/es6.array.filter';
import 'core-js/modules/es6.array.iterator';
import 'core-js/modules/es6.promise';
import 'core-js/modules/es7.promise.finally';

var keys$1 = keys;

var defineProperty$1 = defineProperty;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    defineProperty$1(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var assign$1 = assign;

var isArray$1 = isArray;

function _arrayWithoutHoles(arr) {
  if (isArray$1(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }
}

var from_1 = from;

var isIterable$1 = isIterable;

function _iterableToArray(iter) {
  if (isIterable$1(Object(iter)) || Object.prototype.toString.call(iter) === "[object Arguments]") return from_1(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function convertBreakpointsToMediaQueries(breakpoints) {
  var keys$$1 = keys$1(breakpoints);

  var values = keys$$1.map(function (key) {
    return breakpoints[key];
  });
  var breakpointValues = [0].concat(_toConsumableArray(values.slice(0, -1)));
  var mediaQueries = breakpointValues.reduce(function (sum, value, index) {
    var options = assign$1({
      minWidth: value
    }, index < keys$$1.length - 1 ? {
      maxWidth: breakpointValues[index + 1] - 1
    } : {});

    var mediaQuery = json2mq(options);
    return assign$1(sum, _defineProperty({}, keys$$1[index], mediaQuery));
  }, {});
  return mediaQueries;
}
function transformValuesFromBreakpoints(breakpoints, values, currentBreakpoint) {
  var findClosestValue = function findClosestValue(currentBreakpoint) {
    if (values[currentBreakpoint] !== undefined) {
      return values[currentBreakpoint];
    }

    var index = breakpoints.findIndex(function (b) {
      return b === currentBreakpoint;
    });
    var newBreakpoint = index !== -1 || index !== 0 ? breakpoints[index - 1] : null;
    if (!newBreakpoint) return values[index];
    return values[newBreakpoint] !== undefined ? values[newBreakpoint] : findClosestValue(newBreakpoint);
  };

  return findClosestValue(currentBreakpoint);
}
function selectBreakpoints(breakpoints, currentBreakpoint) {
  var index = breakpoints.findIndex(function (b) {
    return b === currentBreakpoint;
  });
  return breakpoints.slice(index);
}
function subscribeToMediaQuery(mediaQuery, enter) {
  var mql = window.matchMedia(mediaQuery);

  var cb = function cb(_ref) {
    var matches = _ref.matches;
    if (matches) enter();
  };

  mql.addListener(cb); // subscribing

  cb(mql); // initial trigger

  return function () {
    return mql.removeListener(cb);
  }; // return unsubscribtion
}

var getIterator$1 = getIterator;

var set$1 = set;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;

    defineProperty$1(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var MQ =
/*#__PURE__*/
function () {
  function MQ(_ref) {
    var _this = this;

    var breakpoints = _ref.breakpoints,
        defaultBreakpoint = _ref.defaultBreakpoint,
        Vue = _ref.Vue;

    _classCallCheck(this, MQ);

    _defineProperty(this, "hasSetupListeners", false);

    _defineProperty(this, "listeners", new set$1());

    _defineProperty(this, "vm", null);

    // Init reactive component
    this.vm = new Vue({
      data: function data() {
        return {
          currentBreakpoint: defaultBreakpoint,
          breakpoints: breakpoints
        };
      },
      watch: {
        breakpoints: {
          deep: true,
          handler: function handler() {
            _this.teardownListeners();

            _this.setupListeners();
          }
        }
      }
    });
  }

  _createClass(MQ, [{
    key: "setupListeners",
    value: function setupListeners() {
      var _this2 = this;

      if (!this.hasSetupListeners) {
        var mediaQueries = convertBreakpointsToMediaQueries(this.vm.breakpoints); // setup listeners

        var _loop = function _loop(key) {
          var mediaQuery = mediaQueries[key];

          var enter = function enter() {
            _this2.vm.currentBreakpoint = key;
          };

          _this2.listeners.add(subscribeToMediaQuery(mediaQuery, enter));
        };

        for (var key in mediaQueries) {
          _loop(key);
        }

        this.hasSetupListeners = true;
      }
    }
  }, {
    key: "teardownListeners",
    value: function teardownListeners() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = getIterator$1(this.listeners), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var unsub = _step.value;
          unsub();
          this.listeners.delete(unsub);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.hasSetupListeners = false;
    }
  }, {
    key: "api",
    get: function get() {
      var vm = this.vm;
      return {
        get breakpoints() {
          return vm.breakpoints;
        },

        set breakpoints(val) {
          vm.breakpoints = val;
        },

        get current() {
          return vm.currentBreakpoint;
        }

      };
    }
  }]);

  return MQ;
}();

function isArray$2(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
}

var component = {
  props: {
    mq: {
      required: true,
      type: [String, Array]
    }
  },
  computed: {
    plusModifier: function plusModifier() {
      return !isArray$2(this.mq) && this.mq.slice(-1) === '+';
    },
    activeBreakpoints: function activeBreakpoints() {
      var breakpoints = keys$1(this.$mq.breakpoints);

      var mq = this.plusModifier ? this.mq.slice(0, -1) : isArray$2(this.mq) ? this.mq : [this.mq];
      return this.plusModifier ? selectBreakpoints(breakpoints, mq) : mq;
    }
  },
  render: function render(h, props) {
    var shouldRenderChildren = this.activeBreakpoints.includes(this.$mq.current);
    return shouldRenderChildren ? h('div', this.$slots.default) : h();
  }
};

var DEFAULT_BREAKPOINTS = {
  sm: 450,
  md: 1250,
  lg: Infinity
};

var install = function install(Vue) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$breakpoints = _ref.breakpoints,
      breakpoints = _ref$breakpoints === void 0 ? DEFAULT_BREAKPOINTS : _ref$breakpoints,
      _ref$defaultBreakpoin = _ref.defaultBreakpoint,
      defaultBreakpoint = _ref$defaultBreakpoin === void 0 ? 'sm' : _ref$defaultBreakpoin;

  var mq = new MQ({
    breakpoints: breakpoints,
    defaultBreakpoint: defaultBreakpoint,
    Vue: Vue
  });
  Vue.filter('mq', function (api, values) {
    return transformValuesFromBreakpoints(keys$1(breakpoints), values, api.current);
  });
  Vue.mixin({
    beforeMount: function beforeMount() {
      mq.setupListeners();
    }
  });
  Object.defineProperty(Vue.prototype, '$mq', {
    get: function get() {
      return mq.api;
    }
  });

  if (process.env.NODE_ENV === 'test') {
    // expose full lib
    Vue.prototype.$mqLib = mq;
  }

  Vue.prototype.$mqAvailableBreakpoints = mq.vm.breakpoints; // DEPRECATION

  Vue.component('MqLayout', component);
};

var index = {
  install: install
};

export default index;
