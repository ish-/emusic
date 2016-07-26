import random from 'lodash/random'
import noop from 'lodash/noop'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import compact from 'lodash/compact'
import merge from 'lodash/merge'
import camelCase from 'lodash/camelCase'
import find from 'lodash/find'
import findIndex from 'lodash/findIndex'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'

const IS_MAC = (/Macintosh/i).test(window.navigator.userAgent)
const IS_TOUCHABLE = window.TouchEvent != null

export default {
  random,
  defaults,
  noop,
  addScript,
  pick,
  compact,
  merge,
  once,
  find,
  findIndex,
  once,
  camelCase,
  debounce,
  throttle,
  getPointerOffset,
  IS_TOUCHABLE,
  IS_MAC,
  setClassForTime,
  defer () {
    var defer = {}
    defer.promise = new Promise ((resolve, reject) => {
      defer.resolve = resolve, defer.reject = reject
    })
    return defer
  },
  log,
  bindLog,
  clone,
  parseHash,
  getUID: (() => {
    var uid = 0
    return () => {return uid++}
  })(),
}

function parseHash (hash) {
  if (!hash)
    return false

  return hash.split('&').reduce((hash, prop) => {
    var [key, value] = prop.split('=')
    hash[camelCase(key)] = value
    return hash
  }, {})
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

window._logs = []
function log () {
  if (process.env.NODE_ENV === 'development')
    console.log.apply(console, arguments)
  else
    window._logs.push(arguments.length === 1 ? arguments[0] : arguments)
  return arguments[0]
}

function bindLog (arg) {
  return log.bind(null, arg)
}

function addScript (url) {
  return new Promise((res, rej) => {
    var $script = document.createElement('SCRIPT')
    $script.src = url
    $script.onload = res
    $script.onerror = (e) => {
      throw new Error (`Cannot load script ${url}`)
    }
    document.head.appendChild($script)
  });
}

function getPointerOffset (e, vert, offsetBound = 0) {
  if (!IS_TOUCHABLE)
    return !vert ? e.offsetX : e.offsetY
  if (!vert)
    return e.layerX != null
      ? e.layerX
      : (e.touches[0] ? (e.touches[0].pageX - offsetBound) : 0)
  else
    return e.layerY != null
      ? e.layerY
      : (e.touches[0] ? (e.touches[0].pageY - offsetBound) : 0)
}

function setClassForTime ($el, className, time) {
  $el.classList.add(className)
  return setTimeout(() => {
    $el.classList.remove(className)
  }, time || 300)
}