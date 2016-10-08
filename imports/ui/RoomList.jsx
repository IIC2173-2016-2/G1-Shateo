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
    Rooms.insert({
      name: 'nombre',
      createdAt: new Date(), // current time
      users: []
    });
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
        <h3>Cercanos ({ this.props.rooms.length })</h3>
        <ListGroup>
          {this.props.rooms.map((room) => <Room room={room} key={room._id} onClick={this.handleClickGlobalRoom}/>) }
        </ListGroup>
      </div>
    );
  }
}

RoomList.PropTypes = {
  onClickChatRoom: React.PropTypes.func.isRequired,
  rooms: React.PropTypes.array.isRequired
}

export default RoomList;
