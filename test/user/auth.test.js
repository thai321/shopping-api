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

describe('Routes : User authentication', () => {
  describe('GET /user/signup', () => {
    // Should render '/user/signup' Sign Up with status code 200
    it('should render the signup page', done => {
      request(app)
        .get(signupUrl)
        .expect(200, done);
    }); // END it('should render the signup page', done => {
  }); // END describe('GET /user/signup', () => {

  describe('POST /user/signup', () => {
    // Reset the database and create a new product
    beforeEach(done => {
      setTimeout(done, 500);
      models.sequelize.sync({ force: true, logging: false }).then(() => {
        return models.Product.create(productData1);
      });
    });

    // Able to signup for new User
    it('should able to singup --> profile', done => {
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
            authenticatedUser.get(userProfile).end((err, res3) => {
              models.User.findOne({
                where: { email: signUpUser.email }
              }).then(user => {
                expect(user).to.have.property('name', signUpUser.name);
                expect(user).to.have.property('email', signUpUser.email);
                expect(user).to.have.property('phone', signUpUser.phone);
                done();
              }); // END }).then(user => {
            }); // END .end((err, res3) => {
          }); // END .end((err, res2) => {
      }); // END .end((err, res1) => {
    }); // END it('should able to singup --> profile', done => {

    // Able to signup for new User, try go to /user/signup, redirect back to /
    it('should able to signup --> profile, try /user/signup ---> /', done => {
      authenticatedUser.get(signupUrl).end((err, res1) => {
        const $html = jQuery(res1.text);
        const csrf = $html.find('input[name=_csrf]').val();

        authenticatedUser
          .post(signupUrl)
          .set('cookie', res1.headers['set-cookie'])
          .send({
            _csrf: csrf,
            ...signUpUser
          })
          .end((err, res2) => {
            expect(res2.header.location).to.equal(userProfile);
            expect(res2.status, 302);

            models.User.findOne({
              where: { email: signUpUser.email }
            }).then(user => {
              expect(user).to.have.property('name', signUpUser.name);
              expect(user).to.have.property('email', signUpUser.email);
              expect(user).to.have.property('phone', signUpUser.phone);

              authenticatedUser
                .get(signupUrl)
                .set('cookie', res2.headers['set-cookie'])
                .send({
                  _csrf: csrf
                })
                .end((err, res3) => {
                  expect(res3.header.location).to.equal(homepage);
                  expect(res3.status, 302);

                  models.User.findAll().then(users => {
                    expect(users).to.be.an('array');
                    expect(users).to.have.lengthOf(1);
                    done();
                  }); // END models.User.findAll().then(users => {
                }); // END .end((err, res3) => {
            }); // END }).then(user => {
          }); // END .end((err, res2) => {
      }); // END .end((err, res1) => {
    }); // it('should able to signup --> profile, try /user/signup ---> /', done => {

    // Can't signup with and existing account
    it('should not able to signup if already a member', done => {
      authenticatedUser.get(signupUrl).end((err, res1) => {
        const $html = jQuery(res1.text);
        const csrf = $html.find('input[name=_csrf]').val();

        authenticatedUser
          .post(signupUrl)
          .set('cookie', res1.headers['set-cookie'])
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

              authenticatedUser
                .get(logoutUrl)
                .set('cookie', res2.headers['set-cookie'])
                .send({
                  _csrf: csrf
                })
                .end((err, res3) => {
                  expect(res3.header.location).to.equal(homepage);
                  expect(res3.status).to.equal(302);

                  authenticatedUser
                    .post(signupUrl)
                    .set('cookie', res3.headers['set-cookie'])
                    .send({
                      _csrf: csrf,
                      ...signUpUser
                    })
                    .end((err, res4) => {
                      expect(res4.header.location).to.equal(signupUrl);
                      expect(res4.status).to.equal(302);

                      models.User.findAll().then(users => {
                        expect(users).to.be.an('array');
                        expect(users).to.have.lengthOf(1);
                        done();
                      }); // END models.User.findAll().then(users => {
                    }); // END .end((err, res4) => {
                }); // END .end((err, res3) => {
            }); // END }).then(user => {
          }); // END .end((err, res2) => {
      }); // END .end((err, res1) => {
    }); // END it('should not able to signup if already a member', done => {
  }); // END describe('POST /user/signup', () => {

  describe('GET /user/signin', () => {
    // Should render '/user/signin' Sign in with status code 200
    it('should render the signin page', done => {
      request(app)
        .get(signinUrl)
        .expect(200, done);
    }); // END it('should render the signin page', done => {

    // Able to signin for a existing user, try go to /user/signin, redirect back to /
    // signup --> logout --> / --> signin --> / since last url is /
  }); // END describe('GET /user/signin', () => {

  describe('POST /user/signin', () => {
    // Reset the database and create a new product
    beforeEach(done => {
      setTimeout(done, 500);
      models.sequelize.sync({ force: true, logging: false }).then(() => {
        return models.Product.create(productData1);
      });
    });

    // Sign in with an existing account
    it('should able to signin --> profile, try /user/signup ---> /', done => {
      authenticatedUser.get(signupUrl).end((err, res1) => {
        let $html = jQuery(res1.text);
        let csrf = $html.find('input[name=_csrf]').val();

        authenticatedUser
          .post(signupUrl)
          .set('cookie', res1.headers['set-cookie'])
          .send({
            _csrf: csrf,
            ...signinUser
          })
          .end((err, res2) => {
            expect(res2.header.location).to.equal(userProfile);
            expect(res2.status).to.equal(302);

            models.User.findOne({
              where: { email: signinUser.email }
            }).then(user => {
              expect(user).to.have.property('name', signinUser.name);
              expect(user).to.have.property('email', signinUser.email);
              expect(user).to.have.property('phone', signinUser.phone);

              authenticatedUser
                .get(logoutUrl)
                .set('cookie', res2.headers['set-cookie'])
                .send({
                  _csrf: csrf
                })
                .end((err, res3) => {
                  expect(res3.header.location).to.equal(homepage);
                  expect(res3.status).to.equal(302);

                  authenticatedUser.get(signinUrl).end((err, res4) => {
                    $html = jQuery(res4.text);
                    csrf = $html.find('input[name=_csrf]').val();

                    authenticatedUser
                      .post(signinUrl)
                      .set('cookie', res2.headers['set-cookie'])
                      .send({
                        _csrf: csrf,
                        ...signinUser
                      })
                      .end((err, res5) => {
                        expect(res5.header.location).to.equal(userProfile);
                        expect(res5.status).to.equal(302);

                        models.User.findAll().then(users => {
                          expect(users).to.be.an('array');
                          expect(users).to.have.lengthOf(1);

                          authenticatedUser.get(userProfile).expect(200, done);
                        }); // END }).then(user => {
                      }); // END .end((err, res5) => {
                  }); // END .end((err, res4) => {
                }); // END .end((err, res3) => {
            }); // END }).then(user => {
          }); // END .end((err, res2) => {
      }); // END .end((err, res1) => {
    }); // it('should able to signin --> profile, try /user/signup ---> /', done => {

    // Can't sign with a wrong email
    it('should NOT able to signin with wrong email', done => {
      authenticatedUser.get(signupUrl).end((err, res1) => {
        let $html = jQuery(res1.text);
        let csrf = $html.find('input[name=_csrf]').val();

        authenticatedUser
          .post(signupUrl)
          .set('cookie', res1.headers['set-cookie'])
          .send({
            _csrf: csrf,
            ...signinUser
          })
          .end((err, res2) => {
            expect(res2.header.location).to.equal(userProfile);
            expect(res2.status).to.equal(302);

            models.User.findOne({
              where: { email: signinUser.email }
            }).then(user => {
              expect(user).to.have.property('name', signinUser.name);
              expect(user).to.have.property('email', signinUser.email);
              expect(user).to.have.property('phone', signinUser.phone);

              authenticatedUser
                .get(logoutUrl)
                .set('cookie', res2.headers['set-cookie'])
                .send({
                  _csrf: csrf
                })
                .end((err, res3) => {
                  expect(res3.header.location).to.equal(homepage);
                  expect(res3.status).to.equal(302);

                  authenticatedUser.get(signinUrl).end((err, res4) => {
                    $html = jQuery(res4.text);
                    csrf = $html.find('input[name=_csrf]').val();

                    authenticatedUser
                      .post(signinUrl)
                      .set('cookie', res2.headers['set-cookie'])
                      .send({
                        _csrf: csrf,
                        email: 'wrong@gmail.com',
                        password: signinUser.password
                      })
                      .end((err, res5) => {
                        expect(res5.header.location).to.equal(signinUrl);
                        expect(res5.status).to.equal(302);

                        models.User.findAll().then(users => {
                          expect(users).to.be.an('array');
                          expect(users).to.have.lengthOf(1);
                          done();
                        }); // END models.User.findAll().then(users => {
                      }); // END .end((err, res5) => {
                  }); // END .end((err, res4) => {
                }); // END .end((err, res3) => {
            }); // END }).then(user => {
          }); // END .end((err, res2) => {
      }); // END .end((err, res1) => {
    }); // END it('should NOT able to signin with wrong email', done => {

    // Can't sign with a wrong password
    it('should NOT able to signin with wrong password', done => {
      authenticatedUser.get(signupUrl).end((err, res1) => {
        let $html = jQuery(res1.text);
        let csrf = $html.find('input[name=_csrf]').val();

        authenticatedUser
          .post(signupUrl)
          .set('cookie', res1.headers['set-cookie'])
          .send({
            _csrf: csrf,
            ...signinUser
          })
          .end((err, res2) => {
            expect(res2.header.location).to.equal(userProfile);
            expect(res2.status).to.equal(302);

            authenticatedUser
              .get(logoutUrl)
              .set('cookie', res2.headers['set-cookie'])
              .send({
                _csrf: csrf
              })
              .end((err, res3) => {
                expect(res3.header.location).to.equal(homepage);
                expect(res3.status).to.equal(302);

                authenticatedUser.get(signinUrl).end((err, res4) => {
                  $html = jQuery(res4.text);
                  csrf = $html.find('input[name=_csrf]').val();

                  authenticatedUser
                    .post(signinUrl)
                    .set('cookie', res2.headers['set-cookie'])
                    .send({
                      _csrf: csrf,
                      email: signinUser.email,
                      password: 'wrong'
                    })
                    .expect('Location', signinUrl)
                    .expect(302, done);
                }); // END .end((err, res4) => {
              }); // END .end((err, res3) => {
          }); // END .end((err, res2) => {
      }); // END .end((err, res1) => {
    }); // END it('should NOT able to signin with wrong password', done => {
  }); // END describe('POST /user/signin', () => {
}); // END describe('Routes : user ', () => {
