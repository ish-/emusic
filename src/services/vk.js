/* global VK */

import _ from 'utils'
import Group from 'services/vk.group'
import Audio from 'services/vk.audio'
import Storage from 'services/vk.storage'
import Shared from 'services/shared'
import {options} from 'services/vk.request'

const API_VERSION = '5.52'

function initFrameMode () {
  VK.callMethod("resizeWindow", 620, 460)
  return new Promise ((resolve, reject) => {
    VK.init(resolve, reject, API_VERSION)
  })
}

function getStorageInfo () {
  var info = localStorage.getItem('vk--auth')
  if (!info)
    return false
  try {
    info = JSON.parse(info)
  } catch (e) {
    return false
  }
  return info
}

function authUri (redirectUri) {
  return 'https://oauth.vk.com/authorize?client_id=5499210&redirect_uri='+encodeURIComponent(redirectUri)+'&display=popup&response_type=token&scope=audio,offline'
}

var vk = {
  standalone: !window.name,

  auth () {
    if (!Shared.IS_CORDOVA) 
      return location.href = authUri(location.origin + location.pathname)

    var w = Shared.cordova.open(authUri('https://oauth.vk.com/blank.html'), '_blank')
    if (!w)
      throw new Error ('Cannot open window')
    w.addEventListener('loadstop', function ({url}) {
      var hash = url.split('#')
      if (!(hash = hash[1]))
        return
      var info = _.parseHash(hash)
      if (!info || !info.accessToken)
        return
      localStorage.setItem('vk--auth', JSON.stringify(info))
      w.close()
      w = null
      window.location.reload()
    })
  },

  inited: (() => {
    if (window.name) {
      options.frameMode = true
      return _.addScript("https://vkontakte.ru/js/api/xd_connection.js")
        .then(initFrameMode)
    } else {
      return new Promise(function (resolve, reject) {
        var info = getStorageInfo()

        if (!info) {
          info = _.parseHash(location.hash.substr(1))
          
          if (!info || !info.accessToken)
            return reject('Cannot load VK auth info')

          location.hash = ''
          localStorage.setItem('vk--auth', JSON.stringify(info))
        }

        options.accessToken = info.accessToken
        resolve()
      })
    }
  })(),
  // props: ((str) => {
  //   return str.substr(1).split('&').reduce((mem, prop) => {
  //     var [key, value] = prop.split('=')
  //     mem[key] = value
  //     return mem
  //   }, {})
  // })(window.location.search),

  Group, Audio, Storage,
}

window._vk = vk

export default vk