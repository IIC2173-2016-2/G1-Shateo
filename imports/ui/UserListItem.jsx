import React, { Component } from 'react'
import classNames from 'classnames'
import './css/UserListItem.css'
import { createContainer } from 'meteor/react-meteor-data';

class UserListItem extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <li className="user-list-item">
        <div className={classNames("user-state ", (this.props.user.status.online ? "bg-online" : "bg-offline"))}></div>
        <div className="user-name">{this.props.user.emails[0].address}</div>
      </li>
    )
  }
}

UserListItem.PropTypes = {
  user: React.PropTypes.object.isRequired
}

export default createContainer((props) => {
  return {
    user: Meteor.users.findOne(props.userId)
  }
}, UserListItem)
