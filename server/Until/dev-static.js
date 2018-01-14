const axios = require('axios')
const webpack = require('webpack')
const path = require('path')
const MemoryFs = require('memory-fs')
const proxy = require('http-proxy-middleware')
const ReactDomServer = require('react-dom/server')

const serverConfig = require('../../build/webpack.config.server')

const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/index.html')
      .then(res => {
        resolve(res.data)
      })
      .catch(reject)
  })
}

// huck

const Module = module.constructor

const mfs = new MemoryFs
const serverCompiler = webpack(serverConfig)
serverCompiler.outputFileSystem = mfs  // 动态编译出来的文件不再写入硬盘而是写入内存
let serverBundle
serverCompiler.watch({}, (err, stats) => {
  if(err) throw  err
  stats =  stats.toJson()
  stats.errors.forEach(err => console.error(err))
  stats.warnings.forEach(warn => console.warn(warn))

  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename,
  )

  const bundle = mfs.readFileSync(bundlePath, 'utf-8')
  // console.log('-------------------------->', bundle) 打包完了的bundle文件字符串.
  const m = new Module
  m._compile(bundle, 'server-entry.js')   // 坑! 一定要指定名字
  serverBundle = m.exports.default  // 注意
})

module.exports = function (app) {
//  使用代理将静态全部代理到webpack-dev-server上
  app.use('/public', proxy({
    target: 'http://localhost:8888'
  }))


//  服务端渲染返回结果给浏览器端
  app.get('*', function (req, res) {
    getTemplate().then(template => {
      const content = ReactDomServer.renderToString(serverBundle)
      res.send(template.replace('<!--app-->', content))
    })
  })
}