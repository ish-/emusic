<template lang="jade">

.c-player
  .c-player__btns
    button.o-btn.o-btn-escape(@click="$dispatch('group:select', null)")
      object: include ../assets/crest.svg
    button.o-btn.o-btn-like.o-clickable(@click="addAudio()", :class="{'is-liked': player.audio.info.added}")
      object: include ../assets/like.svg
    button.o-btn.o-btn-playlist(@click="$dispatch('playlist:show', true)")
      object: include ../assets/playlist.svg
    a.o-btn.o-btn-post(target="_blank", href="//new.vk.com/wall{{ player.audio.info.postId }}")
      object: include ../assets/post.svg
  .c-player__playback
    .o-btn.o-btn-direction.o-btn-direction--backward.o-clickable(@click="player.playPrev()", :style="{opacity: player.playlist.length > 1 ? 1 : 0}")
      object: include ../assets/play-direction.svg
    //- .u-relative.u-iblock
    button.o-btn.o-btn-play.o-clickable(@click="player.togglePlay()", :disabled="player.loading")
      .o-btn-play__icon-play(v-show="!isPlaying", transition="opacity-scale")
      .o-btn-play__icon-pause(v-show="isPlaying", transition="opacity-scale")
    .o-btn.o-btn-direction.o-btn-direction--forward.o-clickable(@click="player.playNext()")
      object: include ../assets/play-direction.svg
  .c-player__info
    .c-player__artist.u-user-select {{player.audio.info.artist}}
    .c-player__title.u-user-select {{player.audio.info.title}}
      span.c-player__duration ({{player.audio.info.duration | audioDuration}})
    .c-player-seek(v-el:seek='', @mouseup='seekOnClick', @mouseout='seekOnMouseOut', @mousedown='seekOnMouseDown', @mousemove='seekOnMouseMove')
      .c-player-seek__progress(:style="{width: player.audio.seek*100 + '%'}")
      //- .c-player-seek__progress(:style="{transform: 'translateX(-'+(100 - player.audio.seek*100) + '%)'}")
      //- .c-player-seek__loaded(:style="{transform: 'translateX(-'+(100 - (player.audio.buffered*100) + '%)')}")

</template>
<script>
import 'styles/player.styl'
import VK from 'services/vk'
import player from 'services/player'

var seekMouseDown

export default {
  name: 'Player',

  data () {
    return {
      player,
    }
  },

  methods: {
    addAudio () {
      if (this.player.audio.info.added)
        return
      this.player.audio.info.added = true
      VK.Audio.add(player.audio.info)
    },

    seekOnMouseDown (e) {
      seekMouseDown = true
      this.seekOnMouseMove(e)
    },
    seekOnMouseOut (e) {
      seekMouseDown && this.seekOnMouseMove(e)
      seekMouseDown = false
    },
    seekOnClick (e) {
      seekMouseDown = false
    },
    seekOnMouseMove (e) {
      if (!seekMouseDown)
        return

      var w = this.$els.seek.offsetWidth
      var seek = (e.offsetX) / w
      player.setCurrentTime(seek)
    },
  },

  computed: {
    isPlaying () {
      return this.player.audio && !this.player.audio.paused
    },
  },
}

</script>