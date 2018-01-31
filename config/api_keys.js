// API Keys
let STRIPE_PUBLIC_KEY,
  STRIPE_SECRET_KEY,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  SENDGRID_API_KEY;

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv').config();
  if (dotenv.error) throw dotenv.error;
}

module.exports = {
  STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY
};
