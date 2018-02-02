"use strict";

const bCrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const constants = require("../config/constants");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      name: {
        type: DataTypes.STRING,
        validate: {
          min: 4,
          max: 8
        }
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true
        },
        unique: true
      },
      password: DataTypes.STRING,
      phone: DataTypes.STRING,
      session_token: DataTypes.STRING,
      cardNumber: DataTypes.STRING,
      mailingAddress: DataTypes.STRING,
      shippingAdress: DataTypes.STRING,
      timezone: DataTypes.STRING
    },
    {
      hooks: {
        beforeCreate: (user, options) => {
          const salt = bCrypt.genSaltSync(8);
          user.salt = salt;
          user.password = bCrypt.hashSync(user.password, salt);
        }
      }
    }
  );

  User.associate = models => {
    User.hasMany(models.Order, {
      foreignKey: "userId"
    });

    User.hasMany(models.Cart, {
      foreignKey: "userId"
    });
  };

  User.prototype.authenticate = function(password) {
    if (bCrypt.compareSync(password, this.password)) {
      return this;
    } else {
      return false;
    }
  };

  return User;
};
