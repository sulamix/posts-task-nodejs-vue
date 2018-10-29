'use strict'

var express = require('express')
var postRoutes = express.Router()
var models = require('../models')

// get all post api
postRoutes.route('/all').get(function (req, res, next) {
  //models.User.findOne({ include: [{ all: true }]});
  models.sequelize.query('SELECT friendId FROM userfriend WHERE userId = ?', { raw: true ,replacements: [req.session.userId]})
    .spread((results, metadata) => {
      var friendsIdsArr = [];
      for (let idObj of results) {
        friendsIdsArr.push(idObj.friendId)
      }
      // Post.findAll({
      //   where: {
      //     [Op.or]: [{authorId: 12}, {authorId: 13}]
      //   }
      // });
      models.Post.findAll({
          where: { userId: friendsIdsArr },
          include: [{ model: models.User, attributes: ['name'] }],
          order: [
            ['createdAt', 'DESC']
          ]
        })
        .then(posts => {
          return res.json(posts) // return all posts to the client as json object
        })
    })
})

// add a post api
postRoutes.route('/add').post(function (req, res) {
  models.Post.create({ text: req.body.text, userId: req.session.userId})
    .then(post => {
      res.status(200).json(post)
    })
    .catch(err => {
      res.status(400).send('Unable to create post')
    });
})

module.exports = postRoutes
