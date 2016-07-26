const PING_URL = 'https://emusic.dearwhoever.space/'

var current

var ping = function (waitTime = 0) {
  var timeout
  if (current)
    return current
  
  return current = new Promise ((resolve, reject) => {
    var xhr = new XMLHttpRequest
    xhr.open('HEAD', PING_URL + '?' + Date.now())
    timeout = setTimeout(() => {
      current = timeout = null
      xhr.abort()
      reject()
    }, 1000 + waitTime)
    xhr.onreadystatechange = () => {
      if (!timeout || xhr.readyState !== 4)
        return
      clearTimeout(timeout)
      current = timeout = null
      if (xhr.status < 400 && xhr.status !== 0)
        resolve()
      else
        reject()
    }

    setTimeout(() => {
      xhr.send(null)
    }, waitTime)
  })
}

var listeners = []

function sendToListeners (status) {
  listeners.forEach((fn) => fn(status))  
}

ping.untilOnline = (waitTime = 0) => {

  return ping(waitTime)
    .then(() => {
      sendToListeners(true)
      listeners.splice(null)
    })
    .catch(() => {
      sendToListeners(false)
      return ping.untilOnline(1000)
    })
}

ping.subscribe = (fn) => {
  listeners.push(fn)
  if (listeners.length === 1)
    ping.untilOnline()
  return ping.unsubscribe.bind(null, fn)
}

ping.unsubscribe = (fn) => {
  listeners.splice(listeners.indexOf(fn), 1)
}


export default ping