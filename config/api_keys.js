// API Keys
let STRIPE_PUBLIC_KEY,
  STRIPE_SECRET_KEY,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  SENDGRID_API_KEY;

if (process.env.NODE_ENV === 'production') {
  STRIPE_PUBLIC_KEY = process.env.STRIPE_PUBLIC_KEY;
  STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
  TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
  SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
} else {
  const keys = require('./keys_dev');
  STRIPE_PUBLIC_KEY = keys['STRIPE_PUBLIC_KEY'];
  STRIPE_SECRET_KEY = keys['STRIPE_SECRET_KEY'];
  TWILIO_ACCOUNT_SID = keys['TWILIO_ACCOUNT_SID'];
  TWILIO_AUTH_TOKEN = keys['TWILIO_AUTH_TOKEN'];
  SENDGRID_API_KEY = keys['SENDGRID_API_KEY'];
}

module.exports = {
  STRIPE_PUBLIC_KEY,
  STRIPE_SECRET_KEY,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  SENDGRID_API_KEY
};
