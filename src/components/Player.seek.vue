<template lang="jade">

.c-player-seek(v-el:seek, @mouseup='seekOnClick', @mouseout='seekOnMouseOut', @mousedown='seekOnMouseDown', @mousemove='seekOnMouseMove')
  .c-player-seek__progress(:style="{transform: 'translateX(-' + Math.min(seekMin, 100 - audio.seek*100) + '%)'}")
  
</template>

<script>


var seekMouseDown
var seekOffset

export default {
  props: ['audio'],
  methods: {
    seekOnMouseDown (e) {
      seekMouseDown = true
      seekOffset = this.$els.seek.offsetWidth
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

      let seek = (e.offsetX) / seekOffset
      this.$dispatch('seek', seek)
    },
  },

  ready () {
    seekOffset = this.$els.seek.offsetWidth
    this.seekMin = 100 - this.$els.seek.offsetHeight / seekOffset * 100
  },
}

</script>

<style lang="stylus">
  
</style>