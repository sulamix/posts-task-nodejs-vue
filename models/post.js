'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    text: { type: DataTypes.STRING, allowNull: null },
    date: { type: DataTypes.DATE, defaultValue: sequelize.NOW }
  }, {
    getterMethods: {
      autor: function() {
        return this.getUser().name; 
      }
    }
  });
  Post.associate = function(models) {
    // associations can be defined here
    Post.belongsTo(models.User, {
      foreignKey: 'userId',
      inDelete: 'CASCADE',
    })
  };
  return Post;
};