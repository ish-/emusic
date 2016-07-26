import Shared from 'services/shared'

const STORAGE_NS = 'vk--'
const API_URL = 'https://api.vk.com/method/'
const REQUEST_TIMEOUT = 10000

var http = limitCall($http, 3, 1000)
var jsonp = limitCall($jsonp, 3, 1000)

export default function request (method, opts, i = 0) {
  if (i > 2) {
    logRequest()
    return Promise.reject('Maximum call request call count')
  }
  return (function () {
    if (options.frameMode)
      return _XDMRequest(method, opts)
    if (standaloneMethodsOverride.hasOwnProperty(method))
      return standaloneMethodsOverride[method](opts)
    if (IS_CORDOVA)
      return http(method, opts)
    return jsonp(method, opts)
  })().catch((e) => {
    if (e && e.error_code)
      throw new Error (e)
    return Shared.isOnline(true)
      .then(() => request(method, opts, ++i))
  })
}

export var options = {
  frameMode: false,
  accessToken: null,
}

function _XDMRequest (method, opts) {
  return new Promise((resolve, reject) => {
    VK.api(method, opts, function (d) {
      d = d.hasOwnProperty('response') ? d.response : d
      logRequest(method, opts, d)
      if (d && d.error)
        return reject(d.error)
      resolve(d)
    }, reject)
  })
}

const standaloneMethodsOverride = {
  ['storage.get'] ({keys}) {
    return Promise.resolve(
      keys.map((key) => {
        return {
          key,
          value: localStorage.getItem(STORAGE_NS + key)
        }
      })
    )
  },
  ['storage.set'] ({key, value}) {
    return Promise.resolve(
      localStorage.setItem(STORAGE_NS + key, value)
    )
  }
}

function limitCall(fn, maxTimes, period) {
  var lastTime = 0
  var queue = []
  return function (...args) {
    var now = Date.now()
    queue.push(now)

    setTimeout(() => {
      queue.splice(queue.indexOf(now), 1)
    }, period + 5)

    if (queue.length > maxTimes)
      return new Promise ((resolve, reject) => {
        setTimeout(() => {
          fn(...args).then(resolve, reject)
        }, Math.floor(queue.length / maxTimes) * period)
      })
    return fn(...args)

  }
}

var _requestJsonpIndex = 0
window.__request_jsonp = {}
function $jsonp (method, opts) {
  _requestJsonpIndex++
  return new Promise ((resolve, reject) => {
    var requestIndex = _requestJsonpIndex
    var s = document.createElement('script')
    s.async = true
    var query = Object.keys(opts).map((name) => {
      return `${name}=${encodeURIComponent(opts[name])}`
    }).join('&')
    s.src = `${API_URL}${method}?${query}&access_token=${options.accessToken}&callback=__request_jsonp[${requestIndex}]&v=5.52`
    const timeout = setTimeout(() => {
      reject('Request timeout')
      window.__request_jsonp[requestIndex] = _.noop  
    }, REQUEST_TIMEOUT)
    window.__request_jsonp[requestIndex] = (d) => {
      clearTimeout(timeout)
      d = d.hasOwnProperty('response') ? d.response : d
      logRequest(method, opts, d)
      if (d && d.error) {
        reject(d.error)
      } else {
        resolve(d)
      }
      delete window.__request_jsonp[requestIndex]
      document.head.removeChild(s)
    }
    s.onerror = reject
    document.head.appendChild(s)
  });
}

function $http (method, opts) {
  return new Promise ((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    var query = Object.keys(opts).map((name) => {
      return `${name}=${encodeURIComponent(opts[name])}`
    }).join('&')
    xhr.open('GET', `${API_URL}${method}?${query}&access_token=${options.accessToken}&v=5.52`)
    const timeout = setTimeout(() => {
      reject('Request timeout')
    }, REQUEST_TIMEOUT)
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4)
        return
      clearTimeout(timeout)
      var d  

      try {
        d = JSON.parse(xhr.responseText)
      } catch (e) {
        throw new Error (e)
      }

      d = d.hasOwnProperty('response') ? d.response : d
      logRequest(method, opts, d)

      if (xhr.status < 200 && xhr.status >= 400)
        return reject(d)

      if (d && d.error)
        return reject(d)
      
      return resolve(d)
    }
    xhr.send()
  })
}

const consoleGroupMethod = console.groupCollapsed ? console.groupCollapsed.bind(console) : console.group.bind(console)
function logRequest (method, opts, d) {
  if (process.env.NODE_ENV === 'development') {
    consoleGroupMethod('API request: ' + method)
    if (!d || (d && d.error_code))
      console.error('API request: ', opts)
    else
      console.log('API request: ', opts, d)
    console.groupEnd()
  }
}