const path = require('path')
const webpack = require('webpack')
const resolve = dir => {
  return path.join(__dirname, dir)
}
module.exports = {
  productionSourceMap: false,
  assetsDir: 'static',
  publicPath: '/',
  runtimeCompiler: true,
  chainWebpack: config => {
    config.resolve.alias
      .set('src', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('pages', resolve('src/pages'))
      .set('components', resolve('src/components'))
    // config.output
    //   .filename('js/[name].[contenthash:5].js')
    //   .chunkFilename('js/[name].[contenthash:5].js')
    config.optimization.splitChunks({
      cacheGroups: {
        vendors: {
          name: `chunk-vendors`,
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: `chunk-common`,
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      },
      name(module, chunks) {
        const allChunksNames = chunks
          .map((item, index) => {
            let name = ''
            if (index > 0 && item.name) {
              name = item.name.split('')[0]
            } else {
              name = item.name
            }
            return name
          })
          .join('~')
        return allChunksNames
      }
    })
    console.log('VUE_APP_QN的值', process.env.VUE_APP_QN)
    if (process.env.VUE_APP_QN == 1) {
      config.plugins.delete('prefetch')
      config.plugins.delete('preload')
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        // axios: 'axios',
        axios: ['src/assets/js/axios.js', 'default'],
        Vue: ['vue/dist/vue.esm.js', 'default']
      })
    ]
  },
  devServer: {
    disableHostCheck: true,
    host: '0.0.0.0',
    hot: true
  }
}
