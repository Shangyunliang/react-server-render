const axios = require('axios')
const webpack = require('webpack')
const path = require('path')
const ejs = require('ejs')
const MemoryFs = require('memory-fs')
const proxy = require('http-proxy-middleware')
const serialize = require('serialize-javascript')
const asyncBopotstrap = require('react-async-bootstrapper').default
const ReactDomServer = require('react-dom/server')
const Helmet = require('react-helmet').default

const serverConfig = require('../../build/webpack.config.server')

// const getTemplate = () => {
//   return new Promise((resolve, reject) => {
//     axios.get('http://localhost:8888/public/index.html')
//       .then(res => {
//         resolve(res.data)
//       })
//       .catch(reject)
//   })
// }

const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/server.ejs')
      .then(res => {
        resolve(res.data)
      })
      .catch(reject)
  })
}

// huck

// const Module = module.constructor

const NativeModule = require('module')
const vm = require('vm')

const getModuleFromString = (bundle, filename) => {
  const m = { exports: {} }
  const wrapper = NativeModule.wrap(bundle)
  const script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: true,
  })
  const result = script.runInThisContext()
  result.call(m.exports, m.exports, require, m)
  return m
}


const mfs = new MemoryFs()
const serverCompiler = webpack(serverConfig)
serverCompiler.outputFileSystem = mfs // 动态编译出来的文件不再写入硬盘而是写入内存
let serverBundle, createStoreMap
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err
  stats = stats.toJson()
  stats.errors.forEach(err => console.error(err))
  stats.warnings.forEach(warn => console.warn(warn))

  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  )


  const bundle = mfs.readFileSync(bundlePath, 'utf-8')
  // console.log('-------------------------->', bundle) 打包完了的bundle文件字符串.
  // const m = new Module()
  // m._compile(bundle, 'server-entry.js') // 坑! 一定要指定名字

  const m = getModuleFromString(bundle, 'server-entry.js')
  serverBundle = m.exports.default // 注意
  createStoreMap = m.exports.createStoreMap
})

const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson()
    return result
  }, {})
}

module.exports = function (app) {
//  使用代理将静态全部代理到webpack-dev-server上
  app.use('/public', proxy({
    target: 'http://localhost:8888'
  }))

  //  服务端渲染返回结果给浏览器端
  app.get('*', function (req, res) {
    getTemplate().then(template => {

      const routerContext = {}
      const stores = createStoreMap()
      const app = serverBundle(stores, routerContext, req.url)

      asyncBopotstrap(app).then(() => {
        if (routerContext.url) {
          res.status(302).setHeader('Location', routerContext.url)
          res.end()
          return
        }
        const helmet = Helmet.rewind()
        console.log(stores.appState.count)
        const state = getStoreState(stores)
        const content = ReactDomServer.renderToString(app)

        const html = ejs.render(template, {
          appString: content,
          initialState: serialize(state),
          meta: helmet.meta.toString(),
          title: helmet.title.toString(),
          style: helmet.style.toString(),
          link: helmet.link.toString(),
        })

        // res.send(template.replace('<!--app-->', content))
        res.send(html)
      })
    })
  })
}

// 由于采用asyncBootstrap 来对组件的一些状态进行初始化。
// 这时候会出现一个问题：
// 服务端的store内容变化了。 但是客户端的没有变化。 导致客户端报错：
// Warning: Text content did not match. Server: "SYL say count is 3" Client: "SYL say count is 0"
// store信息不同步
