import React, { Component } from 'react'
import Message from './Message.jsx'
import UserListItem from './UserListItem.jsx'
import { FormControl, FormGroup, InputGroup, Button, Col } from 'react-bootstrap'
import moment from 'moment'
import { createContainer } from 'meteor/react-meteor-data';
import './css/Chat.css'
import { Messages } from './../api/messages.js'

class Chat extends Component {

  constructor(props) {
    super(props);
    this.state = {
      input: '',
      messages: [],
      users: []
    }
    this.handleSendMessage = this.handleSendMessage.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillUnmount() {
    this.unsuscribeListeners()
  }

  handleChange(e) {
    this.setState({ input: e.target.value });
  }

  handleSendMessage(e) {
    e.preventDefault()
    Messages.insert({
      room_id: this.props.room_id,
      text: this.state.input,
      createdAt: new Date(), // current time
    });
    this.setState({ input: '' });
  }

  render() {
    return (
      <div className="chat_box">
        <Col xs={12} md={9} className="chat_messages">
          <div className="chat_top">
            <h4>{this.props.room.name}</h4>
          </div>
          <div className="messages" ref="messages">
            <ul>
              {this.props.messages.map((message) => <Message data={message} key={message._id}/>)}
            </ul>
          </div>
          <div className="chat_input">
            <form onSubmit={this.handleSendMessage}>
              <FormGroup bsSize="large">
                <InputGroup>
                  <FormControl
                    type="text"
                    value={this.state.input}
                    placeholder="Enter text"
                    onChange={this.handleChange}
                    bsSize="large"
                  />
                  <InputGroup.Button>
                    <Button className="btn-morado" bsSize="large" onClick={this.handleSendMessage}>Enviar</Button>
                  </InputGroup.Button>
                </InputGroup>
              </FormGroup>
            </form>
          </div>
          </Col>
          <Col md={3} className="chat_user_list hidden-xs hidden-sm">
            <ul className="user-list">
              {this.props.room.users.map((user) => <UserListItem user={user} key={user}/>)}
            </ul>
          </Col>
      </div>
    )
  }
}

Chat.PropTypes = {
  room: React.PropTypes.object.isRequired,
}

export default createContainer(() => {
  return {
    messages: Messages.find({}).fetch()
  }
}, Chat)
