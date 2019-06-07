// USAGE
// mq-layout(mq="lg")
//   p I’m lg
import { selectBreakpoints } from './helpers'
import { isArray } from './utils';
const component = {
  props: {
    mq: {
      required: true,
      type: [String, Array],
    },
    createContainer: { type: Boolean, default: false }
  },
  computed: {
    plusModifier() { return !isArray(this.mq) && this.mq.slice(-1) === '+' },
    activeBreakpoints() {
      const breakpoints = Object.keys(this.$mqAvailableBreakpoints)
      const mq = this.plusModifier ? this.mq.slice(0, -1) : (isArray(this.mq) ? this.mq : [this.mq])
      return this.plusModifier
        ? selectBreakpoints(breakpoints, mq)
        : mq
    }
  },
  render(h, props) {
    const shouldRenderChildren = this.activeBreakpoints.includes(this.$mq)
    return shouldRenderChildren ? (this.createContainer ? h('div', this.$slots.default) : this.$slots.default) : h()
  },
}

export default component
