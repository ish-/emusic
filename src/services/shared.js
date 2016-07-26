import _ from 'utils'
import Ping from 'services/ping'

if (IS_CORDOVA)
  var cordova = module.exports.cordova = require('services/cordova')

const EMUSIC_DOCUMENT_TITLE = 'E:\\music\\'
const CORDOVA_PAUSED_TIMEOUT = 1 * 30 * 1000

// Ping.TEST_THREE_ITERATIONS = true
// var ping = new Ping ('https://emusic.dearwhoever.space/', 'ping')

var Shared = new Vue({
  data: {
    group: null,
    playerAudio: false,
    online: true,
    modals: [],
    appPaused: false,
    groupsSearch: '',
    show: {
      modalInteract: false,
    },
    route: {
      name: 'group-list'
    }
  },

  watch: {
    group (group) {
      document.title = group
        ? (group.foreign ? '' : EMUSIC_DOCUMENT_TITLE) + group.name
        : EMUSIC_DOCUMENT_TITLE
    },
    playerAudio (info) {
      if (IS_CORDOVA && cordova.paused)
        this.playerNotify(this.group, info, true)
    },
    online (state) {
      var stateStr = state ? 'online' : 'offline'
      _.log('Youre ' + stateStr)
      document.documentElement.classList.add(`is-${stateStr}`)
      this.$emit(`nextwork:${stateStr}`)
    }
  },

  methods: {
    openWindow (url, target, opts) {
      if (!IS_CORDOVA)
        return window.open(url, target, target || 'location=no', opts)
      return cordova.open(url, target, opts)
    },
    isOnline (wait) {
      // var _ping = ping.send(wait)
      // _ping.then(() => this.online = true)
      //   .catch(() => this.online = false)
      return Promise.all([this.deviceOnline, new Promise((resolve, reject) => {
        Ping.subscribe((state) => state && resolve())
      })])
    },
    playerNotify (group, audioInfo) {
      const title = group 
        ? group.foreign 
          ? group.name
          : EMUSIC_DOCUMENT_TITLE + (group ? group.name : '')
        : EMUSIC_DOCUMENT_TITLE
      const text = audioInfo ? `${audioInfo.artist} - ${audioInfo.title}` : 'PAUSED: swipe to exit'
      cordova.notify({
        id: cordova.PLAYER_NOTIFICATION_ID,
        text, title
      })
    },
  },

  created () {
    this.deviceOnline = Promise.resolve()
    this.IS_CORDOVA = IS_CORDOVA
    if (IS_CORDOVA) {
      this.cordova = cordova
      
      cordova.onDocument('offline', () => {
        this.online = false
        this.deviceOnline = new Promise ((resolve, reject) => {
          var unlisten = cordova.onDocument('online', () => {
            var online = this.online = cordova.isOnline()
            _.log('Cordova device is ' + (online ? 'online' : 'offline'))
            if (online) {
              Ping.subscribe((state) => {
                if (state)
                  resolve()
              })
            }
            else
              reject()
            unlisten()
          })
        })
      })

      var cordovaPauseTimeout
      var setPauseTimeout = () => {
        cordovaPauseTimeout = setTimeout(() => {
          if (cordova.paused && !Shared.playerAudio)
            cordova.exit()
        }, CORDOVA_PAUSED_TIMEOUT)
      }
      cordova.onDocument('backbutton', () => {
        cordova.back()
      })
      cordova.onDocument('pause', () => {
        this.appPaused = true
        this.playerNotify(this.group, this.playerAudio)
        setPauseTimeout()
      })
      cordova.onDocument('resume', () => {
        this.appPaused = false
        setTimeout(() => cordova.backgroundMode(false), 500)
        
        clearTimeout(cordovaPauseTimeout)
      })

      cordova.onNotification('click', this.$emit.bind(this, 'notification:click'))
      cordova.onNotification('clear', () => {
        this.$emit('notification:clear')
        setPauseTimeout()
      })
    }
  }
})


window._shared = Shared

export default Shared
