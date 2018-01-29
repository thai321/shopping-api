module.exports = {
  development: {
    username: 'ThaiNguyen',
    password: null,
    database: 'shoppingCart_development',
    host: '127.0.0.1',
    dialect: 'postgres',
    logging: false
  },
  test: {
    username: 'ThaiNguyen',
    password: null,
    database: 'shoppingCart_development',
    host: '127.0.0.1',
    dialect: 'postgres',
    logging: false
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    username: 'thai',
    password: null,
    database: 'shoppingCart_production',
    host: 'shoppingcartnode.herokuapp.com',
    dialect: 'postgres',
    logging: false
  }
};
