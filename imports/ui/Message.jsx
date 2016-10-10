import React, { Component } from 'react'
import moment from 'moment'
import classNames from 'classnames'
import './css/Message.css'
import { createContainer } from 'meteor/react-meteor-data'

class Message extends Component {
  // http://bootsnipp.com/snippets/ZlkBn
  render() {
    return (
      <li className={classNames("message appeared", {"current-user-message": this.props.currentUser._id === this.props.user._id })}>
        <div className="message-user-name">
          <b>{this.props.user.emails[0].address}</b>&nbsp;
          <small>{moment(this.props.data.createdAt).format('LT')}</small>
        </div>
        <div className="text-wrapper">
          <div className="text">{this.props.data.text}</div>
        </div>
      </li>
    )
  }
}

export default createContainer((props) => {
  return {
    currentUser: Meteor.user(),
    user: Meteor.users.findOne(props.data.userId)
  }
}, Message)
