import _ from 'utils'
import request from 'services/vk.request'
import VK from 'services/vk'

const DEFAULT_POSTS_COUNT = 3

var cachedGroupsLengths = {}

export default {
  getWallLength (group) {
    var cached
    if ((cached = cachedGroupsLengths[group.id])) {
      return Promise.resolve(cached)
    }

    return this.getPost(group, {offset: 0, count: 1}).then((res) => {
      return (cachedGroupsLengths[group.id] = res.count)
    })
  },

  getPost (group, opts = {}, groupLength) {
    _.defaults(opts, {
      offset: (Math.random() * (groupLength != null ? groupLength : 100)) | 0,
      count: DEFAULT_POSTS_COUNT
    })

    opts.owner_id = '-' + group.id

    return request('wall.get', opts)
  },

  getPostById (...posts) {
    return request('wall.getById', {posts})
  },

  getRandomPost (group) {
    return this.getWallLength(group).then((length) => {
      return this.getPost(group, {
        offset: _.random(0, length - DEFAULT_POSTS_COUNT)
      })
    })
  },

  getRandomPostOfRepost (group) {
    return this.getWallLength(group).then((length) => {
      return request('execute', {code: CODE_GET_POST_OF_REPOST({
        owner_id: '-' + group.id,
        offset: _.random(0, length - DEFAULT_POSTS_COUNT),
        count: DEFAULT_POSTS_COUNT,
      })})
    })
  },

  getRandomPostAudio (group, i) {
    if (i > 3)
      throw new Error('Cannot find post')

    var req
    if (VK.standalone)
      req = request('execute.getRandomPostAudio', {owner_id: '-' + group.id, random: _.random(0, 100000), count: 3})
    else
      req = this.getRandomPostOfRepost(group)

    return req.then((items) => {
      items.sort(() => Math.random() - Math.random())

      for (var i in items) {
        let item = items[i]
        let audios = item.audios.filter((a) => a && a.url)

        if (!audios.length)
          continue

        let audio = audios[_.random(0, audios.length - 1)]
        audio.postId = item.postId
        return audio
      }

      if (i > 2)
        throw new Error(`Cannot find audio in ${group.name} group`)

      return this.getRandomPostAudio(group, i ? ++i : 0)
    })
  },
}

function CODE_GET_POST_OF_REPOST ({owner_id, offset, count}) { return `
  var _posts = API.wall.get({owner_id:${owner_id}, offset:${offset}, count:${count}}).items;
  var posts = [];
  var i = 0; while(i < _posts.length) {
    var post = _posts[i];
    var _post;
    if (post.copy_history) {
      if (post.copy_history[0].attachments) {
        _post = API.wall.getById({posts: post.copy_history[0].owner_id + "_" + post.copy_history[0].id})[0];
        _post.postId = post.owner_id + "_" + post.id;
        post = _post;
      } 
    }
    else {
      post.postId = post.owner_id + "_" + post.id;
    }
    if (post.attachments) {
      var as = post.attachments@.audio;
      post.audios = as;
      post.weight = post.likes.count + post.reposts.count * 2;
      delete post.owner_id;delete post.id;
      delete post.attachments;delete post.text;delete post.post_type;delete post.comments;delete post.likes;delete post.reposts;
      posts.push(post);
    }
    i = i+1;
  };
  return posts;
`.replace(/  +| ?([\+\(\)\{<\}\*;,=]) ?|\n|\t/ig,'$1')}