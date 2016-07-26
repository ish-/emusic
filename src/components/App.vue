<template lang="jade">

#app(v-if="ready", transition="opacity")
  header.c-header(v-if="!showPlaylist", transition="translate-from-right")
    label(for="header-search", v-show="showEmusicLabel") E:\music\
    input.c-header__search.u-user-select#header-search(v-show="!$.group", placeholder="search..", v-model="search")
    .c-header__group(v-if="$.group") {{$.group.name}}
    hr
  group-list(v-if="showGroupList", transition="translate-from-right", :search="search")
  player(v-if="showPlayer", transition="translate-from-down")
  playlist(v-if="showPlaylist", transition="translate-from-down")
  .o-btn.o-btn-back(v-show="showBtnBack", @click="$.group = player.group", transition="opacity")

</template>

<script>

import VK from 'services/vk'
import player from 'services/player'
import Shared from 'services/shared'

import Player from 'components/Player.vue'
import GroupList from 'components/GroupList.vue'
import Playlist from 'components/Playlist.vue'

export default {
  name: 'App',

  data () {
    return {
      player,
      ready: false,
      search: '',
      showPlaylist: false,
    }
  },

  components: {
    Player, GroupList, Playlist
  },

  created () {
    this.$on('playlist:show', (bool) => this.showPlaylist = bool)
    this.$on('group:select', (group) => {
      Shared.group = group
      if (group)
        player.playGroup()
      else
        this.$set('search' ,'')
    })
  },

  ready () {
    this.ready = true
  },

  computed: {
    showGroupList () {
      return !this.$.group && !this.showPlaylist
    },
    showEmusicLabel () {
      return !(this.$.group && this.$.group.foreign)
    },
    showPlayer () {
      return this.$.group && !this.showPlaylist && this.player.audio
    },
    showBtnBack () {
      return !this.$.group && this.player.group.id
    }
  }
}

</script>

<style lang="stylus">

#app
  position: relative
  height: 100%
  overflow: hidden
  
  max-width: 600px
  margin: 0 auto

.c-header
  font-size: $header-font-size
  font-weight: 200
  font-weight('thin')
  overflow: ellipsis
  
  hr
    margin-top: $header-padding-bottom
    border: 1px solid #EDEDED
    transition: border-color 1s ease
  
  &__search
    margin-left: 3px
    font-weight('thin')
    font-size: $header-font-size
    background: none
    // color: #C0C0C0
    color: $grey
    
    &:focus ~ hr
      border-bottom: 1px solid $blue
    
  &__group
    margin-left: 3px
    font-weight('light')
    display: inline-block

.o-btn-back
  size: 50px
  border-radius: 50px
  border: 1px solid $dark-grey
  absolute: left 0 bottom $page-padding
  
  transition: all .2s ease-out
  transition-delay: .3s
  transform: translateY(0)
  
  &.opacity-leave
    transition-delay: 0s
    transform: translateY(-10px) scale(2) !important
  
  &:hover
    transform: translateY(-10px)

  &:after
    size: 15px
    content: ''
    absolute: top 18px left 16px
    border: 1px solid $dark-grey
    border-width: 0 0 1px 1px
    transform: rotate(135deg)
    animation: blink 2s infinite ease

</style>
