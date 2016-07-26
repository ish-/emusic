const STORAGE_NS = 'vk--'
const API_URL = 'https://api.vk.com/method/'

export default function request (method, opts) {
  if (options.frameMode)
    return _XDMRequest(method, opts)

  if (standaloneMethodsOverride.hasOwnProperty(method))
    return standaloneMethodsOverride[method](opts)
  return $jsonp(method, opts)
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
    window.__request_jsonp[requestIndex] = (d) => {
      d = d.hasOwnProperty('response') ? d.response : d
      logRequest(method, opts, d)
      if (d && d.error) {
        reject(d.error)
      } else {
        resolve(d)
      }
      delete window.__request_jsonp[requestIndex]
      document.body.removeChild(s)
    }
    s.onerror = reject
    document.body.appendChild(s)
  });
}

const consoleGroupMethod = console.groupCollapsed ? console.groupCollapsed.bind(console) : console.group.bind(console)
function logRequest (method, opts, d) {
  if (process.env.NODE_ENV === 'development') {
    consoleGroupMethod('API request: ' + method)
    console.log('API request: ', opts, d)
    console.groupEnd()
  }
}