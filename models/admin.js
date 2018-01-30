'use strict';

const bCrypt = require('bcrypt');
const constants = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  var Admin = sequelize.define(
    'admin',
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
      phone: DataTypes.STRING,
      password: DataTypes.STRING
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

  Admin.prototype.authenticate = function(password) {
    if (bCrypt.compareSync(password, this.password)) {
      return this;
    } else {
      return false;
    }
  };

  return Admin;
};
