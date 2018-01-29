// Setup for testing
const chai = require('chai');
const request = require('supertest');
const expect = chai.expect;
chai.config.includeStack = true;

// JQuery
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM(`...`);
const jQuery = require('jquery')(window);

// Models and App
const { app } = require('../../app');
const models = require('../../models');
const { Session } = models.sequelize.models;

// for authentication request
const authenticatedUser = request.agent(app);

// Fixtures
const { productData1 } = require('../../fixtures/products');
const { userMe } = require('../../fixtures/users');

// Urls
const homepage = '/';
const addToCartUrl = '/add-to-cart/';
const shoppingCartUrl = '/shopping-cart';
const checkoutUrl = '/checkout';
const signinUrl = '/user/signin';
const signupUrl = '/user/signup';

describe('Routes : Checkout', () => {
  describe('Anonymous or no login try to ', function() {
    describe('GET /checkout', function() {
      this.timeout(3000);

      // Reset the database and create a new product
      beforeEach(done => {
        setTimeout(done, 1000);
        models.sequelize.sync({ force: true, logging: false }).then(() => {
          return models.Product.create(productData1);
        });
      });

      it('should not able to checkout, and redirect to signin page', done => {
        request(app)
          .get(homepage)
          .expect(200, done)
          .end((err, res1) => {
            request(app)
              .get(`${addToCartUrl}1`)
              .expect(302, done)
              .end((err, res2) => {
                request(app)
                  .get(shoppingCartUrl)
                  .expect(200, done)
                  .end((err, res3) => {
                    request(app)
                      .get(checkoutUrl)
                      .expect('Location', signinUrl)
                      .expect(302, done)
                      .end((err, res4) => {
                        models.Cart.findAll().then(carts => {
                          expect(carts).to.be.an('array').that.is.empty;
                          done();
                        }); // END models.Cart.findAll().then(carts => {
                      }); // END .end((err, res4) => {
                  }); // END .end((err, res3) => {
              }); // END .end((err, res2) => {
          }); // END .end( (err, res1) => {
      }); // END       it.only('should not able to checkout, and redirect to signin page', done => {
    }); // END describe('GET /add-to-cart/:id', () => {
  }); // END describe('Anonymous or no login', () => {

  describe('Member try to ', function() {
    describe('GET /checkout', function() {
      this.timeout(3000);

      // Reset the database and create a new product
      beforeEach(done => {
        setTimeout(done, 1000);
        models.sequelize.sync({ force: true, logging: false }).then(() => {
          return models.Product.create(productData1);
        });
      });

      it('should able to checkout, redirect to homepage', done => {
        setTimeout(done, 2000);
        authenticatedUser
          .get(signupUrl)
          .expect(200, done)
          .end((err, res1) => {
            let $html = jQuery(res1.text);
            let csrf = $html.find('input[name=_csrf]').val();

            authenticatedUser
              .post(signupUrl)
              .set('cookie', res1.headers['set-cookie'])
              .send({
                _csrf: csrf,
                ...userMe
              })
              .expect('Location', '/user/profile')
              .end((err, res2) => {
                authenticatedUser
                  .get(`${addToCartUrl}1`)
                  .set('cookie', res2.headers['set-cookie'])
                  .send({
                    _csrf: csrf
                  })
                  .expect(302, done)
                  .end((err, res3) => {
                    expect(res3.header.location).to.equal(homepage);
                    authenticatedUser
                      .get(shoppingCartUrl)
                      .expect(200, done)
                      .end((err, res4) => {
                        authenticatedUser
                          .get(checkoutUrl)
                          .expect(200, done)
                          .end((err, res5) => {
                            authenticatedUser
                              .post(checkoutUrl)
                              .send({
                                stripeToken: 'tok_visa'
                              })
                              .end((err, res6) => {
                                models.User.findOne({
                                  where: { id: 1 },
                                  include: [
                                    { model: models.Order },
                                    { model: models.Cart }
                                  ]
                                }).then(user => {
                                  expect(user.orders).to.be.an('array');
                                  expect(user.orders).to.have.lengthOf(1);
                                  expect(user.carts).to.be.an('array');
                                  expect(user.carts).to.have.lengthOf(1);
                                  expect(res6.statusCode).to.equal(302);
                                  expect(res6.header.location).to.equal(
                                    homepage
                                  );
                                }); // END }).then(user => {
                              }); // END .end((err, res6) => {
                          }); // END .end((err, res5) => {
                      }); // END .end((err, res4) => {
                  }); // END .end((err, res3) => {
              }); // END .end((err, res2))
          }); // END .end((err, res1) => {
      }); // AND it('should able to checkout, redirect to homepage', done => {
    }); // END describe('GET /checkout', () => {
  }); // END describe('Member try to ', () => {
}); // END describe('Routes : cart', () => {
