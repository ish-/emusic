import 'assets/polyfill'
import 'styles/main.styl'
import _ from 'utils'

window.Vue = Vue
window._errors = []
window.onerror = function (e) {
  window._errors.push(new Error(e))
}

import FastClick from 'fastclick'
import Shared from 'services/shared'

import 'filters/audio-duration'

import AuthWrapper from 'components/AuthWrapper.vue'

FastClick.attach(document.body)

Vue.prototype.$ = Shared
Vue.prototype._log = (...args) => {
  console.log(...args)
  return args[0]
}

document.addEventListener('load', () => document.documentElement.classList.add('is-loaded'))


document.addEventListener('click', (e) => {
  const $el = e.target
  if (!$el.classList.contains('o-clickable'))
    return true

  let time = Number($el.getAttribute('o-clickable-time'))
  _.setClassForTime($el, 'is-clicked', time || 200)
}, false)

window.App = new Vue({
  el: 'body',
  components: {AuthWrapper},
})
