module.exports = {
  requireSignin,
  sendTextMessage,
  sendMail
};

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  SENDGRID_API_KEY
} = require('../../config/config');

const models = require('../../models');

const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);

function requireSignin(req, res, next) {
  const isAdmin = req.user instanceof models.Admin ? true : false;
  const loggedin = req.isAuthenticated();

  if (loggedin && !isAdmin) {
    return next();
  } else if (loggedin && isAdmin) {
    res.redirect('/admin/profile');
  } else {
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
  }
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
