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

describe('Routes : Admin authentication', () => {
  describe('GET /admin/signup', () => {
    // Should render '/user/signup' Sign Up with status code 200
    it('should render the signup page', done => {
      request(app)
        .get(signupUrl)
        .expect(200, done);
    }); // END it('should render the signup page', done => {
  }); // END describe('GET /user/signup', () => {

  describe('POST /admin/signup', () => {
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
              done();
            }); // END }).then(user => {
          }); // END .end((err, res2) => {
      }); // END .end((err, res1) => {
    }); // END it('should able to singup --> profile', done => {

    // Able to signup for new User, try go to /admin/signup, redirect back to /
    it('should able to signup --> profile, try /admin/signup ---> /', done => {
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

            models.Admin.findOne({
              where: { email: signUpAdmin.email }
            }).then(user => {
              expect(user).to.have.property('name', signUpAdmin.name);
              expect(user).to.have.property('email', signUpAdmin.email);
              expect(user).to.have.property('phone', signUpAdmin.phone);

              authenticatedUser
                .get(signupUrl)
                .set('cookie', res2.headers['set-cookie'])
                .send({
                  _csrf: csrf
                })
                .end((err, res3) => {
                  expect(res3.status).to.equal(302);
                  expect(res3.header.location).to.equal('/admin/profile');
                  models.Admin.findAll().then(users => {
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
            ...signUpAdmin
          })
          .end((err, res2) => {
            expect(res2.header.location).to.equal(adminProfile);
            models.Admin.findOne({
              where: { email: signUpAdmin.email }
            }).then(user => {
              expect(user).to.have.property('name', signUpAdmin.name);
              expect(user).to.have.property('email', signUpAdmin.email);
              expect(user).to.have.property('phone', signUpAdmin.phone);

              authenticatedUser
                .get(logoutUrl)
                .set('cookie', res2.headers['set-cookie'])
                .send({
                  _csrf: csrf
                })
                .expect('Location', '/')
                .end((err, res3) => {
                  authenticatedUser
                    .post(signupUrl)
                    .set('cookie', res3.headers['set-cookie'])
                    .send({
                      _csrf: csrf,
                      ...signUpAdmin
                    })
                    .end((err, res4) => {
                      expect(res4.status).to.equal(302);
                      expect(res4.header.location).to.equal(signupUrl);

                      models.Admin.findAll().then(users => {
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

  describe('GET /admin/signin', () => {
    // Should render '/admin/signin' Sign in with status code 200
    it('should render the signin page', done => {
      request(app)
        .get(signinUrl)
        .expect(200, done);
    }); // END it('should render the signin page', done => {

    // Able to signin for a existing admin, try go to /admin/signin, redirect back to /admin/profile
  }); // END describe('GET /admin/signin', () => {

  describe('POST /admin/signin', () => {
    // Reset the database and create a new product
    beforeEach(done => {
      setTimeout(done, 500);
      models.sequelize.sync({ force: true, logging: false }).then(() => {
        return models.Product.create(productData1);
      });
    });

    // Sign in with an existing account
    it('should able to signin --> profile, try /admin/signup ---> /admin/profile', done => {
      authenticatedUser.get(signupUrl).end((err, res1) => {
        let $html = jQuery(res1.text);
        let csrf = $html.find('input[name=_csrf]').val();

        authenticatedUser
          .post(signupUrl)
          .set('cookie', res1.headers['set-cookie'])
          .send({
            _csrf: csrf,
            ...signinAdmin
          })
          .end((err, res2) => {
            expect(res2.header.location).to.equal(adminProfile);
            expect(res2.status).to.equal(302);

            models.Admin.findOne({
              where: { email: signinAdmin.email }
            }).then(user => {
              expect(user).to.have.property('name', signinAdmin.name);
              expect(user).to.have.property('email', signinAdmin.email);
              expect(user).to.have.property('phone', signinAdmin.phone);

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
                        ...signinAdmin
                      })
                      .end((err, res5) => {
                        expect(res5.header.location, adminProfile);
                        expect(res5.status).to.equal(302);
                        models.Admin.findAll().then(users => {
                          expect(users).to.be.an('array');
                          expect(users).to.have.lengthOf(1);

                          authenticatedUser.get(adminProfile).expect(200, done);
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
            ...signinAdmin
          })
          .end((err, res2) => {
            expect(res2.header.location).to.equal(adminProfile);
            expect(res2.status).to.equal(302);

            models.Admin.findOne({
              where: { email: signinAdmin.email }
            }).then(user => {
              expect(user).to.have.property('name', signinAdmin.name);
              expect(user).to.have.property('email', signinAdmin.email);
              expect(user).to.have.property('phone', signinAdmin.phone);

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
                        password: signinAdmin.password
                      })
                      .end((err, res5) => {
                        expect(res5.header.location).to.equal(signinUrl);
                        expect(res5.status).to.equal(302);

                        models.Admin.findAll().then(users => {
                          expect(users).to.be.an('array');
                          expect(users).to.have.lengthOf(1);
                          done();
                        }); // END models.Admin.findAll().then(users => {
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
            ...signinAdmin
          })
          .end((err, res2) => {
            expect(res2.header.location).to.equal(adminProfile);
            expect(res2.status).to.equal(302);

            models.Admin.findOne({
              where: { email: signinAdmin.email }
            }).then(user => {
              expect(user).to.have.property('name', signinAdmin.name);
              expect(user).to.have.property('email', signinAdmin.email);
              expect(user).to.have.property('phone', signinAdmin.phone);

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
                        email: signinAdmin.email,
                        password: 'wrong'
                      })
                      .end((err, res5) => {
                        expect(res5.header.location).to.equal(signinUrl);
                        expect(res5.status).to.equal(302);

                        models.Admin.findAll().then(users => {
                          expect(users).to.be.an('array');
                          expect(users).to.have.lengthOf(1);
                          done();
                        }); // END models.Admin.findAll().then(users => {
                      }); // END .end((err, res5) => {
                  }); // END .end((err, res4) => {
                }); // END .end((err, res3) => {
            }); // END }).then(user => {
          }); // END .end((err, res2) => {
      }); // END .end((err, res1) => {
    }); // END it('should NOT able to signin with wrong password', done => {
  }); // END describe('POST /user/signin', () => {
}); // END describe('Routes : user ', () => {
