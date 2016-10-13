module.exports = {
  servers: {
    one: {
      host: "assw1.ing.puc.cl",
      username: "administrator",
      password: "geochat1"
    },
    two: {
      host: "assw2.ing.puc.cl",
      username: "administrator",
      password: "Hn$9aZ-4b"
    },
    three: {
      host: "assw3.ing.puc.cl",
      username: "administrator",
      password: "Hr$1udY-9m"
    },
    four: {
      host: "assw4.ing.puc.cl",
      username: "administrator",
      password: "Hd$7wN-5k"
    }
  },

  meteor: {
    name: 'geoChat',
    path: './',
    port: 80,
    servers: {
      two: {}
    },
    buildOptions: {
      serverOnly: true,
      debug: true
    },
    env: {
      ROOT_URL: 'assw2.ing.puc.cl',
      MONGO_URL: 'mongodb://localhost/meteor'
    },
    deployCheckWaitTime: 60
  },

  ssl: {
    port: 443,
    crt: './ssl/fullchain.pem',
    key: './ssl/privkey.pem',
  },

  mongo: {
    oplog: true,
    port: 27017,
    servers: {
      two: {}
    },
  },
};