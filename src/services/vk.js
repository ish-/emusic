/* global VK */

import _ from 'utils'
import Group from 'services/vk.group'
import Audio from 'services/vk.audio'
import Storage from 'services/vk.storage'

const API_VERSION = '5.52'

function initFrameMode () {
  VK.callMethod("resizeWindow", 620, 460)
  return new Promise ((resolve, reject) => {
    VK.init(resolve, reject, API_VERSION)
  })
}

var vk = {
  inited: (() => {
    if (window.name)
      return _.addScript("https://vkontakte.ru/js/api/xd_connection.js")
        .then(initFrameMode)
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