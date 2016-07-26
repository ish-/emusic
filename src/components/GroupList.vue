<template lang="jade">

.c-genre-list__container
  ul.c-genre-list
    li.c-genre(v-for="genre in genres", v-show="showAll || !genre._hide", @click="fold(genre)") 
      .c-genre__name {{genre.name}}
      ul.c-group-list(v-show="!showAll || !genre._folded")
        li.c-group(v-for="group in genre.groups", track-by="id", @click="$dispatch('group:select', group)", v-show="showAll || !group._hide") {{group.name}}

</template>

<script>

import genres from 'services/vk.groups'

genres.forEach((genre) => {
  genre._folded = true
  genre.groups.forEach((group) => {
    group._hide = false
    group.foreign = genre.foreign
  })
})

export default {
  name: 'GroupList',

  props: ['search'],

  data () {
    return {
      genres,
      showAll: false
    }
  },

  methods: {
    fold (genre) {
      if (this.showAll)
        genre._folded = !genre._folded
    },
    filter (search) {
      this.showAll = search.length < 3
      if (this.showAll) {
        this.genres = genres
        return
      }

      const REGEXP = new RegExp(search, 'i')
      this.genres = genres.filter((genre) => {
        var anyGroup = false
        genre.groups.forEach((group) => {
          group._hide = !REGEXP.test(group.name)
          !anyGroup && (anyGroup = !group._hide)
        })
        return !(!anyGroup && !REGEXP.test(genre.name))
      })
    }
  },

  ready () {
    this.$watch('search', this.filter, {immediate: true})
  }
}

</script>

<style lang="stylus">

.c-genre-list__container
  absolute: top $player-top bottom 0 left 0 right -20px
  overflow-y: auto
  
.c-genre-list
  text-align: right
  padding: 36px 20px 58px 0
  
  .c-genre
    margin: 12px 0

    .c-genre__name
      cursor: pointer
      font-size: 24px
      color: $dark-grey
      margin-bottom: 22px
      
      &:hover
        color: black
  
.c-group-list
  text-align: right
  margin: -5px 0 0
  
  .c-group
    cursor: pointer
    display: inline-block
    font-weight('light')
    margin: 4px 0 8px 35px
    // margin-left: 35px
    // margin-bottom: 8px
    font-size: 20px
    color: $grey
    
    &:hover
        color: black
        
.translate-from-right
  &-transition .c-group
    transition-default()
    transform: translateX(0)
    transition-timeout: .2s
    opacity: 1
  &-enter .c-group
    transform: translateX(-40px)
    opacity: 0

</style>