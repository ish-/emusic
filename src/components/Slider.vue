<template lang="jade">
  
.o-slider(@mouseout='seekOut',
    @mousedown='seekDown',
    @mousemove='seekMove',
    @mouseup='seekOut'
    @touchstart='seekDown',
    @touchend='seekOut',
    @touchmove='seekMove')
  .o-slider__pointer(v-el:pointer, :style="{transform: translate}")
  .o-slider__bg


</template>
<script>

var isDown
var offset
var lastOffset
var offsetBound

export default {
  name: 'Slider',

  props: ['vertical', 'min-size', 'watch', 'syncOnMove'],
  data () {
    return {translate: ''}
  },
  methods: {
    setTranslate (seek, old) {
      if (isDown && old)
        return
      if (!this.vertical)
        return this.translate = 'translateX(-' + Math.min(this.minSize, 100 - seek*100) + '%)'
      else
        return this.translate = 'translateY(' + Math.max(this.minSize, seek*100) + '%)'
    },
    seekDown (e) {
      isDown = true
      this.setOffset()
    },
    seekOut (e) {
      if (!isDown)
        return
      this.$els.pointer.classList.add('is-animated')
      var offsetX = _.getPointerOffset(e, this.vertical, offsetBound) || lastOffset
      this.setTranslate(offsetX / offset)
      this.setSeek(offsetX)
      isDown = false
    },
    seekOnClick (e) {
      isDown = false
    },
    seekMove (e) {
      if (!isDown)
        return
      var offsetX = _.getPointerOffset(e, this.vertical, offsetBound)
      this.setTranslate(offsetX / offset)
      lastOffset = offsetX
      if (this.syncOnMove)
        this.setSeek(offsetX)
    },
    setSeek (offsetX) {
      let seek = offsetX / offset
      if (this.vertical)
        seek = 1 - seek
      seek = Math.max(0, Math.min(1, seek))
      this.$dispatch('slide', seek)
    },
    setOffset () {
      offset = !this.vertical ? this.$el.offsetWidth : this.$el.offsetHeight
    }
  },

  ready () {
    var clientRect = this.$el.getBoundingClientRect()
    offsetBound = !this.vertical ? clientRect.left : clientRect.bottom
    this.setOffset()
    if (!this.minSize)
      this.minSize = 100 - (!this.vertical ? this.$el.offsetHeight : this.$el.offsetWidth) / offset * 100
    // else
    //   this.minSize = 100 - this.minSize

    if (this.watch)
      this.$watch('watch', this.setTranslate)

    this.setTranslate(0)

    this.$els.pointer.addEventListener('transitionend', function () { this.classList.remove('is-animated') })
  },
}


  
</script>

<style lang="stylus">
  
.o-slider
  overflow: hidden
  
  > *
    pointer-events: none

</style>