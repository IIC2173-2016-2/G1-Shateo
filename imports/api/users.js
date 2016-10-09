import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

if (Meteor.isServer) {
  Meteor.publish('userData', function () {
    if (this.userId) {
      return Meteor.users.find(this.userId)
    } else {
      this.ready()
    }
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
            type: "Point",
            coordinates: [latitude, longitude]
         },
      }
    })
  }
})
