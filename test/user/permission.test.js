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
const { signUpUser, signinUser } = require('../../fixtures/users');

// Urls
const homepage = '/';
const signupUrl = '/user/signup';
const signinUrl = '/user/signin';
const logoutUrl = '/user/logout';
const userProfile = '/user/profile';

const signupAdminUrl = '/admin/signup';
const signinAdminUrl = '/admin/signin';
const logoutAdminUrl = '/admin/logout';
const adminProfile = '/admin/profile';

describe('Routes : User Permission ', () => {
  describe("User Can't get access to the admin routes", () => {
    beforeEach(done => {
      setTimeout(done, 500);
      models.sequelize.sync({ force: true, logging: false }).then(() => {
        return models.Product.create(productData1);
      });
    });

    describe('GET /admin/signup', () => {
      it('should redirect back to User profile', done => {
        authenticatedUser.get(signupUrl).end((err, res1) => {
          const $html = jQuery(res1.text);
          const csrf = $html.find('input[name=_csrf]').val();
          const cookie = res1.headers['set-cookie'];

          authenticatedUser
            .post(signupUrl)
            .set('cookie', cookie)
            .send({
              _csrf: csrf,
              ...signUpUser
            })
            .end((err, res2) => {
              expect(res2.header.location).to.equal(userProfile);
              expect(res2.status).to.equal(302);

              models.User.findOne({
                where: { email: signUpUser.email }
              }).then(user => {
                expect(user).to.have.property('name', signUpUser.name);
                expect(user).to.have.property('email', signUpUser.email);
                expect(user).to.have.property('phone', signUpUser.phone);

                authenticatedUser.get(signupAdminUrl).end((err, res3) => {
                  expect(res3.header.location).to.equal(userProfile);
                  expect(res3.status).to.equal(302);
                  done();
                }); // END authenticatedUser.get(signupAdminUrl).end((err, res3) => {
              }); // END }).then(user => {
            }); // END .end((err, res2) => {
        }); // END .end((err, res1) => {
      }); // END it('should redirect back to user profile', done => {
    }); // END describe('GET /admin/signup', () => {

    describe('GET /admin/signin', () => {
      it('should redirect back to user profile', done => {
        authenticatedUser.get(signupUrl).end((err, res1) => {
          const $html = jQuery(res1.text);
          const csrf = $html.find('input[name=_csrf]').val();
          const cookie = res1.headers['set-cookie'];

          authenticatedUser
            .post(signupUrl)
            .set('cookie', cookie)
            .send({
              _csrf: csrf,
              ...signUpUser
            })
            .end((err, res2) => {
              expect(res2.header.location).to.equal(userProfile);
              expect(res2.status).to.equal(302);

              models.User.findOne({
                where: { email: signUpUser.email }
              }).then(user => {
                expect(user).to.have.property('name', signUpUser.name);
                expect(user).to.have.property('email', signUpUser.email);
                expect(user).to.have.property('phone', signUpUser.phone);

                authenticatedUser.get(signinAdminUrl).end((err, res3) => {
                  expect(res3.header.location).to.equal(userProfile);
                  expect(res3.status).to.equal(302);
                  done();
                }); // END authenticatedUser.get(signinAdminUrl).end((err, res3) => {
              }); // END }).then(user => {
            }); // END .end((err, res2) => {
        }); // END .end((err, res1) => {
      }); // END it('should redirect back to user profile', done => {
    }); // END describe('GET /admin/signin', () => {

    describe('GET /admin/profile', () => {
      it('should redirect back to user profile', done => {
        authenticatedUser.get(signupUrl).end((err, res1) => {
          const $html = jQuery(res1.text);
          const csrf = $html.find('input[name=_csrf]').val();
          const cookie = res1.headers['set-cookie'];

          authenticatedUser
            .post(signupUrl)
            .set('cookie', cookie)
            .send({
              _csrf: csrf,
              ...signUpUser
            })
            .end((err, res2) => {
              expect(res2.header.location).to.equal(userProfile);
              expect(res2.status).to.equal(302);

              models.User.findOne({
                where: { email: signUpUser.email }
              }).then(user => {
                expect(user).to.have.property('name', signUpUser.name);
                expect(user).to.have.property('email', signUpUser.email);
                expect(user).to.have.property('phone', signUpUser.phone);

                authenticatedUser.get(adminProfile).end((err, res3) => {
                  expect(res3.header.location).to.equal(userProfile);
                  expect(res3.status).to.equal(302);
                  done();
                }); // END authenticatedUser.get(signinAdminUrl).end((err, res3) => {
              }); // END }).then(user => {
            }); // END .end((err, res2) => {
        }); // END .end((err, res1) => {
      }); // END it('should redirect back to user profile', done => {
    }); // END describe('GET /admin/profile', () => {
  }); // END describe("User Can't get access to the admin routes", () => {
}); // END describe('Routes : User Permission ', () => {
