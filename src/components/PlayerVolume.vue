<template lang="jade">
  
.c-volume(@touchmove="changeVolume",
    @touchstart="startChangeVolume",
    @touchend="stopChangeVolume",
    @mousewheel="wheelChangeVolume",
    :style="{opacity: volumeOpacity}",
    @click="deferPulled()")
  object.o-volume: include ../assets/volume2.svg
  span {{player.volume | oneToPercent}}

</template>
<script>

import _ from 'utils'
import player from 'services/player'

export default {
  name: 'PlayerVolume',
  data () {
    return {player, volumeOpacity: 1}
  },
  methods: {
    setVolume (volume) {
      volume = player.setVolume(volume)
      this.volumeOpacity = Math.max(.2, volume)
    },
    wheelChangeVolume (e) {
      var volume = player.volume + e.deltaY / 200
      this.setVolume(volume)
      this.deferPulled()
    },
    deferPulled () {
      clearTimeout(this._mouseWheelTimeout)
      this._mouseWheelTimeout = _.setClassForTime(this.$el, 'is-pulled')
    },
    startChangeVolume (e) {
      this.startOffset = _.getPointerOffset(e, true)
      this.$el.classList.add('is-pulled')
    },
    stopChangeVolume () {
      this.lastOffset = 0
      this.$el.classList.remove('is-pulled')
    },
    changeVolume (e) {
      var offsetY = this.startOffset - _.getPointerOffset(e, true)
      if (!this.lastOffset && Math.abs(offsetY) < 20)
        return
      var volume = player.volume + parseInt(offsetY - this.lastOffset) / 300
      this.setVolume(volume)
      this.lastOffset = offsetY
    },
  },
  created () {
    this._mouseWheelTimeout = null

    this.startOffset = 0,
    this.lastOffset = 0
  }
}
  
</script>

<style lang="stylus">
  
.c-volume
  padding: 20px
  white-space: nowrap

</style>