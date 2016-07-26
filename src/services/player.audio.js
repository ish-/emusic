// TODO: pause and play smoothy
// TODO: get like from users's playlist

import Shared from 'services/shared'
import VK from 'services/vk'
import _ from 'utils'

const ERROR_IS_DEAD = 'PlayerAudio is already dead'
const IS_MOBILE = window.hasOwnProperty('onorientationchange') && !window.hasOwnProperty('IS_CORDOVA')
const AUDIO_POOL_LENGTH = 8

var lastAudio

var audioPool = []
if (IS_MOBILE) {
  window.addEventListener('focus', onUserEvent)
  window.addEventListener('touchstart', onUserEvent)
}

function onUserEvent () {
  if (lastAudio && !lastAudio.paused)
    lastAudio.play()
  fillAudioPool()
}

function fillAudioPool () {
  while (audioPool.length < AUDIO_POOL_LENGTH) {
    var audio = document.createElement('AUDIO')
    audio.autoplay = true
    audio.controls = true
    audio.play()
    audioPool.push(audio)
  }
}

export default class PlayerAudio {

  static NEAR_END_TIME = 5
  static IS_FIREFOX = (/firefox/i).test(window.navigator.userAgent)
  static FIREFOX_CANT_LOAD_TIMEOUT = 5000

  constructor (info, autoplay) {
    this.seek = 0
    this.volume = 1
    this.buffered = 0
    this.paused = true

    this.info = info || {}
    this.info.added == null && (this.info.added = false)

    this._onTimeupdate = this._onTimeupdate.bind(this)
    this._onError = this._onError.bind(this)

    this._buildHtmlAudio(autoplay)
  }

  _buildHtmlAudio (autoplay) {
    this.dead = false

    lastAudio = this

    var audio
    if (IS_MOBILE && audioPool.length)
      audio = audioPool.pop()
    else
      audio = document.createElement('AUDIO')
    this._htmlAudio = audio

    audio.onerror = this._onError

    if (this.info.url)
      audio.src = this.info.url

    if (audio.src)
      this._setCanplaythrough()
  }

  _setCanplaythrough () {
    this.canplaythrough = new Promise((resolve, reject) => {
      if (PlayerAudio.IS_FIREFOX) {
        setTimeout(() => {
          if (this.seek !== 0)
            return
          this._onError('FIREFOX_BUG')
          reject()
        }, PlayerAudio.FIREFOX_CANT_LOAD_TIMEOUT)
      }
      _.once(this._htmlAudio, 'canplaythrough', () => {
        if (this.dead)
          return reject(ERROR_IS_DEAD)
        this.seek = 1e-10
        this._htmlAudio.addEventListener('timeupdate', this._onTimeupdate)
        resolve()
      })
    })
  }

  _deferCanPlayOnce (fn) {
    var defer = _.defer()
    this._timeupdate = defer
    this._timeupdateResolved = false
    return defer.promise.then(() => {
      this._timeupdateResolved = true
    })
  }

  pause () {
    if (!this._htmlAudio)
      return
    this._htmlAudio.pause()
    this.paused = true
  }

  play () {
    this.paused = false
    if (this.dead)
      throw new Error (ERROR_IS_DEAD)
    return Promise.all([this.canplaythrough, this._htmlAudio.play()])
  }

  updateInfo(e) {
    if (!this.info.id)
      return
    return VK.Audio.getById([this.info]).then(([info]) => {
      this.updated = true
      this.setInfo(info)

      if (!this.paused)
        return this.play()
      return this
    })
  }

  setInfo (info) {
    if (!this.info.id)
      this._setCanplaythrough()
    Object.assign(this.info, info)
    this._htmlAudio.src = info.url
  }

  setCurrentTime (seek) {
    if (this.nearEnd)
      return

    this._htmlAudio.currentTime = seek * this._htmlAudio.duration
    this.canplaythrough = this._deferCanPlayOnce()
    return this.play()
  }

  destroy () {
    this.dead = true
    if (!this._htmlAudio)
      return
    this.pause()

    if (!this._htmlAudio)
      return
    this._htmlAudio.removeEventListener('timeupdate', this._onTimeupdate)
    this._htmlAudio.onerror = null
    this._htmlAudio.src = ''
    this._htmlAudio = null
  }

  _onError (e) {
    console.log('err', e, JSON.stringify(this))
    if (!this.updated)
      return this.updateInfo(e)
    Shared.$emit('audio:error', this)
    console.error('PlayerAudio error!', e)
    throw new Error(e)
  }

  _onTimeupdate () {
    const {currentTime, duration} = this._htmlAudio
    if (!this._timeupdateResolved && this._timeupdate)
      this._timeupdate.resolve()

    if (!this._htmlAudio)
      return
    if (!this.nearEnd && currentTime + PlayerAudio.NEAR_END_TIME > duration) {
      this.nearEnd = true
      Shared.$emit('audio:near-end', this)
    }

    if (currentTime === duration) {
      if (!this.dead)
        Shared.$emit('audio:end', this)
      return this.destroy()
    }
    var seek = this._htmlAudio.currentTime / this._htmlAudio.duration
    this.seek = seek
  }

  toString () {
    return `${this.info.artist} - ${this.info.title}`
  }
}
