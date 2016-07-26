<template lang="jade">
  .c-splash
    svg.c-splash__emusic(@click="!vkInited && $dispatch('splash:click')", v-el:emusic, version='1.1', xmlns='http://www.w3.org/2000/svg', xmlns:xlink='http://www.w3.org/1999/xlink', x='0px', y='0px', viewbox='-1 -1 372 510', style='enable-background:new 0 0 372 510;', xml:space='preserve', @transitionend="onTransitionEnd")
        g
          path(d='M0,374.1c0-78,0-155.5,0-233.5c123.8,0,247.3,0,371.2,0c0,31.1,0,61.9,0,93.4c-92.5,0-184.7,0-277.2,0\
          c0,15.7,0,30.7,0,46.6c92.4,0,184.8,0,277.3,0c0,31.5,0,62.3,0,93.5C247.7,374.1,124.1,374.1,0,374.1z')
          path(d='M0,93.1C0,61.9,0,31.2,0,0c123.7,0,247.2,0,371.2,0c0,30.9,0,61.8,0,93.1C247.6,93.1,124.1,93.1,0,93.1z')
          path(d='M0.9,420.1c5.7,0,11-0.3,16.2,0.2c1.5,0.1,3.2,2,4,3.5c6.7,12.9,13.1,25.8,19.6,38.8c1.1,2.2,2.3,4.4,3.8,7.3\
          c1.1-1.9,1.9-3.2,2.6-4.5c6.9-13.7,13.8-27.4,20.5-41.1c1.5-3.2,3.4-4.4,6.9-4.2c4.4,0.3,8.9,0.1,13.7,0.1c0,29.4,0,58.3,0,87.7\
          c-6.5,0-13,0-19.9,0c0-13.2,0-26.1,0-40.5c-1.4,2.2-2.2,3.1-2.7,4.1c-4,7.3-7.8,14.7-12.1,21.8c-0.9,1.6-3.4,2.8-5.3,3.2\
          c-7.8,1.6-13-0.9-16.1-8.9c-2.6-6.6-6.6-12.6-10.9-18.8c0,13,0,25.9,0,39.2c-7.1,0-13.5,0-20.2,0C0.9,478.7,0.9,449.8,0.9,420.1z')
          path(d='M104.4,420.3c6.5,0,12.9,0,20,0c0,2,0,3.8,0,5.5c0,16.8,0.3,33.6-0.1,50.5c-0.3,13.7,14,16.9,22.1,12.2\
          c4.7-2.7,6.2-7,6.2-12.2c-0.1-16.7,0-33.3,0-50c0-1.8,0-3.6,0-5.9c6.9,0,13.4,0,20.7,0c0,1.8,0,3.6,0,5.3c0,16.3,0,32.6,0,49\
          c0,22.4-13.1,35.3-35.7,34.2c-6.6-0.3-13.5-2.3-19.6-5c-8.7-4-13.8-11.6-13.9-21.5c-0.2-20-0.1-40-0.1-60\
          C104,421.9,104.2,421.2,104.4,420.3z')
          path(d='M185.8,496.5c3.8-4.9,7.4-9.7,11.2-14.6c7.6,5.4,15.5,9.1,24.8,8.4c0.8-0.1,1.7,0,2.5-0.1\
          c5.8-0.7,9.9-3.5,10.1-7.3c0.4-5.5-4.1-6.9-7.9-8.3c-7.5-2.7-15.4-4.6-22.7-7.6c-12.3-5.1-17.3-16.4-13.5-29.1\
          c2.4-8.4,8.3-13.8,16.3-16.3c14.6-4.5,28.9-3.5,42.6,3.7c1,0.5,1.9,1.3,3.1,2.2c-3,5.3-5.8,10.5-8.1,14.6c-8-1.6-15.3-3.5-22.7-4.2\
          c-6.6-0.7-10.5,1.9-10.8,5.7c-0.4,5.8,4.3,7,8.3,8.4c6.7,2.4,13.7,4.1,20.4,6.7c10.4,4,16.7,11.1,16.5,23\
          c-0.1,9.6-4.2,16.5-12.2,21.5C231.2,511,200.6,512,185.8,496.5z')
          path(d='M371.1,500c-14,11.4-37.7,12.2-51.5,2c-7.2-5.3-10.8-12.4-10.7-21.4c0.1-10.8,0.1-21.6,0-32.5\
          c-0.1-11.6,5.3-19.9,15.5-24.6c14.4-6.7,28.7-5.6,42.7,1.7c1,0.5,1.9,1.3,2.8,2c0.4,0.3,0.6,0.8,1.1,1.4c-3,4.9-6.1,9.8-8.8,14.1\
          c-5.7-1.7-10.9-3.9-16.3-4.6c-10.3-1.4-16.5,4.5-16.6,14.8c0,7.8-0.1,15.6,0,23.5c0.1,8.4,5.3,14.2,13.7,13.7\
          c6.2-0.3,12.4-2.6,19.5-4.1C364.8,489.7,367.9,494.7,371.1,500z')
          path(d='M270.8,420.3c6.8,0,13.2,0,19.8,0c0,29.3,0,58.3,0,87.6c-6.7,0-13.1,0-19.8,0\
          C270.8,478.7,270.8,449.8,270.8,420.3z')
    button.o-btn.c-splash__vk-auth(:style="{opacity: vkInited ? 0 : 1}", @click="vkAuth")
      svg.c-splash__vk#Layer_1(version='1.1', xmlns='http://www.w3.org/2000/svg', xmlns:xlink='http://www.w3.org/1999/xlink', x='0px', y='0px', viewbox='0 0 438.7 250.2', style='enable-background:new 0 0 438.7 250.2;', xml:space='preserve')
        g
          path(d='M438.7,19.8c0,2,0,4,0,6c-2.8,6.5-5.1,13.3-8.4,19.5c-11,20.7-25.9,38.9-39.9,57.6c-7.2,9.7-14.3,19.6-20.8,29.7\
          c-3.9,6-3.4,12.7,0.8,18.5c2.9,4,6.4,7.6,9.9,11.2c12.1,12.3,24.8,24,36.4,36.7c9.7,10.7,19.7,21.5,22,36.8c0,0.3,0,0.6,0,0.9\
          c-1.4,7.6-6.7,10.9-13.7,11.9c-3.8,0.5-7.7,0.7-11.5,0.7c-17.4,0.3-34.8,0.3-52.2,1c-8.3,0.3-15.8-1.6-23.1-5\
          c-10.3-4.9-17.8-13.1-25.5-21.3c-8.3-8.8-16.2-18.1-25.1-26.3c-10.2-9.5-18.3-7.7-25.2,4.4c-1.3,2.2-2.5,4.6-2.9,7.1\
          c-1.3,7.7-2.5,15.5-3.1,23.2c-0.9,11.8-5.6,16.6-17.5,16.8c-9.6,0.1-19.1,0.3-28.7,0c-7-0.2-14-0.6-20.8-2.1\
          c-36.4-7.7-66.1-27.4-90-55.1C71,159,47.9,122.2,28.3,83.4C18.5,63.8,9.4,43.9,0,24.1c0-2,0-4,0-6c3.7-6.2,9.9-6.6,16.1-6.6\
          c18.4-0.2,36.8-0.2,55.2-0.3c13-0.1,17.8,3.2,22.9,15c11.4,26.1,24.1,51.7,39.3,75.8c4.8,7.6,10.6,14.6,18.7,19.1\
          c6.2,3.4,11.4,1.9,14.4-4.4c1.3-2.7,2.4-5.5,2.9-8.4c1.2-7.2,2.4-14.4,2.9-21.6c1.2-16.7,0.9-33.4-2.9-49.8\
          c-2-8.5-6.9-14.2-15.2-16.9c-1.8-0.6-3.6-1-5.4-1.4c-4-1-4.5-2-1.8-5.3c3.9-4.7,8.7-8.5,14.9-9.5c8.4-1.4,16.9-2.6,25.4-3.1\
          c17.3-1,34.5-1,51.6,2c11.3,2,15.5,6.2,17.5,17.4c0.3,1.5,0.4,3.1,0.4,4.7c-0.1,10.7-0.3,21.4-0.5,32.1c-0.2,15-0.7,30-0.2,44.9\
          c0.2,5.3,2,11,4.5,15.7c3,5.6,8.7,6.2,13.4,1.9c5.4-5,11-10.1,15.3-16c18.3-24.6,32.7-51.5,44-80c3.9-9.9,6.5-11.5,17-11.3\
          c1.1,0,2.3,0,3.4,0c22.4-0.3,44.8-0.7,67.2-0.7C428.3,11.3,435.6,11.6,438.7,19.8z')
      span login with vk.com
