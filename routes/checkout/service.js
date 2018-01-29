module.exports = {
  requireSignin,
  sendTextMessage,
  sendMail
};

const {
  stripePublishableKey,
  stripeSecretKey,
  twilioAccountSID,
  twilioAuthToken,
  SENDGRID_API_KEY
} = require('../../config/keys_dev');

const client = require('twilio')(twilioAccountSID, twilioAuthToken);
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);

function requireSignin(req, res, next) {
  if (req.isAuthenticated()) return next();

  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}

function sendTextMessage({ name, moneyFormat, date, phone }) {
  if (phone) {
    client.messages.create({
      to: `+1${phone}`,
      from: '+18312467082',
      body: `TESTING SMS: Hello ${name}! This is the order confirmation of ${moneyFormat}, ${date}. Thank you for your order.`
    });
    return 'Sent Text Message sent';
  } else {
    return 'User did not provide a phone number';
  }
}

function sendMail({ name, email, moneyFormat, date }) {
  const msg = {
    to: email,
    from: 'TestCheckoutOrder@pathover.com',
    subject: 'Testing Checkout',
    text: `TESTING EMAIL: Hello ${name}, this is the order confirmation of ${moneyFormat}, ${date}. Thank you for your order.`,
    html: `<strong>TESTING EMAIL: Hello ${name}! This is the order confirmation of ${moneyFormat}, ${date}. Thank you for your order.</strong>`
  };
  sgMail.send(msg);
  return 'Sent the comfirmation mail';
}
