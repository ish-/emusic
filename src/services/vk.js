/* global VK */

import _ from 'utils'
import Group from 'services/vk.group'
import Audio from 'services/vk.audio'
import Storage from 'services/vk.storage'
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

var vk = {
  standalone: !window.name,

  auth () {
    location.href = 'https://oauth.vk.com/authorize?client_id=5499210&redirect_uri='+encodeURIComponent(location.href)+'&display=popup&response_type=token&scope=audio';
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
          let hash = location.hash.substr(1)
          if (!hash)
            return reject()

          info = hash.split('&').reduce((hash, prop) => {
            var [key, value] = prop.split('=')
            hash[_.camelCase(key)] = value
            return hash
          }, {})
          
          if (!info || !info.userId)
            return reject()

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