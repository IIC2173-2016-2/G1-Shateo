import React, { Component, PropTypes } from 'react'
import { Col, Tooltip, OverlayTrigger } from 'react-bootstrap'
import RoomList from './RoomList.jsx'
import Chat from './Chat.jsx'
import './css/App.css'
import { createContainer } from 'meteor/react-meteor-data'
import { Rooms } from '../api/rooms.js'
import Room from './Room.jsx'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: '',
      longitude: '',
      selected_chat_room: undefined
    }
    this.handleOnChangeSelectedRoom = this.handleOnChangeSelectedRoom.bind(this)
  }

  componentWillMount() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( (position) => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        }, (errorCode) => alert(errorCode) );
    }
  }

  handleOnChangeSelectedRoom(room) {
    this.setState({ selected_chat_room: room })
  }

  render() {
    var tooltip = <Tooltip id="tooltip"></Tooltip>
    if(this.state.latitude) {
       tooltip = <Tooltip id="tooltip">Lat: {this.state.latitude.toFixed(2)} Lng: {this.state.longitude.toFixed(2)}</Tooltip>
    }
    // TODO
    var chatStyle = { }
    if(this.state.latitude !== '' && this.state.longitude !== '') {
      var latLng = this.state.latitude + "," + this.state.longitude
      chatStyle = {
        backgroundImage: "url('https://maps.googleapis.com/maps/api/staticmap?center=" + latLng + "&size=512x512&zoom=11&scale=2&maptype=satellite&markers=color:blue||" + latLng + "')"
      }
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
            <li>
              Usuario #123
            </li>
          	<RoomList onClickChatRoom={this.handleOnChangeSelectedRoom} rooms={this.props.rooms}/>
          </ul>
        </Col>
        <Col xs={8} md={9} className="full_height chat_space" style={chatStyle}>
        	{this.state.selected_chat_room ? <Chat room={this.state.selected_chat_room} /> : ''}
        </Col>
      </div>
    )
  }
}

App.propTypes = {
  rooms: PropTypes.array.isRequired,
}

export default createContainer(() => {
  return {
    rooms: Rooms.find({}).fetch()
  }
}, App)
