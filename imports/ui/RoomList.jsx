import React, { Component } from 'react'
import { ListGroup, Button, Badge } from 'react-bootstrap'
import Room from './Room.jsx'
import './css/RoomList.css'
import { Rooms } from './../api/rooms.js'
import { createContainer } from 'meteor/react-meteor-data'

class RoomList extends Component {

  constructor(props) {
    super(props);
    let names = ["Tyrion", "Jaime", "Arya", "Cersei", "Daenerys", "Jon Snow"]
    this.state = { names: names }
    this.handleClickNewRoom = this.handleClickNewRoom.bind(this)
    this.handleClickGlobalRoom = this.handleClickGlobalRoom.bind(this)
  }

  componentWillMount() {

  }

  handleClickNewRoom() {
    let items = this.state.names
    Meteor.call('rooms.new', items[Math.floor(Math.random()*items.length)])
  }

  handleClickGlobalRoom(roomId) {
    Meteor.call('rooms.addUser', roomId)
  }

  render() {
    return (
      <div className="RoomList">
        <hr/>
        <Button
          className="btn-morado"
          bsStyle	= "info"
          block onClick={this.handleClickNewRoom}>
          Nuevo Chat
        </Button>
        <hr/>
        <h3>Participando <Badge>{ this.props.currentUser.rooms.length }</Badge></h3>
        <ListGroup>
          {this.props.currentUser.rooms.map((roomId) => <Room roomId={roomId} key={roomId} onClick={this.props.onClickChatRoom}/>) }
        </ListGroup>
        <hr/>
        <h3>Cercanos <Badge>{ this.props.nearRooms.length }</Badge></h3>
        <ListGroup>
          {this.props.nearRooms.map((room) => <Room roomId={room._id}
                                                    key={room._id}
                                                    onClick={this.handleClickGlobalRoom}/>) }
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
