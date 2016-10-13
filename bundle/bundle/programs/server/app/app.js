var require = meteorInstall({"imports":{"api":{"checkins.js":["meteor/mongo","meteor/meteor","meteor/check",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// imports/api/checkins.js                                                                     //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //
module.export({CheckIns:function(){return CheckIns}});var Mongo;module.import('meteor/mongo',{"Mongo":function(v){Mongo=v}});var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});var check;module.import('meteor/check',{"check":function(v){check=v}});var _this = this;
                                                                                               //
                                                                                               // 1
                                                                                               // 2
                                                                                               // 3
                                                                                               //
var CheckIns = new Mongo.Collection('checkins');                                               // 5
                                                                                               //
if (Meteor.isServer) {                                                                         // 7
  Meteor.publish('userCheckIns', function () {                                                 // 8
    return CheckIns.find({ userId: _this.userId, valid: true });                               // 9
  });                                                                                          // 10
}                                                                                              // 11
                                                                                               //
Meteor.methods({                                                                               // 13
  'checkIns.addNew': function checkInsAddNew(roomId) {                                         // 14
    check(roomId, String);                                                                     // 15
    if (!this.userId) {                                                                        // 16
      throw new Meteor.Error('not-authorized');                                                // 17
    }                                                                                          // 18
    var time = new Date();                                                                     // 19
    CheckIns.insert({                                                                          // 20
      time: new Date(),                                                                        // 21
      expires: new Date(time.getTime() + 24 * 60 * 60 * 1000), //24 * 60 * 60 * 1000, // 1 Day
      userId: this.userId,                                                                     // 23
      roomId: roomId,                                                                          // 24
      valid: true                                                                              // 25
    });                                                                                        // 20
  }                                                                                            // 27
});                                                                                            // 13
/////////////////////////////////////////////////////////////////////////////////////////////////

}],"messages.js":["meteor/mongo","meteor/meteor","meteor/check",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// imports/api/messages.js                                                                     //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //
module.export({Messages:function(){return Messages}});var Mongo;module.import('meteor/mongo',{"Mongo":function(v){Mongo=v}});var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});var check;module.import('meteor/check',{"check":function(v){check=v}});
                                                                                               // 2
                                                                                               // 3
                                                                                               //
var Messages = new Mongo.Collection('messages');                                               // 5
                                                                                               //
if (Meteor.isServer) {                                                                         // 7
  Meteor.publish('messages', function () {                                                     // 8
    return Messages.find();                                                                    // 9
  });                                                                                          // 10
}                                                                                              // 11
                                                                                               //
Meteor.methods({                                                                               // 13
  'messages.new': function messagesNew(roomId, msg) {                                          // 14
    check(roomId, String);                                                                     // 15
    check(msg, String);                                                                        // 16
                                                                                               //
    if (!this.userId) {                                                                        // 18
      throw new Meteor.Error('not-authorized');                                                // 19
    }                                                                                          // 20
                                                                                               //
    Messages.insert({                                                                          // 22
      roomId: roomId,                                                                          // 23
      text: msg,                                                                               // 24
      createdAt: new Date(),                                                                   // 25
      userId: this.userId                                                                      // 26
    });                                                                                        // 22
  }                                                                                            // 28
});                                                                                            // 13
/////////////////////////////////////////////////////////////////////////////////////////////////

}],"rooms.js":["meteor/mongo","meteor/meteor","meteor/check",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// imports/api/rooms.js                                                                        //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //
module.export({Rooms:function(){return Rooms}});var Mongo;module.import('meteor/mongo',{"Mongo":function(v){Mongo=v}});var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});var check;module.import('meteor/check',{"check":function(v){check=v}});
                                                                                               // 2
                                                                                               // 3
                                                                                               //
var Rooms = new Mongo.Collection('rooms');                                                     // 5
                                                                                               //
