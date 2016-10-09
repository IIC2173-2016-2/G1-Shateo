import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { Messages } from '../imports/api/messages.js'
import { Rooms } from '../imports/api/rooms.js'
import '../imports/api/users.js'

Accounts.onCreateUser(function(options, user) {
  if (options.location) {
    user.location = options.location
  }
  user.rooms = []
  return user
})

Meteor.startup(() => {
  // code to run on server at startup
  Rooms._ensureIndex({ location : '2dsphere' })
})
