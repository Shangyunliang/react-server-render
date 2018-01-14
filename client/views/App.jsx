import React, { Component } from 'react'
import {
  Link,
} from 'react-router-dom'
import Routes from '../config/rooter'

// export default () => <div>This is App 123</div>

export default class App extends Component {
  componentDidMount() {
    // do something here
  }

  render() {
    return [
      <div key="banner">
        <Link to="/">首页</Link>
        <br />
        <Link to="/detail">详情页</Link>
      </div>,
      <Routes key="routes" />,
    ]
  }
}
