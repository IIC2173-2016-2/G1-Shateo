import React, { Component } from 'react'
import Message from './Message.jsx'
import UserListItem from './UserListItem.jsx'
import { FormControl, FormGroup, InputGroup, Button, Col } from 'react-bootstrap'
import moment from 'moment'
import { createContainer } from 'meteor/react-meteor-data'
import './css/Chat.css'
import { Messages } from './../api/messages.js'
import { Rooms } from './../api/rooms.js'
import { Meteor } from 'meteor/meteor'

class Chat extends Component {

  constructor(props) {
    super(props)
    this.state = {
      input: '',
      isEditingName: false,
      editingInput: '',
      moveToBottom: true
    }
    this.handleSendMessage = this.handleSendMessage.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleEditingClick = this.handleEditingClick.bind(this)
    this.handleSubmitNameEdit = this.handleSubmitNameEdit.bind(this)
    this.handleChangeEditingName = this.handleChangeEditingName.bind(this)
  }

  componentDidMount() {
    // Scroll Down
    Messages.find({ roomId: this.props.room._id }).observe({
      added: () => {
        this.setState({ moveToBottom: true })
      }
    })
  }

  componentDidUpdate() {
    if(this.state.moveToBottom) {
      var node = this.refs.messages
      node.scrollTop = node.scrollHeight
      this.setState({ moveToBottom: false })
    }
  }

  handleEditingClick() {
    this.setState({ isEditingName: true })
  }

  handleChange(e) {
    this.setState({ input: e.target.value })
  }

  handleChangeEditingName(e) {
    this.setState({ editingInput: e.target.value })
  }

  handleSendMessage(e) {
    e.preventDefault()
    Meteor.call('messages.new', this.props.room._id, this.state.input)
    this.setState({ input: '' })
  }

  handleSubmitNameEdit(e) {
    e.preventDefault()
    Meteor.call('rooms.updateName', this.props.room._id, this.state.editingInput, () => {
      this.setState({ isEditingName: false })
    })

  }

  render() {
    var editingNameForm = <form onSubmit={this.handleSubmitNameEdit}>
      <input
        className="form-control center-block edit-name-chat"
        type="text"
        onChange={this.handleChangeEditingName}
        defaultValue={this.props.room.name}
        placeholder="Ingrese nombre de la sala"
      />
    </form>
    return (
      <div className="chat_box">
        <Col xs={12} md={9} className="chat_messages">
          <div className="chat_top">
            <h4>{this.state.isEditingName ? editingNameForm : this.props.room.name}</h4>
            <div className="btns-chat-top">
              <button className="btn btn-default btn-chat-top" onClick={this.handleEditingClick}>
                <i className="fa fa-pencil" aria-hidden="true"></i>
              </button>
              <button className="btn btn-default btn-chat-top" onClick={() => this.props.handleOnQuitRoom(this.props.roomId)}>
                <i className="fa fa-sign-out" aria-hidden="true"></i>
              </button>
            </div>
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
              {this.props.room.users.map((userId) => <UserListItem userId={userId} key={userId}/>)}
            </ul>
          </Col>
      </div>
    )
  }
}

Chat.PropTypes = {
  room: React.PropTypes.object.isRequired,
  roomId: React.PropTypes.string.isRequired,
  handleOnQuitRoom: React.PropTypes.func.isRequired
}

export default createContainer((props) => {
  return {
    room: Rooms.findOne(props.roomId),
    messages: Messages.find({ roomId: props.roomId }).fetch(),
    currentUser: Meteor.user()
  }
}, Chat)
