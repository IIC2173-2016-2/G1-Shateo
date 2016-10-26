import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import Client from 'node-rest-client'


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
  },
  'user.buy_arquicoins'(amount) {
    var client = new Client()
    client.post("https://alquitran.ing.puc.cl/transactions",
    {
      data: {
          "application_token": "3b8c6c31-a583-41c8-8da6-ce7961acff40",
          "kredit_card": {
              "card_number": "523432-42352-1983",
              "card_cvv": 345
              "card_holder": {
                  "first_name": "Eduardo",
                  "last_name": "McEduardo"
              }
          },
          "to_charge": {
              "currency": "CLP",
              "amount": amount
          }
      },
      headers: { "Content-Type": "application/json" }
    } , (data, response) => {
      // parsed response body as js object
      console.dir(data);
      // raw response
      console.dir(response);
    })
    // Response Body 200 or 404
    // {
    //   "status": {
    //     "transaction_status_code": "EXEC",
    //     "description": "Transaction validated and executed"
    //   }
    // }
    client.get("https://alquitran.ing.puc.cl/transactions/id?application_token=3b8c6c31-a583-41c8-8da6-ce7961acff40",
    {
      headers: { "Content-Type": "application/json" }
    },
    (data, response) => {
        // parsed response body as js object
        console.dir(data);
        // raw response
        console.dir(response);
    })
    // Response Body 200 or 400, 403, 501
    // {
    //   "to_charge": {
    //     "currency": "CLP",
    //     "amount": 4325
    //   },
    //   "status": {
    //     "transaction_status_code": "EXEC",
    //     "description": "Transaction validated and executed"
    //   }
    // }
  }
})
