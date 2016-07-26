import VK from 'services/vk'

const EMUSIC_DOCUMENT_TITLE = 'E:\\music\\'

var Shared = new Vue({
  data: {
    group: null,
  },
  watch: {
    group (group) {
      if (group)
        document.title = (group.foreign ? '' : EMUSIC_DOCUMENT_TITLE) + group.name
      else
        document.title = EMUSIC_DOCUMENT_TITLE
    }
  }
})

export default Shared