if (Meteor.isServer) {                                                                         // 7
  Meteor.publish('rooms', function () {                                                        // 8
    return Rooms.find();                                                                       // 9
  });                                                                                          // 10
                                                                                               //
  Meteor.publish('nearRooms', function (latlng) {                                              // 12
    return Rooms.find({ // ya esta ordenado por distancia                                      // 13
      location: {                                                                              // 14
        $near: {                                                                               // 15
          $geometry: {                                                                         // 16
            type: "Point",                                                                     // 17
            coordinates: latlng                                                                // 18
          },                                                                                   // 16
          $maxDistance: 2000 // metros                                                         // 20
        }                                                                                      // 15
      }                                                                                        // 14
    });                                                                                        // 13
  });                                                                                          // 24
}                                                                                              // 25
                                                                                               //
NonEmptyString = Match.Where(function (x) {                                                    // 27
  check(x, String);                                                                            // 28
  return x.length > 0;                                                                         // 29
});                                                                                            // 30
                                                                                               //
Meteor.methods({                                                                               // 32
  'rooms.new': function roomsNew(name) {                                                       // 33
    check(name, NonEmptyString);                                                               // 34
                                                                                               //
    if (!this.userId) {                                                                        // 36
      throw new Meteor.Error('not-authorized');                                                // 37
    }                                                                                          // 38
                                                                                               //
    var user = Meteor.users.findOne(this.userId);                                              // 40
    if (!user.location || !user.location.coordinates) {                                        // 41
      throw new Meteor.Error('not-user-position');                                             // 42
    }                                                                                          // 43
                                                                                               //
    var roomId = Rooms.insert({                                                                // 45
      name: name,                                                                              // 46
      createdAt: new Date(), // current time                                                   // 47
      users: [],                                                                               // 48
      location: {                                                                              // 49
        type: 'Point',                                                                         // 50
        coordinates: [user.location.coordinates[0], user.location.coordinates[1]]              // 51
      }                                                                                        // 49
    });                                                                                        // 45
    if (roomId) {                                                                              // 54
      Meteor.call('rooms.addUser', roomId);                                                    // 55
      Meteor.call('checkIns.addNew', roomId);                                                  // 56
    }                                                                                          // 57
  },                                                                                           // 58
  'rooms.remove': function roomsRemove(roomId) {                                               // 59
    check(roomId, String);                                                                     // 60
    if (!this.userId) {                                                                        // 61
      throw new Meteor.Error('not-authorized');                                                // 62
    }                                                                                          // 63
    Rooms.remove(roomId);                                                                      // 64
  },                                                                                           // 65
  'rooms.updateName': function roomsUpdateName(roomId, newName) {                              // 66
    check(roomId, String);                                                                     // 67
    check(newName, NonEmptyString);                                                            // 68
                                                                                               //
    if (!this.userId) {                                                                        // 70
      throw new Meteor.Error('not-authorized');                                                // 71
    }                                                                                          // 72
    Rooms.update(roomId, {                                                                     // 73
      $set: { name: newName }                                                                  // 74
    });                                                                                        // 73
  },                                                                                           // 76
  'rooms.addUser': function roomsAddUser(roomId) {                                             // 77
    check(roomId, String);                                                                     // 78
    if (!this.userId) {                                                                        // 79
      throw new Meteor.Error('not-authorized');                                                // 80
    }                                                                                          // 81
    Rooms.update(roomId, {                                                                     // 82
      $addToSet: { users: this.userId }                                                        // 83
    });                                                                                        // 82
    Meteor.users.update(this.userId, {                                                         // 85
      $addToSet: { rooms: roomId }                                                             // 86
    });                                                                                        // 85
  },                                                                                           // 88
  'rooms.removeUser': function roomsRemoveUser(roomId) {                                       // 89
    check(roomId, String);                                                                     // 90
    if (!this.userId) {                                                                        // 91
      throw new Meteor.Error('not-authorized');                                                // 92
    }                                                                                          // 93
    Rooms.update(roomId, {                                                                     // 94
      $pull: { users: this.userId }                                                            // 95
    });                                                                                        // 94
    Meteor.users.update(this.userId, {                                                         // 97
      $pull: { rooms: roomId }                                                                 // 98
    });                                                                                        // 97
  }                                                                                            // 100
});                                                                                            // 32
/////////////////////////////////////////////////////////////////////////////////////////////////

}],"users.js":["meteor/mongo","meteor/meteor","meteor/check",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// imports/api/users.js                                                                        //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //
var Mongo;module.import('meteor/mongo',{"Mongo":function(v){Mongo=v}});var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});var check;module.import('meteor/check',{"check":function(v){check=v}});
                                                                                               // 2
                                                                                               // 3
                                                                                               //
