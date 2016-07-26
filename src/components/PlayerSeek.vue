<template lang="jade">

.c-player-seek(v-el:seek,
    @mouseout='seekOut',
    @mousedown='seekDown',
    @mousemove='seekMove',
    @mouseup='seekOut'
    @touchstart='seekDown',
    @touchend='seekOut',
    @touchmove='seekMove')
  .c-player-seek__progress(v-el:prog, :style="{transform: translateX}")
  
</template>

<script>


var seekDown
var seekOffset
var lastSeekOffsetX
var offsetBound
var seekMin
var IS_TOUCHABLE = window.TouchEvent != null

function getPointerOffset (e, vert) {
  if (!IS_TOUCHABLE)
    return !vert ? e.offsetX : e.offsetY
  if (!vert)
    return e.layerX != null
      ? e.layerX
      : (e.touches[0] ? (e.touches[0].pageX - offsetBound) : 0)
  else
    return e.layerY != null
      ? e.layerY
      : (e.touches[0] ? (e.touches[0].pageY - offsetBound) : 0)
}

export default {
  props: ['audio', 'vertical'],
  data () {
    return {translateX: 'translateX(-100%)'}
  },
  methods: {
    setTranslateX (seek, seekOld) {
      if (seekDown && seekOld)
        return
      return this.translateX = 'translateX(-' + Math.min(seekMin, 100 - seek*100) + '%)'
    },
    seekDown (e) {
      seekDown = true
      seekOffset = this.$els.seek.offsetWidth
    },
    seekOut (e) {
      if (!seekDown)
        return
      this.$els.prog.classList.add('is-animated')
      var offsetX = getPointerOffset(e) || lastSeekOffsetX
      this.setTranslateX(offsetX)
      this.setSeek(offsetX)
      seekDown = false
    },
    seekOnClick (e) {
      seekDown = false
    },
    seekMove (e) {
      if (!seekDown)
        return
      var offsetX = getPointerOffset(e)
      this.setTranslateX(offsetX / seekOffset)
      lastSeekOffsetX = offsetX
    },
    setSeek (offsetX) {
      let seek = offsetX / seekOffset
      this.$dispatch('seek', seek)
    }
  },

  ready () {
    var clientRect = this.$el.getBoundingClientRect()
    offsetBound = !this.vertical ? clientRect.left : clientRect.bottom
    seekOffset = this.$els.seek.offsetWidth
    seekMin = 100 - this.$els.seek.offsetHeight / seekOffset * 100
    this.$watch('audio.seek', this.setTranslateX)

    this.$els.prog.addEventListener('transitionend', function () { this.classList.remove('is-animated') })
  },
}

</script>

<style lang="stylus">
  
</style>