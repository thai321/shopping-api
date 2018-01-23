'use strict';

const bCrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const constants = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    salt: DataTypes.STRING,
    password: DataTypes.STRING,
    session_token: DataTypes.STRING,
    timezone: DataTypes.STRING,
    cardNumber: DataTypes.STRING,
    mailingAdress: DataTypes.STRING,
    shippingAdress: DataTypes.STRING
  }, {
    timestamp: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      },
    },
    hooks: {
      beforeCreate: (user, options) => {
        const salt = bCrypt.genSaltSync(8);
        user.salt = salt;
        user.password = bCrypt.hashSync(user.password, salt);
      }
    }
  });

  User.prototype.authenticate = function (password){
    if(bCrypt.compareSync(password, this.password)) {
      return this;
    } else {
      return false;
    }
  };

  User.prototype.createToken = function() {
    return jwt.sign({ id: this.id }, constants.JWT_SECRET)
  };

  User.prototype.toJSON = function() {
    return {
      id: this.id,
      username: this.username,
      email: this.email
    };
  };

  User.prototype.toAuthJSON = function() {
    return {
      token: this.createToken(),
      ...this.toJSON()
    };
  };


  return User;
};