if (Meteor.isServer) {                                                                         // 5
  Meteor.publish('userData', function () {                                                     // 6
    this.ready();                                                                              // 7
    if (!this.userId) {                                                                        // 8
      throw new Meteor.Error('not-authorized');                                                // 9
    }                                                                                          // 10
    return Meteor.users.find(this.userId);                                                     // 11
  });                                                                                          // 12
  Meteor.publish('allUserData', function () {                                                  // 13
    return Meteor.users.find({}, {                                                             // 14
      fields: {                                                                                // 15
        'status': 1,                                                                           // 16
        'emails': 1,                                                                           // 17
        'location': 1                                                                          // 18
      }                                                                                        // 15
    });                                                                                        // 14
  });                                                                                          // 21
}                                                                                              // 22
                                                                                               //
Meteor.methods({                                                                               // 24
  'users.update_location': function usersUpdate_location(latitude, longitude) {                // 25
    check(latitude, Number);                                                                   // 26
    check(longitude, Number);                                                                  // 27
                                                                                               //
    if (!this.userId) {                                                                        // 29
      throw new Meteor.Error('not-authorized');                                                // 30
    }                                                                                          // 31
                                                                                               //
    Meteor.users.update(this.userId, {                                                         // 33
      $set: {                                                                                  // 35
        location: {                                                                            // 36
          type: 'Point',                                                                       // 37
          coordinates: [latitude, longitude]                                                   // 38
        }                                                                                      // 36
      }                                                                                        // 35
    });                                                                                        // 34
  }                                                                                            // 42
});                                                                                            // 24
/////////////////////////////////////////////////////////////////////////////////////////////////

}]}},"mup.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// mup.js                                                                                      //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //
module.exports = {                                                                             // 1
  servers: {                                                                                   // 2
    one: {                                                                                     // 3
      host: "assw1.ing.puc.cl",                                                                // 4
      username: "administrator",                                                               // 5
      password: "geochat1"                                                                     // 6
    },                                                                                         // 3
    two: {                                                                                     // 8
      host: "assw2.ing.puc.cl",                                                                // 9
      username: "administrator",                                                               // 10
      password: "Hn$9aZ-4b"                                                                    // 11
    },                                                                                         // 8
    three: {                                                                                   // 13
      host: "assw3.ing.puc.cl",                                                                // 14
      username: "administrator",                                                               // 15
      password: "Hr$1udY-9m"                                                                   // 16
    },                                                                                         // 13
    four: {                                                                                    // 18
      host: "assw4.ing.puc.cl",                                                                // 19
      username: "administrator",                                                               // 20
      password: "Hd$7wN-5k"                                                                    // 21
    }                                                                                          // 18
  },                                                                                           // 2
                                                                                               //
  meteor: {                                                                                    // 25
    name: 'geoChat',                                                                           // 26
    path: './',                                                                                // 27
    port: 80,                                                                                  // 28
    servers: {                                                                                 // 29
      two: {}                                                                                  // 30
    },                                                                                         // 29
    buildOptions: {                                                                            // 32
      serverOnly: true,                                                                        // 33
      debug: true                                                                              // 34
    },                                                                                         // 32
    env: {                                                                                     // 36
      ROOT_URL: 'assw2.ing.puc.cl',                                                            // 37
      MONGO_URL: 'mongodb://localhost/meteor'                                                  // 38
    },                                                                                         // 36
    deployCheckWaitTime: 60                                                                    // 40
  },                                                                                           // 25
                                                                                               //
  ssl: {                                                                                       // 43
    port: 443,                                                                                 // 44
    crt: './ssl/fullchain.pem',                                                                // 45
    key: './ssl/privkey.pem'                                                                   // 46
  },                                                                                           // 43
                                                                                               //
  mongo: {                                                                                     // 49
    oplog: true,                                                                               // 50
    port: 27017,                                                                               // 51
    servers: {                                                                                 // 52
      two: {}                                                                                  // 53
    }                                                                                          // 52
  }                                                                                            // 49
};                                                                                             // 1
/////////////////////////////////////////////////////////////////////////////////////////////////

},"server":{"main.js":["meteor/meteor","meteor/accounts-base","../imports/api/messages.js","../imports/api/rooms.js","../imports/api/checkins.js","../imports/api/users.js",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// server/main.js                                                                              //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //
var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});var Accounts;module.import('meteor/accounts-base',{"Accounts":function(v){Accounts=v}});var Messages;module.import('../imports/api/messages.js',{"Messages":function(v){Messages=v}});var Rooms;module.import('../imports/api/rooms.js',{"Rooms":function(v){Rooms=v}});var CheckIns;module.import('../imports/api/checkins.js',{"CheckIns":function(v){CheckIns=v}});module.import('../imports/api/users.js');
                                                                                               // 2
                                                                                               // 3
                                                                                               // 4
                                                                                               // 5
                                                                                               // 6
                                                                                               //
