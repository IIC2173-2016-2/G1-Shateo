import React, { Component } from 'react'
import { ListGroup, Button } from 'react-bootstrap'
import Room from './Room.jsx'
import './css/RoomList.css'
import { Rooms } from './../api/rooms.js'
import { createContainer } from 'meteor/react-meteor-data'

class RoomList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user_rooms: [],
      rooms: []
    }
    this.handleClickNewRoom = this.handleClickNewRoom.bind(this)
    this.handleClickGlobalRoom = this.handleClickGlobalRoom.bind(this)
  }

  componentWillMount() {

  }

  handleClickNewRoom() {
    Meteor.call('rooms.new', 'Nombre de prueba')
  }

  handleClickGlobalRoom(room) {

  }

  render() {
    return (
      <div className="RoomList">
        <Button className="btn-morado" block onClick={this.handleClickNewRoom}>Nuevo Chat</Button>
        <h3>Participando ({ this.props.rooms.length })</h3>
        <ListGroup>
          {this.props.rooms.map((room) => <Room room={room} key={room._id} onClick={this.props.onClickChatRoom.bind(room)}/>) }
        </ListGroup>
        <h3>Cercanos ({ this.props.nearRooms.length })</h3>
        <ListGroup>
          {this.props.nearRooms.map((room) => <Room room={room} key={room._id} onClick={this.handleClickGlobalRoom}/>) }
        </ListGroup>
      </div>
    );
  }
}

RoomList.PropTypes = {
  currentUser: React.PropTypes.object.isRequired,
  onClickChatRoom: React.PropTypes.func.isRequired,
  rooms: React.PropTypes.array.isRequired,
  nearRooms: React.PropTypes.array.isRequired
}

export default createContainer(() => {
  var user = Meteor.user()
  return {
    currentUser: user,
    rooms: Rooms.find({}).fetch(),
    nearRooms: Rooms.find({
      location: {
        $near: {
           $geometry: {
              type: 'Point' ,
              coordinates: [ user.location.coordinates[0], user.location.coordinates[1] ]
           },
           $minDistance: 1000
        }
      }
    }).fetch()
  }
}, RoomList)
