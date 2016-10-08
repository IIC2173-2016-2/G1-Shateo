import React, { Component } from 'react'
import { ListGroupItem } from 'react-bootstrap'
import './css/Room.css'

class Room extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <ListGroupItem header={this.props.room.name} className="Room" onClick={() => this.props.onClick(this.props.room)}>
        {this.props.room.name}
      </ListGroupItem>
    )
  }
}

Room.PropTypes = {
  bsRecord: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired
}

export default Room;