Accounts.onCreateUser(function (options, user) {                                               // 8
  if (options.location) {                                                                      // 9
    user.location = options.location;                                                          // 10
  }                                                                                            // 11
  if (options.name) {                                                                          // 12
    user.name = options.name;                                                                  // 13
  }                                                                                            // 14
  if (options.birth_date) {                                                                    // 15
    user.birth_date = options.birth_date;                                                      // 16
  }                                                                                            // 17
  if (options.address) {                                                                       // 18
    user.address = options.address;                                                            // 19
  }                                                                                            // 20
  if (options.blood_type) {                                                                    // 21
    user.blood_type = options.blood_type;                                                      // 22
  }                                                                                            // 23
  if (options.credit_card) {                                                                   // 24
    user.credit_card = options.credit_card;                                                    // 25
  }                                                                                            // 26
  user.rooms = [];                                                                             // 27
  user.arquicoins = 0;                                                                         // 28
  return user;                                                                                 // 29
});                                                                                            // 30
                                                                                               //
Meteor.startup(function () {                                                                   // 32
  // code to run on server at startup                                                          //
  Rooms._ensureIndex({ location: '2dsphere' });                                                // 34
                                                                                               //
  Meteor.setInterval(function () {                                                             // 36
    CheckIns.find({                                                                            // 37
      valid: true,                                                                             // 38
      expires: { $lte: new Date(new Date().getTime() + 24 * 60 * 60 * 1000) }                  // 39
    }).forEach(function (checkIn) {                                                            // 37
      Rooms.update(checkIn.roomId, {                                                           // 41
        $pull: { users: checkIn.userId }                                                       // 42
      });                                                                                      // 41
      Meteor.users.update(checkIn.userId, {                                                    // 44
        $pull: { rooms: checkIn.roomId }                                                       // 45
      });                                                                                      // 44
      CheckIns.update(checkIn._id, {                                                           // 47
        $set: { valid: false }                                                                 // 48
      });                                                                                      // 47
    });                                                                                        // 50
  }, 1);                                                                                       // 51
});                                                                                            // 52
/////////////////////////////////////////////////////////////////////////////////////////////////

}]}},{"extensions":[".js",".json",".jsx"]});
require("./mup.js");
require("./server/main.js");
//# sourceMappingURL=app.js.map
