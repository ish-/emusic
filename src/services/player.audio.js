// TODO: on set current time return correct oncanplay promise
// TODO: pause and play smoothy

import Shared from 'services/shared'
import VK from 'services/vk'
import _ from 'utils'

export default class PlayerAudio {

  constructor (info) {
    this.seek = 0
    this.volume = 1
    this.buffered = 0
    this.paused = true
    this.added = false

    this.info = info || {}

    if (!info)
      return

    this._onProgress = this._onProgress.bind(this)
    this._onTimeupdate = this._onTimeupdate.bind(this)
    this._onError = this._onError.bind(this)

    this._buildHtmlAudio()
  }

  _buildHtmlAudio () {
    this.dead = false

    this._htmlAudio = document.createElement('AUDIO')
    // audio.volume = this._volume = .1 // be quiet
    this._htmlAudio.src = this.info.url
    this._htmlAudio.onerror = this._onError
    
    this.canplaythrough = new Promise((resolve, reject) => {
      _.once(this._htmlAudio, 'canplaythrough', () => {
        if (this.dead)
          return reject()
        this._htmlAudio.addEventListener('progress', this._onProgress)
        this._htmlAudio.addEventListener('timeupdate', this._onTimeupdate)
        resolve()
      })
    })
  }

  _deferCanPlayOnce (fn) {
    return new Promise((resolve, reject) => {
      _.once(this._htmlAudio, 'canplaythrough', () => {
        if (this.dead)
          return reject()
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
        return Promise.reject('PlayerAudio is already dead')
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
