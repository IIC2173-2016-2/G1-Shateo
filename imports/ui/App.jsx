import React, { Component, PropTypes } from 'react'
import { Col, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { createContainer } from 'meteor/react-meteor-data'
import { Rooms } from '../api/rooms.js'
import {Gmaps, Marker, InfoWindow, Circle} from 'react-gmaps'


import Room from './Room.jsx'
import RoomList from './RoomList.jsx'
import Chat from './Chat.jsx'

import AccountsUIWrapper from './AccountsUIWrapper.jsx'
import { Meteor } from 'meteor/meteor'
import './css/App.css'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected_chat_room_id: undefined,
      zoom: 11,
      markers: []
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
        }, (errorCode) => alert(errorCode) )
    }
  }

  onMapCreated(map) {
   map.setOptions({
     disableDefaultUI: true
   });
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
    let tooltip = <Tooltip id="tooltip"></Tooltip>
    let center =  {lat: -33.4724727, lng: -70.9100295}
    if(this.props.currentUser && this.props.currentUser.location) {
       tooltip = <Tooltip id="tooltip">Lat: {this.props.currentUser.location.coordinates[0].toFixed(2)} Lng: {this.props.currentUser.location.coordinates[1].toFixed(2)}</Tooltip>
       center = {lat: this.props.currentUser.location.coordinates[0], lng: this.props.currentUser.location.coordinates[1]}
    }
    let chatStyle = { }
    if(this.props.currentUser && this.props.currentUser.location) {
      let latLng = this.props.currentUser.location.coordinates[0] + "," + this.props.currentUser.location.coordinates[1]
      chatStyle = {
        backgroundImage: "url('https://maps.googleapis.com/maps/api/staticmap?center=" + latLng + "&size=512x512&zoom=11&scale=2&maptype=satellite&markers=color:blue||" + latLng + "')"
      }
    }
    let roomList
    if(this.props.currentUser && this.props.currentUser.location) {
      roomList = <RoomList onClickChatRoom={this.handleOnChangeSelectedRoom}/>
    } else {
      roomList = <div className="loading">
        <i className="fa fa-spinner fa-pulse fa-fw"></i>&nbsp;
        Cargando ubicación ...
      </div>
    }

    let marker = {lat: center.lat, lng: center.lng}
    this.state.markers.push(marker)

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
              (this.props.currentUser == undefined) ?
              <AccountsUIWrapper /> :
              <div>
                <div className="text-center user-info">
                  <li>{this.props.currentUser.emails[0].address}</li>
                  <li><i className="fa fa-btc" aria-hidden="true"></i> {this.props.currentUser.arquicoins}</li>
                </div>
                {roomList}
              </div>
            }
            </ul>
        </Col>
        <Col xs={8} md={9} className="full_height chat_space">
        	{this.state.selected_chat_room_id ? <Chat roomId={this.state.selected_chat_room_id}
                                                    handleOnQuitRoom={this.handleOnQuitRoom} /> :
                                                    <Gmaps
                                                      width={'100%'}
                                                      height={'100%'}
                                                      lat={center.lat}
                                                      lng={center.lng}
                                                      zoom={this.state.zoom}
                                                      loadingMessage={'Loading Map...'}
                                                      params={{v: '3.exp', key: 'AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo'}}
                                                      onMapCreated={this.onMapCreated}>
                                                      {this.state.markers.map((marker) =>  <Marker
                                                                                              lat={marker.lat}
                                                                                              lng={marker.lng}
                                                                                              draggable={false}/>) }
                                                    </Gmaps> }
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

  let user = Meteor.user()
  if(user && user.location && user.location.coordinates) {
    Meteor.subscribe('allUserData', user.location.coordinates)
  }

  return {
    currentUser: user || undefined
  }
}, App)
