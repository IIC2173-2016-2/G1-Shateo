import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

export const CheckIns = new Mongo.Collection('checkins')

if (Meteor.isServer) {
  Meteor.publish('userCheckIns', () => {
    return CheckIns.find({ userId: this.userId, valid: true })
  })
}

Meteor.methods({
  'checkIns.addNew'(roomId) {
    check(roomId, String)
    if (!this.userId) {
      throw new Meteor.Error('not-authorized')
    }
    var time = new Date()
    CheckIns.insert({
      time: new Date(),
      expires: new Date(time.getTime() + 24 * 60 * 60 * 1000), //24 * 60 * 60 * 1000, // 1 Day
      userId: this.userId,
      roomId: roomId,
      valid: true
    })
  }
})
