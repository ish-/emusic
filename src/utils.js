import random from 'lodash/random'
import noop from 'lodash/noop'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import compact from 'lodash/compact'
import merge from 'lodash/merge'

export default {
  random,
  defaults,
  noop,
  addScript,
  pick,
  compact,
  merge,
  once,
  defer () {
    var defer = {}
    defer.promise = new Promise ((resolve, reject) => {
      defer.resolve = resolve, defer.reject = reject
    })
    return defer
  },
  log,
  clone,
}

function once (obj, eventName, fn) {
  var _fn = (e) => {
    _remove()
    fn.call(obj, e, obj)
  }
  function _remove () {
    obj.removeEventListener(eventName, _fn)
  }

  obj.addEventListener(eventName, _fn)
  return _remove
}

function clone (o) {
  return JSON.parse(JSON.stringify(o))
}

function log () {
  console.log.apply(console, arguments)
  return arguments[0]
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