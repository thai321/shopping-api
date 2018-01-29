module.exports = {
  isLoggedIn,
  notLoggedIn,
  getProducts
};

const models = require('../../models');
const { generateArray } = require('./helper');

const moment = require('moment');

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
  }
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) return next();
  res.redirect('/');
}

// Getting the product for each order
function getProducts(order, callback) {
  const date = moment(order.dataValues.createdAt).format('LLLL');
  order.date = date;

  const { items } = order.dataValues.cart;
  const productIds = Object.keys(items);

  models.Product.findAll({
    attributes: ['id', 'title'],
    where: { id: productIds }
  })
    .then(products => {
      let productsObject = {};
      products.forEach(product => {
        productsObject[product.id] = product.title;
      });
      order.items = generateArray(productsObject, items);
      callback();
    }) // END .then(products => {
    .catch(err => callback(err));
} // END (order, callback) => {
