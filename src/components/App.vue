<template lang="jade">

#app
  header.c-header(v-if="!showPlaylist", transition="translate-from-right")
    label(for="header-search") E:\music\
    input.c-header__search#header-search(v-if="!selectedGroup", placeholder="search..", v-model="search", tabindex="1")
    .c-header__group(v-if="selectedGroup") {{selectedGroup.name}}
    hr
  group-list(v-if="!selectedGroup && !showPlaylist", transition="translate-from-right", :search="search")
  player(v-if="selectedGroup && !showPlaylist", transition="translate-from-down")
  playlist(v-if="showPlaylist", transition="translate-from-down")

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
      selectedGroup: null,
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
      if (!group)
        return this.deselectGroup()
      this.playGroup(group)
    })

    VK.inited.then(() => {
      this.ready = true
      VK.Storage.get('group', 'audio').then(({audio, group}) => {
        group && this._selectGroup(group)
        if (audio && audio.id)
          player.setAudio(audio)
      }, (e) => {
        console.error('Cannot load data from storage')
      })
    })
  },

  methods: {
    playGroup (group) {
      const thenPlay = player.group && !(player.group.id === group.id)
      this._selectGroup(group)
      thenPlay && player.playGroup(group)
    },
    deselectGroup () {
      this.selectedGroup = null
    },
    _selectGroup (group) {
      this.selectedGroup = player.group = group
    }
  },
}

</script>

<style lang="stylus">

#app
  position: relative
  height: 100%

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
    font-size: inherit
    background: none
    // color: #C0C0C0
    color: $grey
    
    &:focus ~ hr
      border-bottom: 1px solid $blue
    
  &__group
    margin-left: 3px
    font-weight('light')
    display: inline-block

</style>
