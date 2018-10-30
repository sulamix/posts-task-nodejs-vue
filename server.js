/* jslint node: true */
'use strict'

var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var morgan = require('morgan')
var cookieParser = require('cookie-parser')
var Sequelize = require('sequelize');
var session = require('express-session');
var sharedsession = require("express-socket.io-session");
var SequelizeStore = require('connect-session-sequelize')(session.Store);
var config = require('./app/Config') // Configuration file
var port = config.APP_PORT || 4000

var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var db = require("./models")

// Sends static files  from the public path directory
app.use(express.static(path.join(__dirname, '/public')))

// Use morgan to log request in dev mode
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())
session = session({
  secret: 'my secret SHHH!',
  resave: true,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: db.sequelize
  })
})
app.use(session);

db.sequelize.sync() // {force: true}
  .then(() => {
    console.log('Database sync and looks fine')

    http.listen(port)
    console.log('App listening on port ' + port)
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  });

app.use('/api/post/', require('./app/PostRoutes'))
app.use('/api/user/', require('./app/UserRoutes'))
app.use('/', require('./app/AuthRoutes'))

var connectedUserData = {}
io.use(sharedsession(session));
io.on('connection', socket=>{
  var userId = socket.handshake.session.userId;
  connectedUserData[userId] = {socketId: socket.id} 

  //get user friends ids and add it to the connectedUserData 
  db.User.findByPk(userId).then(user => { 
    connectedUserData[userId].userName = user.name
    console.log('io connect user ' + user.name + ' id ' + userId)
    user.getFriends({ raw: true, attributes: ['id'] }).then(friends=>{
      connectedUserData[userId].friendsIds = friends.map(f => f.id)
    })
  })
  
  socket.on('add_post', post => {
    var user_data = connectedUserData[userId]
    console.log('io get message from ' + user_data.userName + ' id ' + userId)
    if (!user_data) return
    post.createdAt = new Date()
    post.User = {name: user_data.userName}

    // emit the post message to all user friends
    user_data.friendsIds.forEach(friend_id => {
      var user_data = connectedUserData[userId]
      var friend_data = connectedUserData[friend_id]
      if (friend_data) {
        // user friend connected and can get the post message
        console.log('io emit message to ' + friend_data.userName + ' id ' + friend_id)
        io.to(friend_data.socketId).emit('add_feed', post) 
      }
    })
  });
  
  socket.on('disconnect', function() {
    delete connectedUserData[userId];
  });
});

app.use(function (req, res, next) { // replace with cors middleware: app.use(cors())
    // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:' + port)

    // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

    // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

    // Pass to next layer of middleware
  next()
})

