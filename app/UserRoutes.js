'use strict'

var express = require('express')
var routes = express.Router()
var models = require('../models')

// get all users api
routes.route('/all').get(function (req, res, next) {
  const Op = models.Sequelize.Op;
  models.User.findAll({ 
      where: { id: {[Op.ne]: req.session.userId }},
      attributes: { exclude: ['password'] }
    })
    .then(users => {
      res.json(users)
    })  
    .catch(err => {
      res.status(400).send('Unable to load user list')
    })
})

routes.route('/friends').get(function (req, res, next) {
  models.User.findByPk(req.session.userId).then(user => {
    user.getFriends({attributes: { exclude: ['password'] }})
      .then(friends => {
        res.json(friends)
      })
      .catch(err => {
        res.status(400).send('Unable to load friends list')
      })
  })
})

routes.route('/friend_requests').get(function (req, res, next) {
  models.User.findByPk(req.session.userId).then(user => {
    user.getFriendRequests({attributes: { exclude: ['password'] }})
      .then(friends => {
        res.json(friends)
      })
      .catch(err => {
        res.status(400).send('Unable to load friends list')
      })
  })
})

routes.route('/friend_to_approve').get(function (req, res, next) {
  models.User.findAll({
      include: [{
        model: models.User,
        as: 'FriendRequests',
        where: {id: req.session.userId},
        attributes: { exclude: ['password', 'UserFriendRequest'] }
      }],
      attributes: { exclude: ['password', 'UserFriendRequest'] }
    })
    .then(users => {
      res.json(users)
    })
})

// Approve friend request
routes.route('/add_friend').post(function (req, res) {
  models.User.findByPk(req.session.userId).then(user => {
    models.User.findByPk(req.body.friendId).then(friend => {
      // need to change to transaction
      user.addFriend(friend).then(() => {
        friend.addFriend(user).then(()=> {
          friend.removeFriendRequests(user).then(()=>{
            return res.json({})
          })
        })
      })
    })
  })
})

// Add friend request
routes.route('/ask_friend').post(function (req, res) {
  models.User.findByPk(req.session.userId).then(user => {
    models.User.findByPk(req.body.friendId).then(friend => {
      user.addFriendRequest(friend).then(friends => {
        return res.json(friends)
      })
    })
  })
})

module.exports = routes
