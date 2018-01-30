/*
we use authenticatedUser to call the GET route.
The authenticatedUser allows us to access the /profile page successfully.

We use request(app) to call the GET route.
This user is not authenticated,
therefore we expect to be redirected to the /login page.
*/

// Setup for testing
const chai = require('chai');
const request = require('supertest');
const expect = chai.expect;
chai.config.includeStack = true;

// JQuery
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM(`...`);
var jQuery = require('jquery')(window);

// Models and App
const { app } = require('../../app');
const models = require('../../models');

// for authentication request
const authenticatedUser = request.agent(app);

// Fixtures
const { productData1 } = require('../../fixtures/products');
const { signUpAdmin, signinAdmin } = require('../../fixtures/admin');

// Urls
const homepage = '/';
const signupUrl = '/admin/signup';
const signinUrl = '/admin/signin';
const logoutUrl = '/admin/logout';
const adminProfile = '/admin/profile';

const shoppingCartUrl = '/shopping-cart';

describe('Routes : Admin Permission ', () => {
  describe("Admin can't go shopping or can't access to the admin routes", () => {
    // Reset the database and create a new product
    beforeEach(done => {
      setTimeout(done, 500);
      models.sequelize.sync({ force: true, logging: false }).then(() => {
        return models.Product.create(productData1);
      });
    });

    describe('GET /shopping-cart', () => {
      it('should redirect back to the home page', done => {
        authenticatedUser.get(signupUrl).end((err, res1) => {
          const $html = jQuery(res1.text);
          const csrf = $html.find('input[name=_csrf]').val();
          const cookie = res1.headers['set-cookie'];

          authenticatedUser
            .post(signupUrl)
            .set('cookie', cookie)
            .send({
              _csrf: csrf,
              ...signUpAdmin
            })
            .end((err, res2) => {
              expect(res2.header.location).to.equal(adminProfile);
              expect(res2.status).to.equal(302);

              models.Admin.findOne({
                where: { email: signUpAdmin.email }
              }).then(user => {
                expect(user).to.have.property('name', signUpAdmin.name);
                expect(user).to.have.property('email', signUpAdmin.email);
                expect(user).to.have.property('phone', signUpAdmin.phone);

                authenticatedUser.get(shoppingCartUrl).end((err, res3) => {
                  expect(res3.header.location).to.equal(homepage);
                  expect(res3.status).to.equal(302);
                  done();
                }); // END authenticatedUser.get(shoppingCartUrl).end((err, res4) => {
              }); // END }).then(user => {
            }); // END .end((err, res2) => {
        }); // END .end((err, res1) => {
      }); // END it('should redirect back to the home page', done => {
    }); // END describe('GET /shopping-cart', () => {

    describe('GET /reduce/:id', () => {
      const reduceItemUrl = '/reduce/';

      it('should redirect back to the home page', done => {
        authenticatedUser.get(signupUrl).end((err, res1) => {
          const $html = jQuery(res1.text);
          const csrf = $html.find('input[name=_csrf]').val();
          const cookie = res1.headers['set-cookie'];

          authenticatedUser
            .post(signupUrl)
            .set('cookie', cookie)
            .send({
              _csrf: csrf,
              ...signUpAdmin
            })
            .end((err, res2) => {
              expect(res2.header.location).to.equal(adminProfile);
              expect(res2.status).to.equal(302);

              models.Admin.findOne({
                where: { email: signUpAdmin.email }
              }).then(user => {
                expect(user).to.have.property('name', signUpAdmin.name);
                expect(user).to.have.property('email', signUpAdmin.email);
                expect(user).to.have.property('phone', signUpAdmin.phone);

                authenticatedUser.get(`${reduceItemUrl}1`).end((err, res3) => {
                  expect(res3.header.location).to.equal(homepage);
                  expect(res3.status).to.equal(302);
                  done();
                }); // END .end((err, res3) => {
              }); // END }).then(user => {
            }); // END .end((err, res2) => {
        }); // END .end((err, res1) => {
      }); // END it('should redirect back to the home page', done => {
    }); // END describe('GET /reduce/:id', () => {

    describe('GET /remove/:id', () => {
      const removeItemUrl = '/remove/';

      it('should redirect back to the home page', done => {
        authenticatedUser.get(signupUrl).end((err, res1) => {
          const $html = jQuery(res1.text);
          const csrf = $html.find('input[name=_csrf]').val();
          const cookie = res1.headers['set-cookie'];

          authenticatedUser
            .post(signupUrl)
            .set('cookie', cookie)
            .send({
              _csrf: csrf,
              ...signUpAdmin
            })
            .end((err, res2) => {
              expect(res2.header.location).to.equal(adminProfile);
              expect(res2.status).to.equal(302);

              models.Admin.findOne({
                where: { email: signUpAdmin.email }
              }).then(user => {
                expect(user).to.have.property('name', signUpAdmin.name);
                expect(user).to.have.property('email', signUpAdmin.email);
                expect(user).to.have.property('phone', signUpAdmin.phone);

                authenticatedUser.get(`${removeItemUrl}1`).end((err, res3) => {
                  expect(res3.header.location).to.equal(homepage);
                  expect(res3.status).to.equal(302);
                  done();
                }); // END .end((err, res3) => {
              }); // END }).then(user => {
            }); // END .end((err, res2) => {
        }); // END .end((err, res1) => {
      }); // END it('should redirect back to the home page', done => {
    }); // END describe('GET /remove/:id', () => {
  }); // END describe("Routes : Admin can't go shopping ", () => {

  describe("Admin can't access to User routes", () => {
    beforeEach(done => {
      setTimeout(done, 500);
      models.sequelize.sync({ force: true, logging: false }).then(() => {
        return models.Product.create(productData1);
      });
    }); // END beforeEach(done => {

    describe('GET /user/signin', () => {
      const usersigninUrl = '/user/signin';

      it('should redirect back to the home page', done => {
        authenticatedUser.get(signupUrl).end((err, res1) => {
          const $html = jQuery(res1.text);
          const csrf = $html.find('input[name=_csrf]').val();
          const cookie = res1.headers['set-cookie'];

          authenticatedUser
            .post(signupUrl)
            .set('cookie', cookie)
            .send({
              _csrf: csrf,
              ...signUpAdmin
            })
            .end((err, res2) => {
              expect(res2.header.location).to.equal(adminProfile);
              expect(res2.status).to.equal(302);

              models.Admin.findOne({
                where: { email: signUpAdmin.email }
              }).then(user => {
                expect(user).to.have.property('name', signUpAdmin.name);
                expect(user).to.have.property('email', signUpAdmin.email);
                expect(user).to.have.property('phone', signUpAdmin.phone);

                authenticatedUser.get(usersigninUrl).end((err, res3) => {
                  expect(res3.header.location).to.equal(homepage);
                  expect(res3.status).to.equal(302);
                  done();
                }); // END .end((err, res3) => {
              }); // END }).then(user => {
            }); // END .end((err, res2) => {
        }); // END .end((err, res1) => {
      }); // END it('should redirect back to the home page', done => {
    }); // END describe('GET /user/signin', () => {

    describe('GET /user/signup', () => {
      const usersignupUrl = '/user/signup';

      it('should redirect back to the home page', done => {
        authenticatedUser.get(signupUrl).end((err, res1) => {
          const $html = jQuery(res1.text);
          const csrf = $html.find('input[name=_csrf]').val();
          const cookie = res1.headers['set-cookie'];

          authenticatedUser
            .post(signupUrl)
            .set('cookie', cookie)
            .send({
              _csrf: csrf,
              ...signUpAdmin
            })
            .end((err, res2) => {
              expect(res2.header.location).to.equal(adminProfile);
              expect(res2.status).to.equal(302);

              models.Admin.findOne({
                where: { email: signUpAdmin.email }
              }).then(user => {
                expect(user).to.have.property('name', signUpAdmin.name);
                expect(user).to.have.property('email', signUpAdmin.email);
                expect(user).to.have.property('phone', signUpAdmin.phone);

                authenticatedUser.get(usersignupUrl).end((err, res3) => {
                  expect(res3.header.location).to.equal(homepage);
                  expect(res3.status).to.equal(302);
                  done();
                }); // END .end((err, res3) => {
              }); // END }).then(user => {
            }); // END .end((err, res2) => {
        }); // END .end((err, res1) => {
      }); // END it('should redirect back to the home page', done => {
    }); // END describe('GET /user/signup', () => {

    describe('GET /user/profile', () => {
      const userProfileUrl = '/user/profile';

      it('should redirect back to the home page', done => {
        authenticatedUser.get(signupUrl).end((err, res1) => {
          const $html = jQuery(res1.text);
          const csrf = $html.find('input[name=_csrf]').val();
          const cookie = res1.headers['set-cookie'];

          authenticatedUser
            .post(signupUrl)
            .set('cookie', cookie)
            .send({
              _csrf: csrf,
              ...signUpAdmin
            })
            .end((err, res2) => {
              expect(res2.header.location).to.equal(adminProfile);
              expect(res2.status).to.equal(302);

              models.Admin.findOne({
                where: { email: signUpAdmin.email }
              }).then(user => {
                expect(user).to.have.property('name', signUpAdmin.name);
                expect(user).to.have.property('email', signUpAdmin.email);
                expect(user).to.have.property('phone', signUpAdmin.phone);

                authenticatedUser.get(userProfileUrl).end((err, res3) => {
                  expect(res3.header.location).to.equal(homepage);
                  expect(res3.status).to.equal(302);
                  done();
                }); // END .end((err, res3) => {
              }); // END }).then(user => {
            }); // END .end((err, res2) => {
        }); // END .end((err, res1) => {
      }); // END it('should redirect back to the home page', done => {
    }); // END describe('GET /user/signup', () => {
  }); // END describe("Routes : Admin Can't access to User routes", () => {

  describe("Admin can't checkout", () => {
    // Reset the database and create a new product
    beforeEach(done => {
      setTimeout(done, 500);
      models.sequelize.sync({ force: true, logging: false }).then(() => {
        return models.Product.create(productData1);
      });
    });

    describe('GET /checkout', () => {
      it('should redirect back to the admin profile', done => {
        const checkoutUrl = '/checkout';
        authenticatedUser.get(signupUrl).end((err, res1) => {
          const $html = jQuery(res1.text);
          const csrf = $html.find('input[name=_csrf]').val();

          authenticatedUser
            .post(signupUrl)
            .set('cookie', res1.headers['set-cookie'])
            .send({
              _csrf: csrf,
              ...signUpAdmin
            })
            .end((err, res2) => {
              expect(res2.header.location).to.equal(adminProfile);
              expect(res2.status).to.equal(302);

              authenticatedUser.get(checkoutUrl).end((err, res3) => {
                expect(res3.header.location).to.equal(adminProfile);
                expect(res3.status).to.equal(302);
                done();
              }); // END .end((err, res3) => {
            }); // END .end((err, res2) => {
        }); // END .end((err, res1) => {
      }); // END it('should redirect back to the home page', done => {
    }); // END describe.only("GET /checkout", () => {

    describe('POST /checkout', () => {
      it('should redirect back to the admin profile', done => {
        const checkoutUrl = '/checkout';
        authenticatedUser.get(signupUrl).end((err, res1) => {
          const $html = jQuery(res1.text);
          const csrf = $html.find('input[name=_csrf]').val();

          authenticatedUser
            .post(signupUrl)
            .set('cookie', res1.headers['set-cookie'])
            .send({
              _csrf: csrf,
              ...signUpAdmin
            })
            .end((err, res2) => {
              expect(res2.header.location).to.equal(adminProfile);
              expect(res2.status).to.equal(302);

              authenticatedUser.post(checkoutUrl).end((err, res3) => {
                expect(res3.header.location).to.equal(adminProfile);
                expect(res3.status).to.equal(302);
                done();
              }); // END .end((err, res3) => {
            }); // END .end((err, res2) => {
        }); // END .end((err, res1) => {
      }); // END it('should redirect back to the home page', done => {
    }); // END describe.only("GET /checkout", () => {
  }); // END describe("Admin can't checkout", () => {
}); // END describe('Routes : Admin Permission ', () => {
