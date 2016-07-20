<template lang="jade">

.c-playlist
  .c-playlist__btns
    header.c-playlist__header History
    button.o-btn.o-btn-escape(@click="close()")
      include ../assets/crest.svg
  ul.c-audio-list
    li.c-audio.u-relative(v-for="(i, audio) in player.playlist", @click="playAudio(i)")
      span.c-audio__group(@click.stop="playGroup(group)") [{{* audio.group.name }}]
      span.c-audio__artist {{* audio.artist}}
      span.c-audio__title {{* audio.title}}


</template>

<script>

import player from 'services/player'

export default {
  name: 'Playlist',
  data () {
    return {
      player
    }
  },
  methods: {
    playAudio (i) {
      player.playFromPlaylist(i)
      this.close()
    },
    playGroup (group) {
      this.$dispatch('group:select', audio.group)
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
  
  .o-btn-escape
    margin-top: 10px
    float: right
    
.c-audio-list
  margin-top: 20px
  height: 100%
  overflow-y: auto

.c-audio
  overflow: ellipsis
  line-height: 46px
  cursor: pointer
  
  &__artist
    font-size: 24px
    margin-right: 10px
  &__title
    font-size: 20px
  &__group
    font-size: 20px
    color: $grey
    float: right
    clear: both
    font-weight('light')
    
.c-playlist__header
  font-size: 34px
  display: inline-block

</style>