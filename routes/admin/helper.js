module.exports = {
  getProducts
};

const models = require('../../models');
const moment = require('moment');

function generateArray(products, items) {
  const arr = [];
  for (let id in items) {
    arr.push(Object.assign(items[id], { title: products[id] }));
  }
  return arr;
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
