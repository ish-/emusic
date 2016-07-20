<template lang="jade">

ul.c-genre-list
  li.c-genre(v-for="genre in genres", v-show="showAll || !genre.hide") 
    .c-genre__name {{* genre.name}}
    ul.c-group-list
      li.c-group(v-for="group in genre.groups", @click="$dispatch('group:select', group)", v-show="showAll || !group.hide") {{* group.name}}

</template>

<script>

import genres from 'services/vk.groups'

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
    filter (search) {
      this.showAll = search.length < 3
      if (this.showAll)
        return

      const REGEXP = new RegExp(search, 'i')
      this.genres.forEach((genre) => {
        var anyGroup = false
        genre.groups.forEach((group) => {
          group.hide = !REGEXP.test(group.name)
          !anyGroup && (anyGroup = !group.hide)
          console.log('g', group.hide)
        })
        genre.hide = !anyGroup && !REGEXP.test(genre.name)
        console.log('ge', genre.hide)
      })
    }
  },
  watch: {
    search (str) { this.filter(str) }
  },
}

</script>

<style lang="stylus">
  
.c-genre-list
  text-align: right
  margin: 36px 0
  
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
    margin-left: 28px
    margin-bottom: 8px
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