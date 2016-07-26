/* global cordova */

import _ from 'utils'

export const PLAYER_NOTIFICATION_ID = 1

var _cordova = {
  paused: false,
  inited: false,

  ready (fn) {
    if (this.inited)
      return fn()
    return deviceready.then(fn)
  },

  init () {
    const $doc = document.documentElement

    $doc.classList.add('t-cordova')
    StatusBar.backgroundColorByName("lightGray")
    AndroidFullScreen.showUnderStatusBar(() => $doc.classList.add('is-under-statusbar'))
    AndroidFullScreen.showUnderSystemUI(() => $doc.classList.add('is-under-systemui'))

    cordova.plugins.backgroundMode.setDefaults({silent: true})
    cordova.plugins.backgroundMode.enable()
    
    document.addEventListener('pause', () => {
      this.paused = true
    })
    document.addEventListener('resume', () => {
      this.paused = false
      cordova.plugins.notification.local.cancel(PLAYER_NOTIFICATION_ID)
    })
    window.addEventListener('beforeunload', () => {
      cordova.plugins.notification.local.cancel(PLAYER_NOTIFICATION_ID)
    })
    this.inited = true
  },

  onDocument (eventName, fn, ctx, ...args) {
    const _fn = ctx ? fn.bind(ctx, ...args) : fn
    document.addEventListener(eventName, _fn, false)
    return () => {
      document.removeEventListener(eventName, _fn)
    }
  },
  onNotification (eventName, fn, ctx, ...args) {
    cordova.plugins.notification.local.on(eventName, ctx ? fn.bind(ctx, ...args) : fn)
  },

  notify (opts) {
    cordova.plugins.notification.local.schedule(Object.assign({
      sound: null,
      icon: 'res://icon.png',
      at: new Date(Date.now() + 1000),
    }, opts))
  },

  isOnline () {
    var networkState = navigator.network.connection.type;
    _.log('Network state: ', networkState)
    if (networkState === Connection.CELL_2G || networkState === Connection.NONE)
      return false
    return true;
  },

  exit () {
    cordova.plugins.notification.local.cancel(PLAYER_NOTIFICATION_ID)
    window.navigator.app.exitApp()
  },

  back () {
    window.navigator.Backbutton.goBack(_.noop, () => console.error('Cannot go back'));
  },

  open (
    url,
    target = '_system',
    opts = 'location=no'
  ) {
    if (!url)
      return
    return cordova.InAppBrowser.open(url, target, opts)
  },

  backgroundMode (bool) {
    // cordova.plugins.backgroundMode[bool ? 'enable' : 'disable']()
  }
}

var deviceready = new Promise ((resolve, reject) => {
  _.addScript('cordova.js').then(() => {
    document.addEventListener('deviceready', () => {
      resolve(window.cordova)
    })
  })
})


Object.keys(_cordova).forEach((key) => {
  var fn = _cordova[key]
  if (typeof fn !== 'function')
    return
  _cordova[key] = function () {
    if (_cordova.inited)
      return fn.apply(_cordova, arguments)
    deviceready.then(() => fn.apply(_cordova, arguments))
  }
})

_cordova.init()

module.exports = _cordova