import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { Client } from 'node-rest-client'

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
  Meteor.methods({
  'user.buy_arquicoins'(amount) {
    console.dir("Compra de " + amount)
    check(amount, Number)
    var client = new Client()
    var user = Meteor.users.findOne(this.userId)
    Future = Npm.require('fibers/future')
    var future = new Future();
    console.dir("enviando")
    client.post(
      "https://alquitran.ing.puc.cl/transactions/",
      {
        data: {
            "application_token": "3b8c6c31-a583-41c8-8da6-ce7961acff40",
            "kredit_card": {
                "card_number": user.card_number,
                "card_cvv": user.card_cvv,
                "card_holder": {
                    "first_name": user.card_holder_first_name,
                    "last_name": user.card_holder_last_name
                }
            },
            "to_charge": {
                "currency": "CLP",
                "amount": amount
            }
        },
        headers: { "Content-Type": "application/json" }
      },
      Meteor.bindEnvironment((data, response) => {
        console.dir("lol")
        if(response.statusCode != 201) {
          future.throw(new Meteor.Error( 400, "La Tarjeta de credito ingresada es invalida" ))
          return
        }
        // Aumentamos a usuario
        Meteor.users.update(this.userId, {
          $inc: { arquicoins: amount }
        })
        Meteor.users.update(this.userId, {
          $addToSet: { transactions: data }
        })
        future.return(data)
      })
    )
    return future.wait()
  }
    // Si todo bien
    // client.get("https://alquitran.ing.puc.cl/transactions/id/?application_token=3b8c6c31-a583-41c8-8da6-ce7961acff40",
    // {
    //   headers: { "Content-Type": "application/json" }
    // },
    // (data, response) => {
    //   if(response.statusCode != 200) {
    //     return "Hubo error"
    //   }
    //
    //   // parsed response body as js object
    //   console.dir(data);
    //   // raw response
    //   console.dir(response);
    // })
    // Response Body 200 or 404
    // {
    //   "status": {
    //     "transaction_status_code": "EXEC",
    //     "description": "Transaction validated and executed"
    //   }
    // }
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
         }
      }
    })
  },
  'users.enviar_arquicoins'(otherUserId) {
    Meteor.users.update(this.otherUserId, {
      $inc: { arquicoins: 1 }
    })
    Meteor.users.update(this.userId, {
      $inc: { arquicoins: 1 }
    })
  }
})
