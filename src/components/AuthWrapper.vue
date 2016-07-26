<template lang="jade">
  app(v-if="showApp")
  splash(v-if="!showApp && !showTutorial", transition="opacity")
  .c-tutorial(v-if="showTutorial", transition="opacity")
    p <span style="font-size: 24px">E:\music\</span> <i>(емьюзик, емуз; <a href="https://vk.com/e_music" target="_blank">vk.com/e_music)</a></i> — трек-блог музыки различных жанров в социальной сети Вконтакте, основанный 9 февраля 2011 года двумя микроблоггерами из Луганска. Вся сеть блогов состоит более чем из 200 пабликов, представляющих различные музыкальные направления и объединенных общим названием вида E:\music\%genrename%. Главный блог, как и вся сеть, преимущественно ориентированы на музыку всевозможных жанров и стилей. Причем выкладывается как «энтрилевельная музыка», так и различный андерграунд. [<a href="http://wikireality.ru/wiki/E:%5Cmusic%5C" target="_blank">источник</a>]
    p(style="font-size: 18px") Приложение позволяет случайным образом (с некоторой приоритетом по популярности) знакомиться с выбранным жанром, с возможостью перехода на оригинальный пост.
    h2(style="margin: 40px 0 30px") Скриншоты
    .c-tutorial__screenshots
      img(src="http://i.imgur.com/FVZFTl8.png")
      img(src="http://i.imgur.com/w5pAk1C.png")
      img(src="http://i.imgur.com/M4RNVZ5.png")
    h2.c-tutorial__back(@click="showTutorial = false")
      .o-btn.o-btn-back
      span Назад
</template>

<script>

import App from 'components/App.vue'
import Splash from 'components/Splash.vue'
import player from 'services/player'

export default {
  name: 'AuthWrapper',

  data () {
    return {showApp: false, showTutorial: false}
  },
  events: {
    'splash:click' () {
      this.showTutorial = true
    },
    'splash:ready' () {
      this.showApp = true
    },
  },
  components: { App, Splash },
}

</script>

<style lang="stylus">
.c-tutorial
  padding: 40px 0
  font-family: -apple-system,BlinkMacSystemFont,Roboto,Open Sans,Helvetica Neue,sans-serif
  font-size: 16px
  line-height: 23px
  max-width: 600px
  margin: 0 auto
  
  &__back
    cursor: pointer
    span
      margin-left: 20px
      line-height: 50px
      vertical-align: top
  
  .o-btn-back
    transform: rotate(-90deg)
    
  
  p
    margin: 0 0 20px
    
  &__screenshots
    margin: 20px -20px 20px 0
    
    img 
      margin-bottom: 20px
      margin-right  : 20px
      width: 45%
      max-width: 280px
      min-width: 240px
      box-shadow: 0 0 2px grey;
</style>