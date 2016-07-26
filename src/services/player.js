import VK from 'services/vk'
import PlayerAudio from 'services/player.audio'
import Shared from 'services/shared'
import groups from 'services/vk.groups'

var nextAudio

var p = Object.create({

  playGroup (nextTrack, dontStart) {
    if (!nextTrack || nextAudio) {
      if (Shared.group.id !== this.group.id) {
        this.group = Shared.group
        if (nextAudio)
          nextAudio.destroy()
      } else
        return
    }

    if (!Shared.group)
      throw new Error('Player error: no selected group')

    var preAudio = new PlayerAudio (null, !dontStart)

    return this._wrapLoading(VK.Group.getRandomPostAudio(Shared.group).then((audioInfo) => {
      if (this.audio)
        this.audio.destroy()

      preAudio.setInfo(audioInfo)
      this.setAudio(preAudio)
      if (dontStart)
        return
      return this.play()
    }))
  },

  playNext () {
    this.playGroup(true)
  },

  playPrev () {
    const i = this.playlist.indexOf(this.audio.info)
    return this.playFromPlaylist(i + 1)
  },

  playFromPlaylist (i) {
    if (i < 0 || i >= this.playlist.length)
      return
    if (nextAudio)
      nextAudio.destroy()
    const audio = this.playlist[i]
    this.audio.destroy()
    this.audio = new PlayerAudio(audio)
    return this.play()
  },

  playGroupSequence (audio) {
    nextAudio = new PlayerAudio(null, true)
    VK.Group.getRandomPostAudio(Shared.group).then((audioInfo) => {
      nextAudio.setInfo(audioInfo)
      nextAudio.play()
      Shared.$once('audio:end', (curAudio) => {
        this.setAudio(nextAudio)
        nextAudio = null
      })
    })
  },

  setAudio (audio) {
    this.audio = (audio instanceof PlayerAudio) ? audio : new PlayerAudio(audio)

    if (!this.audio.info.group && Shared.group)
      this.audio.info.group = Shared.group

    if (!~this.playlist.indexOf(audio)) {
      this.playlist.unshift(this.audio.info)

      VK.Storage.set('playlist', this.playlist.slice(0, 20).map((audio) => {
        const {owner_id, id, group, postId} = audio
        if (!group)
          console.log(audio)
        return [owner_id, id, group.id, postId]
      }))
    }
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
    return promise.then(_setNoLoading, _setNoLoading)
  },
})

function _setNoLoading () {
  p.loading = false
}

VK.inited.then(() => {
  VK.Storage.get('playlist').then(({playlist}) => {
    if (playlist && playlist.length) {
      playlist = playlist.map((audio) => {
        var [owner_id, id, groupId, postId] = audio
        return {owner_id, id, group: groups.find('id', groupId), postId}
      })
      VK.Audio.getById(playlist).then((playlist) => {
        p.playlist = playlist
        if (!playlist.length)
          return
        p.setAudio(playlist[0])
        p.group = Shared.group = playlist[0].group
      })
    }
  }, (e) => {
    console.error('Cannot load data from storage', e)
  })
})

Shared.$on('audio:near-end', p.playGroupSequence.bind(p))

var playNextOnErrorTimeout
var playNextOnErrorTimes = 0

Shared.$on('audio:error', (audio) => {
  if ((playNextOnErrorTimeout && playNextOnErrorTimes > 3) || p.audio !== audio) {
    playNextOnErrorTimes = 0
    return
  }

  playNextOnErrorTimes++
  clearTimeout(playNextOnErrorTimeout)
  playNextOnErrorTimeout = setTimeout(() => {
    playNextOnErrorTimeout = null
  }, PlayerAudio.FIREFOX_CANT_LOAD_TIMEOUT*2)

  p.playGroup(true, audio.paused)
})

Object.assign(p, {
  audio: null,
  group: {},
  playlist: [],
  loading: false,
})

window.player = p

export default p
