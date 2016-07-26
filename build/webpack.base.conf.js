var path = require('path')
var config = require('../config')
var utils = require('./utils')
var webpack = require('webpack')
var projectRoot = path.resolve(__dirname, '../')

const IS_CORDOVA = !!~process.argv.indexOf('cordova')
const publicPath = process.env.NODE_ENV === 'production' ? 
    IS_CORDOVA ? '' : config.build.assetsPublicPath 
  : config.dev.assetsPublicPath
  

var webpackConfig = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    publicPath: publicPath,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.vue'],
    fallback: [path.join(__dirname, '../node_modules')],
    // alias: {
    //   'src': path.resolve(__dirname, '../src'),
    //   'assets': path.resolve(__dirname, '../src/assets'),
    //   'components': path.resolve(__dirname, '../src/components')
    // },
    root: [
      path.join(__dirname, '../src'),
    ]
  },
  resolveLoader: {
    fallback: [path.join(__dirname, '../node_modules')]
  },
  module: {
    // preLoaders: [
    //   {
    //     test: /\.vue$/,
    //     loader: 'eslint',
    //     include: projectRoot,
    //     exclude: /node_modules/
    //   },
    //   {
    //     test: /\.js$/,
    //     loader: 'eslint',
    //     include: projectRoot,
    //     exclude: /node_modules/
    //   }
    // ],
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: projectRoot,
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      { test: /\.jade$/, loader: "jade" },
      {
        test: /\.html$/,
        loader: 'vue-html'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      _: "utils",
      Vue: "vue",
    }),
    new webpack.DefinePlugin({
      'IS_CORDOVA': IS_CORDOVA
    })
  ],
  eslint: {
    formatter: require('eslint-friendly-formatter')
  },
  vue: {
    loaders: Object.assign(utils.cssLoaders(), {
      html: 'jade',
    })
  },
  stylus: {
      use: [require('nib')()],
      import: ['~nib/lib/nib/index.styl', '~styles/common.styl'],
  }
}

module.exports = webpackConfig