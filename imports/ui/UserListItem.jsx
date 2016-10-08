import React, { Component } from 'react'
import classNames from 'classnames'
import './css/UserListItem.css'

class UserListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    }
  }

  render() {
    return (
      <li className="user-list-item">
        <div className="user-state bg-primary"></div>
        <div className="user-name">1</div>
      </li>
    )
  }
}

UserListItem.PropTypes = {
  dsRecord: React.PropTypes.string.isRequired
}

export default UserListItem;