</template>

<script>
import VK from 'services/vk'
import _ from 'utils'

export default {
  name: 'Splash',

  data () {
    return {
      ready: false,
      vkInited: true
    }
  },

  methods: {
    vkAuth () {
      VK.auth()
    },
    onTransitionEnd (e) {
      if (this._transtionEndFired)
        return
      this._transtionEndFired = true
      VK.inited.then(() => {
        this.$dispatch('splash:ready')
      }, () => {
        _.log('SplashComponent waits for VK.inited')
      })
    }
  },
  created () {
    if (process.env.NODE_ENV === 'development')
      this.onTransitionEnd()
    VK.inited.catch(() => {
      this.vkInited = false
    })
  },

  ready () {
    var $emusic = this.$els.emusic
    var $emusicPaths = $emusic.querySelectorAll('path')

    Array.prototype.forEach.call($emusicPaths, ($path) => {
      let length = $path.getTotalLength()
      $path.style.strokeDasharray = length + ' ' + length
      $path.style.strokeDashoffset = length
    })

    setTimeout(() => {
      $emusic.classList.add('o-dashoffset-transition')

      Array.prototype.forEach.call($emusicPaths, ($path) => {
        $path.style.strokeDashoffset = 0
      })
    })
  }
}

</script>

<style lang="stylus">

.c-splash
  size: 100% 100%
  // absolute: top 0 bottom 0 left 0 right 0

  display: flex
  flex-direction: column
  align-items: center
  justify-content: space-around
  
  &__vk
    size: 63px 36px
    relative: bottom -5px
    
  &__vk-auth
    line-height: 36px
    font-size: 36px
    opacity: 0
    transition: opacity .5s ease
    
    @media (max-width: 415px)
      font-size: 26px
    
    span
      margin-left: 20px

  &__emusic
    cursor: pointer
    // width: 372px
    // height: 510px'
    pointer-events: auto
    size: 200px 274px

    g
      stroke: #000000
      stroke-width: 1px
      // transition: all .2s ease-in-out
      // transition-delay: 1.3s
    path
      fill: rgba(0,0,0,0)

    &.o-dashoffset-transition 
      g
        // fill: rgba(0,0,0,1)
      path
        animation: blink-color .5s 1 forwards 1.5s
        transition: all 2s ease
      
@keyframes blink-color
  0%
    fill: rgba(0,0,0,0)
  100%
    fill: rgba(0, 0, 0, 1)
</style>