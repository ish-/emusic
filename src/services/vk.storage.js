import request from 'services/vk.request'

export default {
  set (key ,value) {
    var opts = {key}
    if (value)
      opts.value = 'ok:' + JSON.stringify(value)
    return request('storage.set', opts)
  },

  get (...keys) {
    return request('storage.get', {keys}).then((props) => {
      return props.reduce((m, prop) => {
        if (!prop.value)
          return m
        try {
          m[prop.key] = JSON.parse(prop.value.substr(3)) || null
        } catch (e) {
          throw Error(e)
        }
        return m
      }, {})
    })
  }
}