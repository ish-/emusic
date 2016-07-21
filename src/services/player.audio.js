// TODO: pause and play smoothy
// TODO: get like from users's playlist

import Shared from 'services/shared'
import VK from 'services/vk'
import _ from 'utils'

const ERROR_IS_DEAD = 'PlayerAudio is already dead'

export default class PlayerAudio {

  constructor (info) {
    this.seek = 0
    this.volume = 1
    this.buffered = 0
    this.paused = true


    this.info = info || {}
    this.info.added == null && (this.info.added = false)

    if (!info)
      return

    this._onProgress = this._onProgress.bind(this)
    this._onTimeupdate = this._onTimeupdate.bind(this)
    this._onError = this._onError.bind(this)

    this._buildHtmlAudio()
  }

  _buildHtmlAudio () {
    this.dead = false

    var audio = document.createElement('AUDIO')
    this._htmlAudio = audio
    // audio.volume = this._volume = .1 // be quiet
    audio.src = this.info.url
    audio.onerror = this._onError
    audio.preload = 'metadata'
    
    this.canplaythrough = new Promise((resolve, reject) => {
      _.once(audio, 'canplaythrough', () => {
        if (this.dead)
          return reject(ERROR_IS_DEAD)
        this.seek = 1e-10
        audio.addEventListener('progress', this._onProgress)
        audio.addEventListener('timeupdate', this._onTimeupdate)
        resolve()
      })
    })
  }

  _deferCanPlayOnce (fn) {
    return new Promise((resolve, reject) => {
      _.once(this._htmlAudio, 'canplaythrough', () => {
        if (this.dead)
          return reject(ERROR_IS_DEAD)
        resolve()
      })
    })
  }

  pause () {
    if (!this._htmlAudio)
      return
    this._htmlAudio.pause()
    this.paused = true
  }

  play () {
    return this.canplaythrough.then(() => {
      if (this.dead)
        throw new Error (ERROR_IS_DEAD)
      setTimeout(() => {
        this._htmlAudio.play()
      }, 5)
      this.paused = false
      return true
    })
  }

  updateInfo(e) {
    if (this.updated)
      return this._onError(e)
    return VK.Audio.getById([this.info]).then(([info]) => {
      this.destroy()
      console.log('PlayAudio update', this.toString())
      this.updated = true
      Object.assign(this.info, info)
      this._buildHtmlAudio()
      return this
    })
  }

  setCurrentTime (seek) {
    if (this.nearEnd)
      return

    this.pause()
    this._htmlAudio.currentTime = seek * this._htmlAudio.duration
    this.canplaythrough = this._deferCanPlayOnce()
    return this.play()
  }

  destroy () {
    this.dead = true
    if (!this._htmlAudio)
      return
    this.pause()
    this._htmlAudio.removeEventListener('progress', this._onProgress)
    this._htmlAudio.removeEventListener('timeupdate', this._onTimeupdate)
    this._htmlAudio.onerror = null
    this._htmlAudio.src = ''
    this._htmlAudio = null
  }

  _onError (e) {
    // if (!this.update)
    //   this.updateUrl(e).then(this.play.bind(this))
    console.error('PlayerAudio error!', e)
    throw new Error(e)
  }

  _onProgress () {
    var bufIndex = this._htmlAudio.buffered.length - 1
    var buffered = this._htmlAudio.buffered.end(bufIndex) / this._htmlAudio.duration
    this.buffered = buffered
  }

  _onTimeupdate () {
    const {currentTime, duration} = this._htmlAudio
    if (!this._htmlAudio)
      return
    if (!this.nearEnd && currentTime + 5 > duration) {
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
