const express = require('express');
const models = require('../../models');
const async = require('async');
const accounting = require('accounting-js');
const moment = require('moment');

const { sendTextMessage, sendMail, requireSignin } = require('./service');
const { STRIPE_PUBLIC_KEY, STRIPE_SECRET_KEY } = require('../../config/config');

const router = express.Router();

router.get('/checkout', requireSignin, (req, res, next) => {
  if (!req.session.cart) return res.redirect('/shopping-cart');

  const errMsg = req.flash('error')[0];
  const { totalPrice, totalQuantity } = req.session.cart;
  res.render('shop/checkout', {
    totalPrice,
    totalQuantity,
    dataAmount: totalPrice * 100,
    errMsg,
    noError: !errMsg,
    stripePublishableKey: STRIPE_PUBLIC_KEY
  }); // END res.render('shop/checkout'
}); // END router.get('/checkout', (req, res, next)

// Charging the customer with Stripe service
router.post('/checkout', requireSignin, (req, res, next) => {
  if (!req.session.cart) return res.redirect('/shopping-cart');

  const { id, name, phone, email } = req.user;
  const { totalPrice } = req.session.cart;
  const stripe = require('stripe')(STRIPE_SECRET_KEY);

  stripe.charges.create(
    {
      amount: totalPrice * 100,
      currency: 'usd',
      source: req.body.stripeToken, // obtained with Stripe.js
      description: 'Testing charge',
      metadata: {
        userName: name,
        email
      }
    },
    (err, charge) => {
      // asynchronously called
      if (err) {
        req.flash('error', err.message);
        return res.redirect('/checkout');
      }

      const orderData = {
        name: charge.metadata.userName,
        email: charge.source.name,
        paymentId: charge.id,
        paymentMethod: charge.source.brand,
        address: charge.source.address_zip,
        amount: charge.amount,
        currency: charge.currency,
        description: charge.description,
        status: charge.status,
        userId: id
      };

      models.Order.create(orderData)
        .then(order => {
          const cartData = Object.assign({}, req.session.cart);
          cartData.order = order.dataValues;
          cartData.userId = id;
          cartData.orderId = order.id;

          models.Cart.create(cartData)
            .then(cart => {
              req.flash('success', 'Successfully bought product!');
              req.session.cart = null;

              const moneyFormat = accounting.format(
                eval(charge.amount / 100),
                2
              );
              const date = moment(order.createdAt).format('LLLL');
              const data = { name, email, moneyFormat, date, phone };

              // Send text message and email to the user for confirmation
              async.series(
                [
                  callback => {
                    callback(null, sendTextMessage(data));
                  },
                  callback => {
                    callback(null, sendMail(data));
                  }
                ],
                (err, result) => {
                  res.redirect('/');
                } // END (err, result) => {
              ); // END async.series(
            }) // END .then(cart => {
            .catch(error => {
              throw error;
            }); // END .catch(error => {
        }) // END models.Order.create(orderData)
        .catch(error => {
          throw error;
        });
    }
  ); // END stripe.charges.create(
}); // END router.post('/checkout', (req, res, next) => {

module.exports = router;
