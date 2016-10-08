import React, { Component } from 'react'
import classNames from 'classnames'
import './css/UserListItem.css'
import { createContainer } from 'meteor/react-meteor-data';

class UserListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <li className="user-list-item">
        <div className="user-state bg-primary"></div>
        <div className="user-name">{this.props.user.username}</div>
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
