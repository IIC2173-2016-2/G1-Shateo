import React, { Component } from 'react'
import { ListGroup, Button } from 'react-bootstrap'
import Room from './Room.jsx'
import './css/RoomList.css'
import { Rooms } from './../api/rooms.js'
import { createContainer } from 'meteor/react-meteor-data'

class RoomList extends Component {

  constructor(props) {
    super(props);
    this.state = { }
    this.handleClickNewRoom = this.handleClickNewRoom.bind(this)
    this.handleClickGlobalRoom = this.handleClickGlobalRoom.bind(this)
  }

  componentWillMount() {

  }

  handleClickNewRoom() {
    Meteor.call('rooms.new', 'Nombre de prueba')
  }

  handleClickGlobalRoom(roomId) {
    Meteor.call('rooms.addUser', roomId)
  }

  render() {
    return (
      <div className="RoomList">
        <Button className="btn-morado" block onClick={this.handleClickNewRoom}>Nuevo Chat</Button>
        <h3>Participando ({ this.props.currentUser.rooms.length })</h3>
        <ListGroup>
          {this.props.currentUser.rooms.map((roomId) => <Room roomId={roomId} key={roomId} onClick={this.props.onClickChatRoom}/>) }
        </ListGroup>
        <h3>Cercanos ({ this.props.nearRooms.length })</h3>
        <ListGroup>
          {this.props.nearRooms.map((room) => <Room roomId={room._id} key={room._id} onClick={this.handleClickGlobalRoom}/>) }
        </ListGroup>
      </div>
    );
  }
}

RoomList.PropTypes = {
  currentUser: React.PropTypes.object.isRequired,
  onClickChatRoom: React.PropTypes.func.isRequired,
  nearRooms: React.PropTypes.array.isRequired
}

export default createContainer(() => {
  var user = Meteor.user()
  return {
    currentUser: user,
    nearRooms: Rooms.find({}).fetch()
  }
}, RoomList)
