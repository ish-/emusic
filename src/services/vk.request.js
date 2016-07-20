export default function request (method, opts) {
  return new Promise((resolve, reject) => {
    VK.api(method, opts, function (d) {
      d = d.hasOwnProperty('response') ? d.response : d
      if (process.env.NODE_ENV === 'development') {
        console.groupCollapsed('API request: ' + method)
        console.log('API request: ', opts, d)
        console.groupEnd()
      }
      resolve(d)
    })
  })
}