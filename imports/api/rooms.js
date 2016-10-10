import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

export const Rooms = new Mongo.Collection('rooms')

if (Meteor.isServer) {
  Meteor.publish('rooms', () => {
    return Rooms.find()
  })

  Meteor.publish('nearRooms', (latlng) => {
    return Rooms.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: latlng
          },
          $maxDistance: 20000 //meters
        }
      }
    })
  })
}

NonEmptyString = Match.Where(function (x) {
  check(x, String)
  return x.length > 0
})

Meteor.methods({
  'rooms.new'(name) {
    check(name, NonEmptyString)

    if (!this.userId) {
      throw new Meteor.Error('not-authorized')
    }

    var user = Meteor.users.findOne(this.userId)
    if (!user.location || !user.location.coordinates) {
      throw new Meteor.Error('not-user-position')
    }

    var roomId = Rooms.insert({
      name: name,
      createdAt: new Date(), // current time
      users: [],
      location: {
          type: 'Point',
          coordinates: [user.location.coordinates[0], user.location.coordinates[1]]
       }
    })
    if(roomId) {
      Meteor.call('rooms.addUser', roomId)
    }
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
    check(newName, NonEmptyString)

    if (!this.userId) {
      throw new Meteor.Error('not-authorized')
    }
    Rooms.update(roomId, {
      $set: { name: newName },
    })
  },
  'rooms.addUser'(roomId) {
    check(roomId, String)
    if (!this.userId) {
      throw new Meteor.Error('not-authorized')
    }
    Rooms.update(roomId, {
      $addToSet: { users: this.userId }
    })
    Meteor.users.update(this.userId, {
      $addToSet: { rooms: roomId }
    })
  },
  'rooms.removeUser'(roomId) {
    check(roomId, String)
    if (!this.userId) {
      throw new Meteor.Error('not-authorized')
    }
    Rooms.update(roomId, {
      $pull: { users: this.userId }
    })
    Meteor.users.update(this.userId, {
      $pull: { rooms: roomId }
    })
  }
})
