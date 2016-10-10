import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { Messages } from '../imports/api/messages.js'
import { Rooms } from '../imports/api/rooms.js'
import '../imports/api/users.js'

Accounts.onCreateUser(function(options, user) {
  if (options.location) {
    user.location = options.location
  }
  if (options.name) {
    user.name = options.name
  }
  if (options.birth_date) {
    user.birth_date = options.birth_date
  }
  if (options.address) {
    user.address = options.address
  }
  if (options.blood_type) {
    user.blood_type = options.blood_type
  }
  if (options.credit_card) {
    user.credit_card = options.credit_card
  }
  user.rooms = []
  user.arquicoins = 0
  return user
})

Meteor.startup(() => {
  // code to run on server at startup
  Rooms._ensureIndex({ location : '2dsphere' })
})
