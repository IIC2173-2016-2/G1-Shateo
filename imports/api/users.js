import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

if (Meteor.isServer) {
  Meteor.publish('userData', function () {
    this.ready()
    if (!this.userId) {
      throw new Meteor.Error('not-authorized')
    }
    return Meteor.users.find(this.userId)
  })
  Meteor.publish('allUserData', function () {
    return Meteor.users.find({}, {
      fields: {
        'status': 1,
        'emails': 1,
        'location': 1
      }
    })
  })
}

Meteor.methods({
  'users.update_location'(latitude, longitude) {
    check(latitude, Number)
    check(longitude, Number)

    if (!this.userId) {
      throw new Meteor.Error('not-authorized')
    }

    Meteor.users.update(this.userId,
    {
      $set: {
        location: {
            type: 'Point',
            coordinates: [latitude, longitude]
         },
      }
    })
  }
})
