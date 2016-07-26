<template lang="jade">

.c-player
  .c-player__btns
    button.o-btn.o-btn-escape(@click="$dispatch('group:select', null)")
      object: include ../assets/crest.svg
    button.o-btn.o-btn-like.o-clickable(@click="addAudio()", :class="{'is-liked': player.audio.info.added}")
      object: include ../assets/like.svg
    button.o-btn.o-btn-playlist(@click="$dispatch('playlist:show', true)")
      object: include ../assets/playlist.svg
    button.o-btn.o-btn-post(@click="openPost()")
      object: include ../assets/post.svg
  .c-player__playback
    player-volume.o-btn
    .o-btn.o-btn-direction.o-btn-direction--backward.o-clickable(@click="player.playPrev()", :style="{opacity: player.playlist.length > 1 ? 1 : 0}")
      object: include ../assets/play-direction.svg
    //- .u-relative.u-iblock
    button.o-btn.o-btn-play.o-clickable(@click="player.togglePlay()", :class="{'is-loading': player.loading}")
      .o-btn-play__icon-play(v-show="!isPlaying", transition="opacity-scale")
      .o-btn-play__icon-pause(v-show="isPlaying", transition="opacity-scale")
    .o-btn.o-btn-direction.o-btn-direction--forward.o-clickable(@click="player.playNext()")
      object: include ../assets/play-direction.svg
  .c-player__info
    .c-player__artist.u-user-select {{player.audio.info.artist}}
    .c-player__title.u-user-select
      span.c-player__duration ({{player.audio.info.duration | audioDuration}})
      | {{player.audio.info.title}}
    player-seek(:audio="player.audio", @seek="setCurrentTime")

</template>
<script>
import 'styles/player.styl'
import VK from 'services/vk'
import player from 'services/player'
import Shared from 'services/shared'
import _ from 'utils'
import 'filters/one-to-percent'

import PlayerSeek from 'components/PlayerSeek.vue'
import PlayerVolume from 'components/PlayerVolume.vue'
import Slider from 'components/Slider.vue'

export default {
  name: 'Player',

  components: { PlayerSeek, Slider, PlayerVolume },

  data () {
    return {
      player
    }
  },

  methods: {
    openPost () {
      const url = 'https://new.vk.com/wall' + player.audio.info.postId
      Shared.openWindow(url)
    },
    addAudio () {
      if (this.player.audio.info.added)
        return
      this.player.audio.info.added = true
      VK.Audio.add(player.audio.info)
    },
    setCurrentTime (seek) {
      player.setCurrentTime(seek)
    },
    setVolume (v) {
      player.setVolume(v)
    }
  },

  computed: {
    isPlaying () {
      return this.player.audio && !this.player.audio.paused
    },
  },
}

</script>