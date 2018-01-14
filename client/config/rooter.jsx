import React from 'react'
import {
  Route,
  Redirect,
} from 'react-router-dom'
// react-router 包括 react-router-native 和 react-router-dom
// 由于我们只做网站. 只引用react-router-dom 即可

import TopicList from '../views/topic-list/index'
import TopicDetail from '../views/topic-detail/index'

// exact 表示必须完全匹配才可以 push=true 表示可退回
// from: string
// A pathname to redirect from.
// This can only be used to match a location when rendering a <Redirect> inside of a <Switch>.
// See <Switch children> for more details.
// Switch 避免/ /about /:user 连续匹配. Switch找到第一个其余不做判断
// import { Switch, Route } from 'react-router'
//
// <Switch>
//  <Route exact path="/" component={Home}/>
//  <Route path="/about" component={About}/>
//  <Route path="/:user" component={User}/>
//  <Route component={NoMatch}/>
// </Switch>

export default () => [
  <Route path="/" render={() => <Redirect to="/list" />} exact key="first" />,
  <Route path="/list" component={TopicList} key="list" />,
  <Route path="/detail" component={TopicDetail} key="detail" />,
]
