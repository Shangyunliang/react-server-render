const express = require('express')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const session = require('express-session')
const ReactSSR = require('react-dom/server')
const fs = require('fs')
const path = require('path')

const isDev = process.env.NODE_ENV === 'development'

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ entended: false }))

app.use(session({
  maxAge: 10 * 60 * 1000,
  name: 'tid',
  resave: false,
  saveUnintialized: false,
  secret: 'react cnode class'
}))

app.use(favicon(path.join(__dirname, '../favicon.ico')))

// 一定要在服务端渲染之前， 因为服务端渲染都会返回内容
app.use('/api/user', require('./until/handle-login'))
app.use('/api', require('./until/proxy'))

if (!isDev) {
  const serverEntry = require('../dist/server-entry').default
  const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8')
  app.use('/public', express.static(path.join(__dirname, '../dist')))
  app.get('*', function (req, res) {
    const appString = ReactSSR.renderToString(serverEntry)
    const renderString = template.replace('<!--app-->', appString)
    console.log(renderString)
    res.send(renderString)
  })
} else {
  const devStatic = require('./until/dev-static')
  devStatic(app)
}

app.listen(3333, function () {
  console.log('server is listening on 3333')
})
