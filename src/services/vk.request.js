export default function request (method, opts) {
  return new Promise((resolve, reject) => {
    VK.api(method, opts, function (d) {
      d = d.hasOwnProperty('response') ? d.response : d
      console.log('API request: ', method, opts, d)
      resolve(d)
    })
  })
}