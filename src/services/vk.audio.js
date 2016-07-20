import request from 'services/vk.request'

export default {
  getUrl ({owner_id, id}) {
    return request('audio.getById', {audios: `${owner_id}_${id}`}).then((audio) => {
      return audio.url
    })
  },

  add ({owner_id, id}) {
    return request('audio.add', {owner_id, audio_id: id})
  },
}