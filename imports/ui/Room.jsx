import React, { Component } from 'react'
import { ListGroupItem } from 'react-bootstrap'
import './css/Room.css'
import { Rooms } from './../api/rooms.js'
import { createContainer } from 'meteor/react-meteor-data';

class Room extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    console.dir(this.props)
    return (
      <ListGroupItem header={this.props.room.name} className="Room" onClick={() => this.props.onClick(this.props.room)}>
        {this.props.room.users.length} {this.props.room.users.length == 1 ? 'Usuario' : 'Usuarios'}
      </ListGroupItem>
    )
  }
}

Room.PropTypes = {
  room: React.PropTypes.object.isRequired,
  onClick: React.PropTypes.func.isRequired
}


export default createContainer((props) => {
  return {
    room: Rooms.findOne(props.roomId)
  }
}, Room)
