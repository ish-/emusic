import 'assets/polyfill'
import 'styles/main.styl'
import _ from 'utils'
import Shared from 'services/shared'

import 'filters/audio-duration'

import AuthWrapper from 'components/AuthWrapper.vue'

Vue.prototype.$ = Shared
Vue.prototype._log = (...args) => {
  console.log(...args)
  return args[0]
}


// if ((/lastfm/).test(location.search)) {
//   localStorage.setItem('e-lastfm-token', location.search.match(/token=([\w\d]*)/)[1])
// }

window.App = new Vue({
  el: 'body',
  components: {AuthWrapper},
})

document.addEventListener('click', (e) => {
  const $el = e.target
  if (!$el.classList.contains('o-clickable'))
    return true

  let time = Number($el.getAttribute('o-clickable-time'))
  $el.classList.add('is-clicked')
  setTimeout(() => {
    $el.classList.remove('is-clicked')
  }, time || 200)
}, false)