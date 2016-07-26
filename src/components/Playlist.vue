<template lang="jade">

.c-playlist
  .c-playlist__btns
    header.c-playlist__header History
    button.o-btn.o-btn-escape(@click="close()")
      include ../assets/crest.svg
  ul.c-audio-list
    li.c-audio.u-relative(v-for="(i, audio) in player.playlist", @click="playAudio(audio)")
      span.c-audio__group(@click.stop="playGroup(audio.group)") [{{* audio.group.name }}]
      span.c-audio__artist {{* audio.artist}}
      span.c-audio__title {{* audio.title}}


</template>

<script>

import Shared from 'services/shared'
import player from 'services/player'

export default {
  name: 'Playlist',
  data () {
    return {
      player
    }
  },
  methods: {
    playAudio (audio) {
      player.playFromPlaylist(audio)
      this.close()
    },
    playGroup (group) {
      this.$dispatch('group:select', group)
      this.close()
    },
    close () {
      this.$dispatch('playlist:show', false)
    }
  },
}

</script>

<style lang="stylus">

.c-playlist
  absolute: top 0 bottom 0 left 0 right 0
  z-index: 30
  overflow: hidden
  
  .o-btn-escape
    margin-top: 10px
    float: right
    
  &__btns
    position: relative
    z-index: 1
    padding-top: $page-padding
    background: $transparent
    
.c-audio-list
  absolute: top 0 left 0 bottom 0 right -20px
  padding: (45px + $page-padding) 20px 0 0

  overflow-y: auto
  -webkit-overflow-scrolling: touch

.c-audio
  overflow: ellipsis
  line-height: 46px
  cursor: pointer
  font-size: 20px
  color: $dark-grey
  
  &__artist
    font-size: 24px
    margin-right: 10px
    
  &__title
    color: $grey

  &__group
    color: $black
    float: right
    clear: both
    font-weight('thin')
    margin-left: 10px
    
@media (max-width: 415px)
  .c-audio
    font-size: 16px
    
    &__artist
      font-size: 20px

.c-playlist__header
  font-size: 34px
  display: inline-block

</style>