import 'styles/main.styl'
import _ from 'utils'
import Shared from 'services/shared'

import 'filters/audio-duration'

import App from 'components/App.vue'

Vue.prototype.$ = Shared
Vue.prototype._log = (...args) => {
  console.log(...args)
  return args[0]
}


// if ((/lastfm/).test(location.search)) {
//   localStorage.setItem('e-lastfm-token', location.search.match(/token=([\w\d]*)/)[1])
// }
// 

window.App = new Vue({
  el: 'body',
  components: { App }
})

document.addEventListener('click', (e) => {
  const $el = e.target
  if (!$el.classList.contains('o-clickable'))
    return

  let time = Number($el.getAttribute('o-clickable-time'))
  $el.classList.add('is-clicked')
  setTimeout(() => {
    $el.classList.remove('is-clicked')
  }, time || 200)
}, false)