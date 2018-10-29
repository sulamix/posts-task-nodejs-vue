'use strict'

var express = require('express')
var routes = express.Router()
var models = require('../models')

routes.route('/').get(function (req, res, next) {
  models.User.findById(req.session.userId)
    .then(user => {
      if (user === null) {
        console.log('Not authorized! redirect to login page');
        return res.redirect('/login');
      } else {
        res.sendfile('./public/app.html')
      }
    })
    .catch(err => {return next(error)})
})

routes.route('/login').get(function (req, res, next) {
  res.sendfile('./public/login.html')
})

routes.route('/login').post(function (req, res, next) {
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (req.body.email && req.body.name && req.body.password && req.body.passwordConf) {
    var userData = {
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
    }

    models.User.create(userData)
      .then(user => {
        req.session.userId = user.id;
        req.session.save(err => {
          return res.redirect('/');
        })
      })
      .catch(err => {return next(err);});

  } else if (req.body.logemail && req.body.logpassword) {
    models.User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user.id;
        req.session.save(err => {
          return res.redirect('/');
        }) 
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

routes.route('/logout').get(function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/login');
      }
    });
  }
})

module.exports = routes
