import VK from 'services/vk'
import PlayerAudio from 'services/player.audio'
import CordovaAudio from 'services/cordova.audio'
import Shared from 'services/shared'
import groups from 'services/vk.groups'
import _ from 'utils'

// var PlayerAudio = IS_CORDOVA ? require('services/cordova.audio') : require('services/player.audio')

var nextAudio

var p = Object.create({

  _playGroupIter: 0,
  _playGroupErrorIter: 0,
  playGroup: _.throttle(function (nextTrack, dontStart) {
    if (!nextTrack || nextAudio) {
      if (Shared.group.id !== p.group.id) {
        p.group = Shared.group
        if (nextAudio)
          nextAudio.destroy()
      } else
        return
    }

    if (!Shared.group)
      throw new Error('Player error: no selected group')

    _.log(`Player.playGroup: (${p.group.id}) ${p.group.name}`)

    var _playGroupIter = ++p._playGroupIter
    p._playGroupErrorIter = 0
    var req = VK.Group.getRandomPostAudio(Shared.group).then((audioInfo) => {
      if (p.audio)
        _.log('Player.playGroup: ' + p.audio.toString())
      if (p.audio)
        p.audio.fade(true)
      if (_playGroupIter !== p._playGroupIter)
        return


      var audio = new PlayerAudio (audioInfo, !dontStart, this.volume)
      p.setAudio(audio)

      return p.play()
        .then(() => p._playGroupErrorIter = 0)
    })
    return p._wrapLoading(req).catch(p._onPlayGroupError)
  }, 2000),

  _onPlayGroupError: (e) => {
    console.error('Player.playGroup() error: ', e)
    if (this._playGroupErrorIter > 2)
    this._playGroupErrorIter++
    return playGroup(nextTrack, dontStart)
  },

  playNext () {
    this.playGroup(true)
  },

  playPrev () {
    const i = _.findIndex(this.playlist, {id: this.audio.info.id})
    if (i == null)
      return
    return this.playFromPlaylist(this.playlist[i + 1])
  },

  playFromPlaylist (audio) {
    if (nextAudio)
      nextAudio.destroy()
    this.group = Shared.group = audio.group
    this.audio.destroy()
    this.audio = new PlayerAudio(audio, false, this.volume)
    return this.play()
  },

  playGroupSequence (audio) {
    VK.Group.getRandomPostAudio(Shared.group || this.group).then((audioInfo) => {
      var audio
      if (Shared.appPaused)
        audio = new CordovaAudio(audioInfo, false, this.volume)
      else
        audio = new PlayerAudio(audioInfo, true, this.volume)
      // audio.setInfo(audioInfo)
      // if (IS_CORDOVA && !Shared.appPaused)
      //    audio.play()
      Shared.$once('audio:ended', (curAudio) => {
        this.setAudio(audio)
        curAudio.destroy()
        this.play()
      })
    })
  },

  setVolume (v) {
    if (v > 1) v = 1
    if (v < 0) v = 0
    if (this.volume === v)
      return
    this.volume = v
    this.audio.setVolume(v)
    return v
  },

  setAudio (audio) {
    this.audio = audio

    if (!this.audio.info.group && Shared.group)
      this.audio.info.group = Shared.group

    if (!~this.playlist.indexOf(audio)) {
      this.playlist.unshift(this.audio.info)

      VK.Storage.set('playlist', this.playlist.slice(0, 20).map((audio) => {
        const {owner_id, id, group, postId} = audio
        // if (!group)
        //   console.log(audio)
        return [owner_id, id, group.id, postId]
      }))
    }
  },

  togglePlay () {
    this.audio.paused ? this.play() : this.stop()
  },

  play (audio = this.audio) {
    Shared.playerAudio = audio.info
    audio.setVolume(this.volume)
    return this._wrapLoading(audio.play())
  },

  stop () {
    if (nextAudio)
      nextAudio.pause()
    Shared.playerAudio = false
    return this.audio.pause()
  },

  setCurrentTime (seek) {
    if (!seek)
      return this.play()
    return this._wrapLoading(this.audio.setCurrentTime(seek))
  },

  _wrapLoading (promise) {
    this.loading = true
    if (promise instanceof Promise)
      return promise.then(_setNoLoading, _setNoLoading)
    return false
  },
})

function _setNoLoading (audio) {
  if (p.audio.uid === audio.uid)
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
        if (IS_CORDOVA)
          Shared.cordova.ready(() => {
            p.setAudio(new PlayerAudio(playlist[0]))
          })
        else
          p.setAudio(new PlayerAudio(playlist[0]))
        p.group = Shared.group = playlist[0].group
      })
    }
  }, (e) => {
    console.error('Cannot load data from storage', e)
  })
}, () => console.error('Cannot load player playlist'))

Shared.$on('audio:waiting', (state) => this.loading = state)
Shared.$on('audio:ending', p.playGroupSequence.bind(p))

// Shared.$on('notification:click', () => p.playGroup(true))
Shared.$on('notification:clear', () => p.stop())

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
  if (nextAudio)
    nextAudio.destroy()
  p.playGroup(true, audio.paused)
})

Object.assign(p, {
  volume: 1,
  audio: null,
  group: {},
  playlist: [],
  loading: false,
})

window.player = p

export default p
