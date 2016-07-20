import _ from 'utils'
import request from 'services/vk.request'

export default {
  getById (_audios) {
    var audios = _audios.map((a) => `${a.owner_id}_${a.id}`).join(',')
    return request('audio.getById', {audios}).then((audios) => {
      return _.merge(_audios, audios)
    })
  },

  add ({owner_id, id}) {
    return request('audio.add', {owner_id, audio_id: id})
  },
}