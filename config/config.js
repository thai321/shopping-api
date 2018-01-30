const DB_CONFIG = require('./db_config');
const API_KEYS = require('./api_keys');

module.exports = {
  // API KEYS
  STRIPE_PUBLIC_KEY: API_KEYS['STRIPE_PUBLIC_KEY'],
  STRIPE_SECRET_KEY: API_KEYS['STRIPE_SECRET_KEY'],
  TWILIO_ACCOUNT_SID: API_KEYS['TWILIO_ACCOUNT_SID'],
  TWILIO_AUTH_TOKEN: API_KEYS['TWILIO_AUTH_TOKEN'],
  SENDGRID_API_KEY: API_KEYS['SENDGRID_API_KEY'],

  // Database configuration environment
  development: DB_CONFIG['development'],
  test: DB_CONFIG['test'],
  production: DB_CONFIG['production'],
  sync: DB_CONFIG['development']
};
