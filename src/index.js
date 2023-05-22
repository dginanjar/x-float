import { computePosition, flip, shift, autoUpdate } from '@floating-ui/dom'
import { mutateDom } from 'alpinejs/src/mutation'
import { once } from 'alpinejs/src/utils/once'

export default (Alpine) => {
  Alpine.directive('float', (el, { value, modifiers, expression }, { evaluateLater, effect }) => {
    let toggler = el.parentElement.querySelector(`[x-ref=${value}]`)
    let evaluate = evaluateLater(expression)

    if (!el._x_doHide) el._x_doHide = () => {
      mutateDom(() => {
        el.style.setProperty('display', 'none', modifiers.includes('important') ? 'important' : undefined)
      })
    }

    if (!el._x_doShow) el._x_doShow = () => {
      mutateDom(() => {
        if (el.style.length === 1 && el.style.display === 'none') {
          el.removeAttribute('style')
        } else {
          el.style.removeProperty('display')
        }
      })
    }

    let updatePosition = () => {
      if (toggler === null) return

      computePosition(toggler, el, {
        placement: 'bottom-start',
        middleware: [flip(), shift()],
      }).then(({x, y}) => {
        Object.assign(el.style, {
          top: `${y}px`,
          left: `${x}px`
        })
      })
    }

    let cleanup = () => {
      if (toggler === null) return

      autoUpdate(toggler, el, updatePosition)
    }

    let hide = () => {
      el._x_doHide()
      el._x_isShown = false

      cleanup()
    }

    let show = () => {
      el._x_doShow()
      el._x_isShown = true

      updatePosition()
    }

    let clickAwayCompatibleShow = () => setTimeout(show)

    let toggle = once(
      value => value ? show() : hide(),
      value => {
        if (typeof el._x_toggleAndCascadeWithTransitions === 'function') {
          el._x_toggleAndCascadeWithTransitions(el, value, show, hide)
        } else {
          value ? clickAwayCompatibleShow() : hide()
        }
      }
    )

    let oldValue
    let firstTime = true

    effect(() => evaluate(value => {
      if (!firstTime && value === oldValue) return

      if (modifiers.includes('immediate')) value ? clickAwayCompatibleShow() : hide()

      toggle(value)

      oldValue = value
      firstTime = false
    }))
  })
}