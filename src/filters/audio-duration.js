import Vue from 'vue'
function z(n) { return (n < 10 ? '0' : '') + n }

Vue.filter('audioDuration', (input) => {
  const seconds = input % 60
  const minutes = Math.floor(input % 3600 / 60)
  const hours = Math.floor(input / 3600)
  if(isNaN(minutes) || isNaN(seconds))
    return ''
  return (hours ? (z(hours) + ':') : '') + z(minutes) + ':' + z(seconds)
})