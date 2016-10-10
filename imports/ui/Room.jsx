import React, { Component } from 'react'
import { ListGroupItem } from 'react-bootstrap'
import './css/Room.css'
import { Rooms } from './../api/rooms.js'
import { createContainer } from 'meteor/react-meteor-data'
import geolib from 'geolib'

class Room extends Component {

  constructor(props) {
    super(props)
    this.getDistance = this.getDistance.bind(this)
  }

  getDistance() {
    return geolib.getDistanceSimple(
      {
        latitude: this.props.currentUser.location.coordinates[0],
        longitude: this.props.currentUser.location.coordinates[1]
      },
      {
        latitude: this.props.room.location.coordinates[0],
        longitude: this.props.room.location.coordinates[1]
      }
    )
  }

  render() {
    return (
      <ListGroupItem header={this.props.room.name} className="Room" onClick={() => this.props.onClick(this.props.roomId)}>
        {this.props.room.users.length} {this.props.room.users.length == 1 ? 'Usuario' : 'Usuarios'} | {this.getDistance()} Mts
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
    room: Rooms.findOne(props.roomId),
    currentUser: Meteor.user()
  }
}, Room)
