'use strict';
const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const models = {
  User: sequelize['import'](path.join(__dirname, 'user')),
  Product: sequelize['import'](path.join(__dirname, 'product')),
  Cart: sequelize['import'](path.join(__dirname, 'cart')),
  Order: sequelize['import'](path.join(__dirname, 'order'))
};

Object.keys(models).forEach(modelName => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
