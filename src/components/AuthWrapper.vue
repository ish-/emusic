<template lang="jade">
  splash(v-if="!showApp")
  app(v-if="showApp")
</template>

<script>

import App from 'components/App.vue'
import Splash from 'components/Splash.vue'

export default {
  name: 'AuthWrapper',

  data () {
    return {showApp: false}
  },
  events: {
    'splash:ready' () {
      this.showApp = true
    },
  },
  components: { App, Splash },
}

</script>