const genres = [
  {
    name: 'Electronic',
    groups: [
      {
        name: 'vaporwave',
        id: 64858245
      }, {
        name: 'drone',
        id: 34125866
      }, {
        name: 'psybient',
        id: 29583317
      }, {
        name: 'future garage',
        id: 25247340
      }, {
        name: 'ambient',
        id: 27122967
      }, {
        name: 'dub techno',
        id: 55120308
      }, {
        name: 'ritual',
        id: 36286213
      }, {
        name: 'glitch',
        id: 44955915
      }, {
        name: 'minimal',
        id: 33837896
      },
    ]
  }, {
    name: 'Rock',
    groups: [
      {
        name: 'mathcore',
        id: 28457642
      }, {
        name: 'chaotic hardcore',
        id: 37441775
      }, 
    ]
  }, {
    name: 'Other',
    groups: [
      {
        name: 'lucidity',
        id: 36976241
      }
    ]
  }
]


const groupsById = genres.reduce((groups, genre) => {
  genre.groups.forEach((group) => groups[group.id] = group)
  return groups
}, {})

genres.byId = function (id) {
  return groupsById[id]
}

export default genres