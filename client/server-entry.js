import React from 'react'
import { StaticRouter } from 'react-router-dom'
// 服务端渲染加入路由的意义
// 使用这可能从任意路由进入网站， 所以在服务端也必须
// 处理路由跳转。 再返回给客户端的时候就是指定的页面
import { Provider, useStaticRendering } from 'mobx-react'
// 服务端渲染store数据同步的意义
// 每个页面都会有对应的数据，  在服务端渲染时已经请求过对应的数据。
// 所以要让客户端知道这些数据， 在客户端渲染的时候直接使用。
// 而不是通过API再次请求， 造成浪费。
import App from './views/App'

import { createStoreMap } from './store/store'

// 让mobx 在服务端渲染的时候不会重复的数据变换
useStaticRendering(true)

// stores ==> {appStore: xxx}
export default (stores, routerContext, url) => (
  <Provider {...stores}>
    <StaticRouter context={routerContext} location={url}>
      <App />
    </StaticRouter>
  </Provider>
)


export { createStoreMap }
