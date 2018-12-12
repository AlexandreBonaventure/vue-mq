# Vue MQ (MediaQuery)
Define your breakpoints and build responsive design semantically and declaratively in a mobile-first way with Vue.

_Use with `vue:  ^2.x.x`
_

**Demo**: [here](https://alexandrebonaventure.github.io/vue-mq)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [SSR Support](#ssr-support)
- [Browser Support](#browser-support)
- [Support](#support)


## Installation

#### Using NPM

```sh
npm install vue-mq
```
#### Using Yarn
```sh
yarn add vue-mq
```

## Usage

#### 1. Install plugin
Define your custom breakpoints by passing `breakpoints` option. This let you name the breakpoints as you want
**Eg**:
`{ phone: 500, tablet: 1200, other: Infinity }`
`{ small: 500, large: 1200, whatever: Infinity }`
`{ xs: 300, s: 500, m: 800, l: 1200, xl: Infinity }`
```js
import Vue from 'vue'
import VueMq from 'vue-mq'

Vue.use(VueMq, {
  breakpoints: { // default breakpoints - customize this
    sm: 450,
    md: 1250,
    lg: Infinity,
  }
  defaultBreakpoint: 'sm' // customize this for SSR
})
```
#### Use `$mq` property
After installing the plugin every instance of Vue component is given access to a reactive $mq property. Its value will be a `String` which is the current breakpoint.

**Eg:** _(with default breakpoints)_
`'sm'` => **0 > screenWidth < 450**
`'md'` => **450 >= screenWidth < 1250**
`'lg'` => **screenWidth >= 1250**

```js
//Use it in a component
new Vue({
  template: `
    <h1>current: {{$mq}}</h1>
  `,
})
```

#### Use `$mq` property with the mq filter
Using the filter allow to build your responsive design in a declarative way. This can be very useful and elegant to pass down props to layout component. (eg: a grid system)

```js
new Vue({
  template: `
    <grid-component :column="$mq | mq({ sm: 1, md: 2, lg: 3 })">
    </grid-component>
  `,
})
```

Remember that the filter design embrace mobile-first philosophy so writing `$mq | mq({ sm: 1, lg: 3 })` will output `1` for `md` breakpoint if omited. In short it will always fallback to the smallest breakpoint (_aka mobile_) if value isn't overriden by a largest breakpoint.


#### Use `$mq` with a computed property
`$mq` property is fully reactive (like a data property) so feel free to use it in a computed.

```js
new Vue({
  computed: {
    displayText() {
      return this.$mq === 'sm' ? 'I am small' : 'I am large'
    }
  },
  template: `
    <h1>{{displayText}}</h1>
  `,
})
```

#### MqLayout component
In addition to `$mq` property this plugin provide a wrapper component to facilitate conditional rendering with media queries.

**Usage**:
```
<mq-layout mq="lg">
  <span> Display on lg </span>
</mq-layout>
<mq-layout mq="md+">
  <span> Display on md and larger </span>
</mq-layout>
<mq-layout :mq="['sm', 'lg']">
  <span> Display on sm and lg </span>
</mq-layout>
```
**Props**
mq => required : String | Array

*Important*: note that you can append a `+` modifier at the end of the string to specify that the conditional rendering happens for all greater breakpoints.

## SSR Support
v1.0+ now supports SSR. You can customize the `defaultBreakpoint` which let you set the breakpoint used by the server-side-rendering 

## Browser Support
This plugin relies on matchMedia API to detect screensize change. So for older browsers and IE, you should polyfill this out:
Paul Irish: [matchMedia polyfill](https://github.com/paulirish/matchMedia.js)

## Support

Please [open an issue](https://github.com/AlexandreBonaventure/vue-mq/issues/new) for support.
