const chai = require("chai");
const faker = require("faker");

const axios = require("../utils/http");
const User = require("../models/user.model");

const apiLogin = "/api/users/login";

const expect = chai.expect;

const headers = {};

describe("#POST /users/login", () => {
  context("Login fail", () => {
    async function testLoginFail(user) {
      const res = await axios.post(apiLogin, user, headers);

      expect(res.status).eql(422);
      expect(res.data).have.property("errors");
      expect(res.data.errors).is.an("object");
    }

    it("Empty email and password", async () => {
      await testLoginFail({});
    });

    it("Empty password", async () => {
      const user = {
        user: {
          email: faker.internet.email()
        }
      };
      await testLoginFail(user);
    });

    it("Empty email", async () => {
      await testLoginFail({
        user: {
          password: faker.internet.password()
        }
      });
    });

    it("Email is not register", async () => {
      await testLoginFail({
        user: {
          email: faker.internet.email(),
          password: faker.internet.password()
        }
      });
    });

    it("Incorrect password", async () => {
      await testLoginFail({
        user: {
          email: "caohuy@gmail.com",
          password: faker.internet.password(2)
        }
      });
    });

    it("Email has sapce", async () => {
      await testLoginFail({
        user: {
          email: "caohuy@gmail.com ",
          password: faker.internet.password(8)
        }
      });
    });

    it("Wrong email format", async () => {
      await testLoginFail({
        user: {
          email: "caohuy",
          password: "12345678"
        }
      });
    });

    it("Check SQL Injection/ XSS", async () => {
      await testLoginFail({
        user: {
          email: "caohuy@gmail.com' OR '1'='1",
          password: "123456787"
        }
      });
    });
  });

  context("Login success", () => {
    it("Login success and return token", async () => {
      const user = {
        user: {
          email: "huyc@gmail.com",
          password: "12345678"
        }
      };
      const res = await axios.post(apiLogin, user, headers);
      const { data } = res;
      expect(res.status).eql(200);
      expect(data.user).is.an("object");
      expect(data.user).have.property("email");
      expect(data.user).have.property("username");
      expect(data.user).have.property("bio");
      expect(data.user).have.property("image");
      expect(data.user).have.property("token");
      expect(data.user.email).is.not.null;
      expect(data.user.username).is.not.null;
      expect(data.user.token).is.not.null;
    });

    it("Check data return", async () => {
      const user = {
        user: {
          email: "huyc@gmail.com",
          password: "12345678"
        }
      };
      const res = await axios.post(apiLogin, user, headers);
      const { data } = res;
      const userInDB = await User.where({ email: data.user.email }).fetch();
      const { email, username, bio, image } = userInDB.toJSON();
      expect(data.user.email).eql(email);
      expect(data.user.username).eql(username);
      expect(data.user.bio).eql(bio);
      expect(data.user.image).eql(image);
    });
  });
});
