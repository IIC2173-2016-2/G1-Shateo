import React, { Component } from 'react'
import moment from 'moment'
import './css/Message.css'

class Message extends Component {
  // http://bootsnipp.com/snippets/ZlkBn
  render() {
    return (
      <li className="message appeared">
        <div className="message-user-name">
          <b>{this.props.data.username}</b>&nbsp;
          <small>{moment(this.props.data.datetime).format('LT')}</small>
        </div>
        <div className="text-wrapper">
          <div className="text">{this.props.data.text}</div>
        </div>
      </li>
    )
  }
}

export default Message;
