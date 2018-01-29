const express = require('express');
const router = express.Router();

const models = require('../models/');

/* GET home page. */
router.get('/', (req, res, next) => {
  // res.send({ hello: 'hello' });
  models.Product.findAll().then(products => {
    const successMsg = req.flash('success')[0];
    const productChunks = [];
    const chunkSize = 3;
    for (let i = 0; i < products.length; i += chunkSize) {
      productChunks.push(products.slice(i, i + chunkSize));
    }

    res.render('shop/index', {
      title: 'Shopping Cart',
      products: productChunks,
      successMsg,
      noMessage: !successMsg
    }); // END res.render('shop/index'
  }); // END models.Product.findAll().then(products
}); // END router.get('/', (req, res, next)

module.exports = router;
