import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  observer,
  inject,
} from 'mobx-react'
import Helmet from 'react-helmet'
import { AppState } from '../../store/app-state'

@inject('appState')
@observer
export default class TopicList extends Component {
  componentDidMount() {
    // do something
  }

  asyncBootstrap() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.props.appState.count = 3
        resolve(true) // 一定要是 true 或者 false asyncBootstrap 才能判断是否执行成功
      })
    })
  }

  changeName = (event) => {
    this.props.appState.changeName(event.target.value)
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>list</title>
          <meta name="description" content="This is description" />
        </Helmet>
        <input type="text" onChange={this.changeName} />
        <br />
        <span>{this.props.appState.msg}</span>
      </div>
    )
  }
}

TopicList.propTypes = {
  appState: PropTypes.instanceOf(AppState),
}
