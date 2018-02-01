async = require('async');
//
// // 1st para in async.each() is the array of items
// async.each(
//   [1, 2, 3],
//   // 2nd param is the function that each item is passed to
//   function(item, callback) {
//     // Call an asynchronous function, often a save() to DB
//     item.someAsyncCall(function() {
//       // Async call is done, alert via callback
//       callback();
//     });
//   },
//   // 3rd param is the function to call when everything's done
//   function(err) {
//     // All tasks are done now
//     doSomethingOnceAllAreDone();
//   }
// );

// const {
//   stripePublishableKey,
//   stripeSecretKey,
//   twilioAccountSID,
//   twilioAuthToken
// } = require('./config/keys_dev');
//
// const client = require('twilio')(twilioAccountSID, twilioAuthToken);
//
// client.messages
//   .create({
//     to: '+14086085237',
//     from: '+18312467082',
//     body: 'Testing Order Checkout'
//   })
//   .then(message => {
//     console.log(message);
//   });

// async.series(
//   [
//     function one({ callback }) {
//       console.log('Call back = ', callback);
//       callback(null, 'one');
//     },
//     function one(callback) {
//       callback(null, 'two');
//     },
//     function one(callback) {
//       callback(null, 'three');
//     }
//   ],
//   function(err, result) {
//     console.log(result);
//     console.log(1);
//   }
// );

// include: [
//   {
//     model: models.Cart,
//     attributes: ['totalPrice', 'totalQuantity', 'items', 'createdAt']
//   }
// ]

const models = require('./models');

models.Order.findAll({
  attributes: {
    include: [
      [models.sequelize.fn('COUNT', models.sequelize.col('userId')), 'no_name']
    ]
  },
  group: ['id']
}).then(orders => {
  console.log(orders);
  return;
});
