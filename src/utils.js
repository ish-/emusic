import random from 'lodash/random'
import noop from 'lodash/noop'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import compact from 'lodash/compact'
// import pick from 'lodash/pick'

export default {
  random,
  defaults,
  noop,
  // pick
  addScript,
  pick,
  compact,
  log () { console.log.apply(console, arguments) },
  clone (o) {
    return JSON.parse(JSON.stringify(o))
  }
}

function addScript (url) {
  return new Promise((res, rej) => {
    var $script = document.createElement('SCRIPT')
    $script.src = url
    $script.onload = res
    $script.onerror = rej
    document.head.appendChild($script)
  });
}