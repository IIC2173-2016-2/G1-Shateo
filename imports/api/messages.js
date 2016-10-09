import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

export const Messages = new Mongo.Collection('messages')

if (Meteor.isServer) {
  Meteor.publish('messages', () => {
    return Messages.find()
  })
}

Meteor.methods({
  'messages.new'(roomId, msg) {
    check(roomId, String)
    check(msg, String)

    if (!this.userId) {
      throw new Meteor.Error('not-authorized')
    }

    Messages.insert({
      roomId: roomId,
      text: msg,
      createdAt: new Date(),
      userId: this.userId
    })
  }
})
