// TODO: pause and play smoothy
// TODO: get like from users's playlist

import Shared from 'services/shared'
import VK from 'services/vk'
import _ from 'utils'

const ERROR_IS_DEAD = 'PlayerAudio is already dead'
const IS_MOBILE = window.hasOwnProperty('onorientationchange') && !IS_CORDOVA
const AUDIO_POOL_LENGTH = 10

var lastAudio

class PlayerAudio {

  static NEAR_END_TIME = 3
  static IS_FIREFOX = !IS_CORDOVA && (/firefox/i).test(window.navigator.userAgent)
  static IS_SAFARI = !IS_CORDOVA && (/safari/i).test(window.navigator.userAgent)
  static FIREFOX_CANT_LOAD_TIMEOUT = 5000
  static CANPLAY_TIMEOUT = 8000

  constructor (info, autoplay, volume = 1) {
    this.seek = 0
    this.buffered = 0
    this.paused = true
    this.updated = false
    this.faded = false
    this.uid = _.getUID()

    this.info = {added: false}

    this._onTimeupdate = this._onTimeupdate.bind(this)
    this._lastTimeupdate = 0
    this._onError = this._onError.bind(this)
    this._onCheck = this._onCheck.bind(this)
    this._onPlayPromised = this._onPlayPromised.bind(this)
    this.nearEnd = false

    this._buildHtmlAudio(autoplay, volume)
    if (info)
      this.setInfo(info)
  }

  _buildHtmlAudio (autoplay, volume) {
    this.dead = false

    lastAudio = this

    var audio
    if (IS_MOBILE && !audioPool.length && autoplay)
      this.needInteract = true
    if (IS_MOBILE && audioPool.length)
      audio = audioPool.pop() 
    else
      audio = document.createElement('AUDIO')
    this._htmlAudio = audio

    audio.onerror = this._onError
    // audio.preload = autoplay ? 'auto' : 'metadata'
    audio.autoplay = autoplay
    audio.volume = volume
    this.paused = !autoplay

    this._htmlAudio.addEventListener('timeupdate', this._onTimeupdate)
    this._cancelOnEnded = _.once(this._htmlAudio, 'ended', () => {
      Shared.$emit('audio:ended', this)
    })

  }

  _onCheck () {
    if (this.seek !== 0)
      return
    Shared.isOnline().then(
      () => this.updateInfo(),
      () => this._onError('init loading timeout')
    )
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
      return Promise.reject()
    if (this.needInteract)
      Shared.show.modalInteract = true
    return new Promise (this._onPlayPromised)
  }

  _onPlayPromised (resolve, reject) {
    _.once(this._htmlAudio, 'timeupdate', () => {resolve(this)})
    _.once(this._htmlAudio, 'canplay', () => {resolve(this)})
    setTimeout(() => {reject(this)}, PlayerAudio.CANPLAY_TIMEOUT)
    this._htmlAudio.play()
  }

  fade (destroy) {
    if (this.faded)
      return
    this.faded = true
    this.volumeSmoothly(0, (destroy ? this.destroy.bind(this) : null))
  }

  setVolume (v) {
    if (!this._htmlAudio)
      return
    this._htmlAudio.volume = v
  }

  volumeSmoothly (value, cb) {
    if (value == null)
      return this._htmlAudio.volume
    const period = 60
    const _htmlAudio = this._htmlAudio
    const speed = 0.025
    var volume = _htmlAudio.volume
    var v = volume
    var factor = value - volume < 0 ? -1 : 1


    ;(function transition () {
      v += speed * factor
      if ((factor < 0 && v < value) || (factor > 0 && v > value)) {
        _htmlAudio.volume = value
        cb && cb()
        return
      }
      _htmlAudio.volume = v
      setTimeout(transition, period)
    })()
  }

  updateInfo(e) {
    if (!this.info.id)
      return
    return VK.Audio.getById([this.info]).then(([info]) => {
      this.updated = true
      this.setInfo(info)

      if (!this.paused)
        this.play()
    })
  }

  setInfo (info) {
    if (!info.url)
      return this._onError('No url in info')

    Object.assign(this.info, info)
    this._htmlAudio.src = info.url

    var _check = setTimeout(this._onCheck, PlayerAudio.CANPLAY_TIMEOUT)
    _.once(this._htmlAudio, 'canplay', () => {this.log('canplay'); clearTimeout(_check)})
  }

  setCurrentTime (seek) {
    if (!this._htmlAudio.duration || this.nearEnd)
      return Promise.reject()

    this._htmlAudio.currentTime = seek * this._htmlAudio.duration
    return this.play()
  }

  destroy () {
    this.log('destroy()')
    this.dead = true
    if (!this._htmlAudio)
      return
    this.pause()
    setTimeout(() => {
      this._htmlAudio.removeEventListener('timeupdate', this._onTimeupdate)
      this._cancelOnEnded()
      this._htmlAudio.onerror = null
      this._htmlAudio.src = ''
      this._htmlAudio = null
    }, 10)
  }

  _onError (e) {
    this.log('error ::: ', e, JSON.stringify(this))
    if (!this.updated)
      return this.updateInfo(e)
    Shared.$emit('audio:error', this)
  }

  _onTimeupdate () {
    const {currentTime, duration} = this._htmlAudio

    if (!this._htmlAudio)
      return
    if (!this.nearEnd && currentTime + PlayerAudio.NEAR_END_TIME > duration) {
      this.nearEnd = true
      Shared.$emit('audio:ending', this)
    }

    var seek = this._htmlAudio.currentTime / this._htmlAudio.duration
    this.seek = seek
  }

  log (...args) {
    _.log(`PlayerAudio '${this}': ${args.join()}`)
  }

  toString () {
    return `(${this.info.id}) ${this.info.artist} - ${this.info.title}`
  }
}

PlayerAudio.needInteract = false

module.exports = PlayerAudio

// HACK FOR MOBILE BROWSERS
var audioPool = []
if (IS_MOBILE) {
  window.addEventListener('focus', onUserEvent)
  window.addEventListener('touchstart', onUserEvent)
}

function onUserEvent () {
  if (lastAudio && !lastAudio.paused) {
    lastAudio.needInteract = false
    lastAudio.play()
  }
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