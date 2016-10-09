import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

export const Rooms = new Mongo.Collection('rooms')

if (Meteor.isServer) {
  Meteor.publish('rooms', () => {
    return Rooms.find()
  })
}

Meteor.methods({
  'rooms.new'(name) {
    check(name, String)

    if (!this.userId) {
      throw new Meteor.Error('not-authorized')
    }

    Rooms.insert({
      name: name,
      createdAt: new Date(), // current time
      users: [this.userId]
    })
  },
  'rooms.remove'(roomId) {
    check(roomId, String)
    if (!this.userId) {
      throw new Meteor.Error('not-authorized')
    }
    Rooms.remove(roomId)
  },
  'rooms.updateName'(roomId, newName) {
    check(roomId, String)
    check(newName, String)
    if (!this.userId) {
      throw new Meteor.Error('not-authorized')
    }
    Rooms.update(roomId, {
      $set: { name: newName },
    })
  },
  'rooms.addUser'(roomId) {
    check(roomId, String)
    check(roomId, String)
    if (!this.userId) {
      throw new Meteor.Error('not-authorized')
    }
    Rooms.update(roomId, {
      $addToSet: { users: this.userId },
    })
  }
})
