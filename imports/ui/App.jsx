import React, { Component, PropTypes } from 'react'
import { Col, Tooltip, OverlayTrigger } from 'react-bootstrap'
import RoomList from './RoomList.jsx'
import Chat from './Chat.jsx'
import './css/App.css'
import { createContainer } from 'meteor/react-meteor-data'
import { Rooms } from '../api/rooms.js'
import Room from './Room.jsx'
import AccountsUIWrapper from './AccountsUIWrapper.jsx'
import { Meteor } from 'meteor/meteor'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected_chat_room_id: undefined
    }
    this.handleOnChangeSelectedRoom = this.handleOnChangeSelectedRoom.bind(this)
    this.handleOnQuitRoom = this.handleOnQuitRoom.bind(this)
  }

  componentWillMount() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          Meteor.call('users.update_location',
            position.coords.latitude, position.coords.longitude,
            (errorCode) => this.forceUpdate()
          )
        }, (errorCode) => console.dir(errorCode) )
    }
  }

  handleOnChangeSelectedRoom(roomId) {
    this.setState({ selected_chat_room_id: roomId })
  }

  handleOnQuitRoom(roomId) {
    console.dir(roomId)
    this.setState({ selected_chat_room_id: undefined }, () => {
      Meteor.call('rooms.removeUser', roomId)
    })
  }

  render() {
    var tooltip = <Tooltip id="tooltip"></Tooltip>
    if(this.props.currentUser && this.props.currentUser.location) {
       tooltip = <Tooltip id="tooltip">Lat: {this.props.currentUser.location.coordinates[0].toFixed(2)} Lng: {this.props.currentUser.location.coordinates[1].toFixed(2)}</Tooltip>
    }
    var chatStyle = { }
    if(this.props.currentUser && this.props.currentUser.location) {
      var latLng = this.props.currentUser.location.coordinates[0] + "," + this.props.currentUser.location.coordinates[1]
      chatStyle = {
        backgroundImage: "url('https://maps.googleapis.com/maps/api/staticmap?center=" + latLng + "&size=512x512&zoom=11&scale=2&maptype=satellite&markers=color:blue||" + latLng + "')"
      }
    }
    var roomList
    if(this.props.currentUser && this.props.currentUser.location) {
      roomList = <RoomList onClickChatRoom={this.handleOnChangeSelectedRoom}/>
    } else {
      roomList = <div className="loading">
        <i className="fa fa-spinner fa-pulse fa-fw"></i>&nbsp;
        Cargando ubicación ...
      </div>
    }
    return (
      <div className="App">
        <Col xs={4} md={3} className="full_height sidebar-wrapper">
          <ul className="sidebar-nav">
            <li className="sidebar-brand">
              <OverlayTrigger placement="bottom" overlay={tooltip}>
                <i className="fa fa-globe fa-lg" aria-hidden="true"></i>
              </OverlayTrigger>
              &nbsp;
              GeoChat
            </li>
            {
              (this.props.currentUser) ?
              <div>
                <div className="text-center user-info">
                  <li>{this.props.currentUser.emails[0].address}</li>
                  <li><i className="fa fa-btc" aria-hidden="true"></i> {this.props.currentUser.arquicoins}</li>
                </div>
                {roomList}
              </div> : <AccountsUIWrapper />
            }
            </ul>
        </Col>
        <Col xs={8} md={9} className="full_height chat_space" style={chatStyle}>
        	{this.state.selected_chat_room_id ? <Chat roomId={this.state.selected_chat_room_id} handleOnQuitRoom={this.handleOnQuitRoom} /> : ''}
        </Col>
      </div>
    )
  }
}

App.propTypes = {
}

export default createContainer(() => {
  Meteor.subscribe('messages')
  Meteor.subscribe('rooms')
  Meteor.subscribe('userData')
  Meteor.subscribe('allUserData')
  Meteor.subscribe('userCheckIns')

  var user = Meteor.user()
  if(user && user.location && user.location.coordinates) {
    Meteor.subscribe('allUserData', user.location.coordinates)
  }

  return {
    currentUser: user || undefined
  }
}, App)
