import React, { Component } from 'react'
import Helmet from 'react-helmet'

export default class TopicDetail extends Component {
  componentDidMount() {
    // do something
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>detail</title>
          <meta name="description" content="This is description" />
        </Helmet>
        <span>This is topic detail</span>
      </div>
    )
  }
}
