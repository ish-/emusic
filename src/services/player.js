import VK from './vk'
import PlayerAudio from './player.audio'
import Shared from 'services/shared'

var nextAudio

var p = Object.create({

  playGroup (group) {
    if (group && this.group !== group) {
      this.group = group
      VK.Storage.set('group', group)
      if (nextAudio)
        nextAudio.destroy
    } else if (nextAudio) 
      return

    if (!this.group)
      throw new Error('Player error: no selected group')

    return this._wrapLoading(VK.Group.getRandomPostAudio(this.group).then((audio) => {
      if (this.audio)
        this.audio.destroy()
      this.setAudio(audio)
      VK.Storage.set('audio', this.audio.info)
      return this.play()
    }))
  },

  playNext () {
    this.playGroup()
  },

  playPrev () {
    const i = this.playlist.indexOf(this.audio.info)
    return this.playFromPlaylist(i + 1)
  },

  playFromPlaylist (i) {
    if (i < 0 || i >= this.playlist.length)
      return
    const audio = this.playlist[i]
    this.audio.destroy()
    this.audio = new PlayerAudio(audio)
    return this.play()
  },

  playGroupSequence (audio) {
    VK.Group.getRandomPostAudio(this.group).then((audio) => {
      nextAudio = new PlayerAudio(audio)
      nextAudio.play()
      Shared.$once('audio:end', (curAudio) => {
        this.setAudio(nextAudio)
        VK.Storage.set('audio', this.audio.info)
        nextAudio = null
      })
    })
  },

  setAudio (audio) {
    this.audio = (audio instanceof PlayerAudio) ? audio : new PlayerAudio(audio)
    this.audio.info.group = this.group
    this.playlist.unshift(this.audio.info)
  },

  togglePlay () {
    this.audio.paused ? this.audio.play() : this.audio.pause()
  },

  play () {
    return this._wrapLoading(this.audio.play())
  },

  stop () {
    if (nextAudio)
      nextAudio.pause()
    return this.audio.pause()
  },

  setCurrentTime (seek) {
    return this._wrapLoading(this.audio.setCurrentTime(seek))
  },

  _wrapLoading (promise) {
    this.loading = true
    return promise.then(() => this.loading = false)
  }
})

Shared.$on('audio:near-end', p.playGroupSequence.bind(p))

Object.assign(p, {
  audio: null,
  group: null,
  playlist: [],
  loading: false,
})

window.player = p

export default p
