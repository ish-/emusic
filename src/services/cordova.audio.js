
import Shared from 'services/shared'
import VK from 'services/vk'
import _ from 'utils'

var lastAudio
var logMediaErrorGetPosition = _.bindLog('mediaError.getCurrentPosition')

module.exports = class CordovaAudio {

  static NEAR_END_TIME = 5
  // static IS_FIREFOX = (/firefox/i).test(window.navigator.userAgent)
  // static IS_SAFARI = (/safari/i).test(window.navigator.userAgent)
  // static FIREFOX_CANT_LOAD_TIMEOUT = 5000
  static CANPLAY_TIMEOUT = 9000

  constructor (info, autoplay, volume) {
    this.uid = _.getUID()

    this.seek = 0
    this.buffered = 0
    this.paused = true
    this.updated = false
    this.faded = false
    this.volume = volume != null ? volume : 1
    this.duration = -1

    this.info = {}
    this.info.added == null && (this.info.added = false)

    this._onTimeupdateTimer = null
    this._onTimeupdate = this._onTimeupdate.bind(this)
    this._lastTimeupdate = null
    // this._onError = this._onError.bind(this)
    // this._onCheck = this._onCheck.bind(this)
    this._onPlayPromised = this._onPlayPromised.bind(this)
    this._lastPlayTimeout = null
    this._lastPlayPromise = null
    // this.nearEnd = false
    
    this._audioState = 0

    if (info)
      this.setInfo(info, autoplay)
  }

  _buildCordovaMedia (autoplay) {
    this.dead = false

    lastAudio = this

    var audio = this._audio = new Media(
      this.info.url, 
      _.bindLog('mediaSuccess'),
      _.bindLog('mediaError'),
      (state) => {
        _.log('mediaState', state)
        this._audioState = state
      }
    )

    this.setVolume(this.volume)

    if (autoplay)
      this.play()
    

    // audio.onerror = this._onError
    // audio.preload = autoplay ? 'auto' : 'metadata'
    // audio.autoplay = autoplay
    // this.paused = !autoplay

    // this._audio.addEventListener('timeupdate', this._onTimeupdate)
    // this._cancelOnEnded = _.once(this._audio, 'ended', () => Shared.$emit('audio:ended', this))

  }

  // _onCheck () {
  //   if (this.seek !== 0)
  //     return
  //   Shared.isOnline().then(
  //     () => this._onError('init loading timeout'),
  //     () => this.updateInfo()
  //   )
  // }

  pause () {
    if (!this._audio)
      return
    this._audio.pause()
    this.timeUpdate = false
    this.paused = true
  }

  play () {
    this.paused = false
    if (this.dead)
      return
    this._audio.play()
    this.timeUpdate = true
    return this._onPlayPromised()
    // return new Promise (this._onPlayPromised)
  }

  set timeUpdate (bool) {
    if (bool) {
      if (this._onTimeupdateTimer)
        return
      var onInterval = () => this._audio.getCurrentPosition(this._onTimeupdate, logMediaErrorGetPosition)
      onInterval()
      this._onTimeupdateTimer = setInterval(onInterval, 1050)
    } else {
      clearInterval(this._onTimeupdateTimer)
      this._onTimeupdateTimer = false
    }
  }

  _onPlayPromised () {
    clearTimeout(this._lastPlayTimeout)
    return new Promise ((resolve, reject) => {
      this._onCanplay = () => {
        this._onCanplay = null
        resolve(this)
      }
      this._lastPlayTimeout = setTimeout(() => {
        this._onCanplay = null
        reject(this)
      }, CordovaAudio.CANPLAY_TIMEOUT)
    })
  }

  fade (destroy) {
    if (this.faded)
      return
    this.faded = true
    this.volumeSmoothly(0, (destroy ? this.destroy.bind(this) : null))
  }

  setVolume (v) {
    if (!this._audio)
      return
    this._audio.setVolume(v)
  }

  volumeSmoothly (value, cb) {
    const period = 60
    const _audio = this._audio
    const speed = 0.025
    var volume = this.volume
    var v = volume
    var factor = value - volume < 0 ? -1 : 1


    ;(function transition () {
      v += speed * factor
      if ((factor < 0 && v < value) || (factor > 0 && v > value)) {
        _audio.setVolume(value)
        cb && cb()
        return
      }
      _audio.setVolume(v)
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

  setInfo (info, autoplay) {
    if (!info.url)
      return this._onError('No url in info')

    Object.assign(this.info, info)
    this._buildCordovaMedia(autoplay)
    // this._audio.src = info.url

    // var _check = setTimeout(this._onCheck, CordovaAudio.CANPLAY_TIMEOUT)
    // _.once(this._audio, 'canplay', () => this.log('canplay'), clearTimeout(_check))
  }

  setCurrentTime (seek) {
    var duration = this.duration || this.info.duration
    if (this._audioState === Media.MEDIA_NONE || this.nearEnd)
      return this.play()

    this._audio.seekTo(seek * duration * 1000)
    this.seek = seek
    return this.play()
  }

  destroy () {
    this.log('destroy()')
    this.dead = true
    if (!this._audio)
      return
    this.pause()
    this._audio.stop()
    this.timeUpdate = false
    this._audio.release()
    this._audio = null
  }

  _onError (err) {
    this.log('error ::: ', e)
    if (err < 1 && err > 4)
      return
    if (!this.updated)
      return this.updateInfo(e)
    Shared.$emit('audio:error', this)
  }

  _onTimeupdate (currentTime) {
    var duration = this.duration === -1 ? this.duration = this._audio.getDuration() : this.info.duration

    if (currentTime < 0 || duration < 0)
      return

    if (!this._audio)
      return
    if (!this.nearEnd && currentTime + CordovaAudio.NEAR_END_TIME > duration) {
      this.nearEnd = true
      Shared.$emit('audio:ending', this)
    }
    if (currentTime > duration - CordovaAudio.NEAR_END_TIME)
      console.log(currentTime, duration)

    if (currentTime > duration - 1)
      setTimeout(() => Shared.$emit('audio:ended', this), 1000)

    if (this._onCanplay && this._lastTimeupdate !== currentTime)
      this._onCanplay()

    this._lastTimeupdate = currentTime

    this.seek = currentTime / duration
  }

  log (...args) {
    _.log(`CordovaAudio '${this}': ${args.join()}`)
  }

  toString () {
    return `(${this.info.id}) ${this.info.artist} - ${this.info.title}`
  }
}

// CordovaAudio.needInteract = false

// HACK FOR MOBILE BROWSERS
// var audioPool = []
// if (IS_MOBILE) {
//   window.addEventListener('focus', onUserEvent)
//   window.addEventListener('touchstart', onUserEvent)
// }

// function onUserEvent () {
//   if (lastAudio && !lastAudio.paused) {
//     lastAudio.needInteract = false
//     lastAudio.play()
//   }
//   fillAudioPool()
// }

// function fillAudioPool () {
//   while (audioPool.length < AUDIO_POOL_LENGTH) {
//     var audio = document.createElement('AUDIO')
//     audio.autoplay = true
//     audio.controls = true
//     audio.play()
//     audioPool.push(audio)
//   }
// }