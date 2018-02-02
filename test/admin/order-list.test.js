// Setup for testing
const chai = require("chai");
const request = require("supertest");
const expect = chai.expect;
chai.config.includeStack = true;

// JQuery
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM(`...`);
const jQuery = require("jquery")(window);

// Models and App
const app = require("../../app");
const models = require("../../models");

// for authentication request
const authenticatedUser = request.agent(app);

// Fixtures
const { productData1, productData2 } = require("../../fixtures/products");
const { userMe, signUpUser, signinUser } = require("../../fixtures/users");

// Urls
const homepage = "/";
const addToCartUrl = "/add-to-cart/";
const shoppingCartUrl = "/shopping-cart";
const checkoutUrl = "/checkout";
const signinUrl = "/user/signin";
const signupUrl = "/user/signup";
const logout = "/user/logout";
const userProfile = "/user/profile";

describe("Routes : Admin", function() {
  describe("Intialize 2 products", function() {
    this.timeout(3000);

    // Reset the database and create a new product
    beforeEach(function(done) {
      setTimeout(done, 500);
      models.sequelize.sync({ force: true, logging: false }).then(() => {
        return models.Product.create(productData1).then(product => {
          return models.Product.create(productData2);
        });
      });
    });

    it("Intialize 2 products", function(done) {
      setTimeout(done, 1000);

      request(app)
        .get(homepage)
        .end((err, res1) => {
          expect(res1.status).to.equal(200);
          request(app)
            .get(`${addToCartUrl}1`)
            .end((err, res2) => {
              expect(res2.header.location).to.equal(homepage);
              expect(res2.status).to.equal(302);

              request(app)
                .get(shoppingCartUrl)
                .end((err, res3) => {
                  expect(res3.status).to.equal(200);

                  request(app)
                    .get(checkoutUrl)
                    .end((err, res4) => {
                      expect(res4.header.location).to.equal(signinUrl);
                      expect(res4.status).to.equal(302);

                      models.Cart.findAll().then(carts => {
                        expect(carts).to.be.an("array").that.is.empty;
                        models.Product.findAll().then(products => {
                          expect(products).to.be.an("array");
                          expect(products.length).to.equal(2);
                        }); // END models.Product.findAll().then(products => {
                      }); // END models.Cart.findAll().then(carts => {
                    }); // END .end((err, res4) => {
                }); // END .end((err, res3) => {
            }); // END .end((err, res2) => {
        }); // END .end( (err, res1) => {
    }); // END it('should not able to checkout, and redirect to signin page', done => {
  }); // END describe('Anonymous or no login', () => {

  describe("POST /checkout", function(done) {
    this.timeout(3000);

    // Reset the database and create a new product
    beforeEach(function(done) {
      setTimeout(done, 500);
      models.sequelize.sync({ force: true, logging: false }).then(() => {
        return models.Product.create(productData1).then(product => {
          return models.Product.create(productData2);
        });
      });
    });

    it("should create 2 orders and checkout from two different users, redirect to homepage", function(done) {
      setTimeout(done, 2100);

      authenticatedUser.get(signupUrl).end((err, res1) => {
        expect(res1.status).to.equal(200);

        let $html = jQuery(res1.text);
        let csrf = $html.find("input[name=_csrf]").val();

        authenticatedUser
          .post(signupUrl)
          .set("cookie", res1.headers["set-cookie"])
          .send({
            _csrf: csrf,
            ...signUpUser
          })
          .end((err, res2) => {
            expect(res2.header.location).to.equal(userProfile);
            expect(res2.status).to.equal(302);

            authenticatedUser
              .get(`${addToCartUrl}1`)
              .set("cookie", res2.headers["set-cookie"])
              .send({
                _csrf: csrf
              })
              .end((err, res3) => {
                expect(res3.header.location).to.equal(homepage);
                expect(res3.status).to.equal(302);

                authenticatedUser.get(shoppingCartUrl).end((err, res4) => {
                  expect(res4.status).to.equal(200);

                  authenticatedUser.get(checkoutUrl).end((err, res5) => {
                    expect(res5.status).to.equal(200);
                    authenticatedUser
                      .post(checkoutUrl)
                      .send({
                        stripeToken: "tok_visa"
                      })
                      .end((err, res6) => {
                        models.User.findOne({
                          where: { id: 1 },
                          include: [
                            { model: models.Order },
                            { model: models.Cart }
                          ]
                        }).then(user => {
                          expect(user.orders).to.be.an("array");
                          expect(user.orders).to.have.lengthOf(1);
                          expect(user.carts).to.be.an("array");
                          expect(user.carts).to.have.lengthOf(1);

                          expect(res6.header.location).to.equal(homepage);
                          expect(res6.statusCode).to.equal(302);

                          authenticatedUser.get(logout).end((err, res7) => {
                            expect(res7.statusCode).to.equal(302);
                            expect(res7.header.location).to.equal(homepage);

                            authenticatedUser
                              .get(signupUrl)
                              .end((err, res8) => {
                                expect(res8.status).to.equal(200);

                                $html = jQuery(res8.text);
                                csrf = $html.find("input[name=_csrf]").val();

                                authenticatedUser
                                  .post(signupUrl)
                                  .set("cookie", res1.headers["set-cookie"])
                                  .send({
                                    _csrf: csrf,
                                    ...userMe
                                  })
                                  .end((err, res9) => {
                                    expect(res9.header.location).to.equal(
                                      userProfile
                                    );
                                    expect(res9.statusCode).to.equal(302);

                                    authenticatedUser
                                      .get(`${addToCartUrl}2`)
                                      .set("cookie", res2.headers["set-cookie"])
                                      .send({
                                        _csrf: csrf
                                      })
                                      .end((err, res10) => {
                                        expect(res10.header.location).to.equal(
                                          homepage
                                        );
                                        expect(res10.status).to.equal(302);

                                        authenticatedUser
                                          .get(shoppingCartUrl)
                                          .end((err, res11) => {
                                            expect(res11.statusCode).to.equal(
                                              200
                                            );

                                            authenticatedUser
                                              .get(checkoutUrl)
                                              .end((err, res12) => {
                                                expect(res12.status).to.equal(
                                                  200
                                                );

                                                authenticatedUser
                                                  .post(checkoutUrl)
                                                  .send({
                                                    stripeToken: "tok_visa"
                                                  })
                                                  .end((err, res13) => {
                                                    expect(
                                                      res13.header.location
                                                    ).to.equal(homepage);
                                                    expect(
                                                      res13.statusCode
                                                    ).to.equal(302);

                                                    authenticatedUser
                                                      .get(logout)
                                                      .end((err, res14) => {
                                                        expect(
                                                          res14.statusCode
                                                        ).to.equal(302);
                                                        expect(
                                                          res14.header.location
                                                        ).to.equal(homepage);

                                                        models.Order.findAll().then(
                                                          orders => {
                                                            expect(
                                                              orders
                                                            ).to.be.an("array");
                                                            expect(
                                                              orders.length
                                                            ).to.equal(2);
                                                          }
                                                        );
                                                      }); // END .end((err, res14) => {
                                                  }); // END .end((err, res13) => {
                                              }); // END .end((err, res12) => {
                                          }); // END .end((err, res11) => {
                                      }); // END .end((err, res10) => {
                                  }); // END .end((err, res9) => {
                              }); // END .end((err, res8) => {
                          }); // END authenticatedUser.get(logout).end((err, res7) => {
                        }); // END }).then(user => {
                      }); // END .end((err, res6) => {
                  }); // END .end((err, res5) => {
                }); // END .end((err, res4) => {
              }); // END .end((err, res3) => {
          }); // END .end((err, res2))
      }); // END .end((err, res1) => {
    }); // AND it('should able to checkout, redirect to homepage', done => {
  }); // END describe('GET /checkout', () => {
}); // END describe('Routes : cart', () => {
