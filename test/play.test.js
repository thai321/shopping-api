const chai = require("chai");
const request = require("supertest");
const expect = chai.expect;
chai.config.includeStack = true;

describe("Dummy test", () => {
  it("Should pass this one", () => {
    expect(1).to.equal(1);
  });
});
