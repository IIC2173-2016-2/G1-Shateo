import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { Messages } from '../imports/api/messages.js'
import { Rooms } from '../imports/api/rooms.js'
import { CheckIns } from '../imports/api/checkins.js'
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
  if (options.card_number) {
    user.card_number = options.card_number
  }
  if (options.card_cvv) {
    user.card_cvv = options.card_cvv
  }
  if (options.card_holder_first_name) {
    user.card_holder_first_name = options.card_holder_first_name
  }
  if (options.card_holder_last_name) {
    user.card_holder_last_name = options.card_holder_last_name
  }
  user.rooms = []
  user.arquicoins = 0
  return user
})

Meteor.startup(() => {
  // code to run on server at startup
  Rooms._ensureIndex({ location : '2dsphere' })

  // SSLProxy({
  //    port: 3000, //or 443 (normal port/requires sudo)
  //    ssl : {
  //       key: Assets.getText("fullchain.pem"),
  //       cert: Assets.getText("privkey.pem"),
  //    }
  // })

  Meteor.setInterval(() => {
    CheckIns.find({
        valid: true,
        expires: { $lte: new Date(new Date().getTime() + 24 * 60 * 60 * 1000) }
      }).forEach((checkIn) => {
      Rooms.update(checkIn.roomId, {
        $pull: { users: checkIn.userId }
      })
      Meteor.users.update(checkIn.userId, {
        $pull: { rooms: checkIn.roomId }
      })
      CheckIns.update(checkIn._id, {
        $set: { valid: false }
      })
    })
  }, 1)
})
