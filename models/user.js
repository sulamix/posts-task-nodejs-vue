'use strict';
var bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  }, {});

  User.hook('beforeCreate', async function(user) { //TODO: use Promise insted await 
    user.password = await bcrypt.hash(user.password, 10) 
  });

  User.associate = function(models) {
    // associations can be defined here
    User.belongsToMany(User, { as: 'Friends', through: 'UserFriend' });
    User.belongsToMany(User, { as: 'FriendRequests', through: 'UserFriendRequest' });
    // User.hasMany(models.Post, {
    //   as: 'posts',
    // })
  };

  User.authenticate = function (email, password, callback) {
    User.findOne({where:{email: email}})
      .then(user => {
        if (!user) {
          var err = new Error('User not found.');
          err.status = 401;
          return callback(err);
        }
        bcrypt.compare(password, user.password, function (err, result) {
          if (result === true) {
            return callback(null, user);
          } else {
            return callback();
          }
        })
      })
      .catch(err => {
        return callback(err)
      });
  }
  
  return User;
};