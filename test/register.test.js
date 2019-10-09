const chai = require("chai");
const faker = require("faker");

const axios = require("../utils/http");
const User = require("../models/user.model");

const apiRegister = "/api/users";

const expect = chai.expect;

const headers = {};

describe("#POST /users", () => {
  describe("Register fail", () => {
    async function testRegisterFail(user) {
      const res = await axios.post(apiRegister, user, headers);

      expect(res.status).eql(422);
      expect(res.data).have.property("errors");
      expect(res.data.errors).is.an("object");
    }

    describe("Missing infomation", () => {
      it("Empty all", async () => {
        await testRegisterFail({});
      });

      it("Empty password and username", async () => {
        await testRegisterFail({
          user: {
            email: faker.internet.email()
          }
        });
      });

      it("Empty email and username", async () => {
        await testRegisterFail({
          user: {
            password: faker.internet.password()
          }
        });
      });

      it("Empty email and password", async () => {
        await testRegisterFail({
          user: {
            username: faker.internet.userName()
          }
        });
      });

      it("Empty username", async () => {
        await testRegisterFail({
          user: {
            email: faker.internet.email(),
            password: faker.internet.password()
          }
        });
      });

      it("Empty password", async () => {
        await testRegisterFail({
          user: {
            email: faker.internet.email(),
            username: faker.internet.userName()
          }
        });
      });

      it("Empty email", async () => {
        await testRegisterFail({
          user: {
            password: faker.internet.password(),
            username: faker.internet.userName()
          }
        });
      });
    });

    describe("Incorrect format", () => {
      it("Wrong email format", async () => {
        await testRegisterFail({
          user: {
            email: "huy",
            password: faker.internet.password(),
            username: faker.internet.userName()
          }
        });
      });

      it("Wrong password format", async () => {
        await testRegisterFail({
          user: {
            email: faker.internet.email(),
            password: faker.internet.password(2),
            username: faker.internet.userName()
          }
        });
      });

      it("Username has special characters", async () => {
        await testRegisterFail({
          user: {
            email: faker.internet.email(),
            password: faker.internet.password(),
            username: `${faker.internet.userName()}@@`
          }
        });
      });
    });

    describe("Account has been registered", () => {
      it("Email has been registered", async () => {
        await testRegisterFail({
          user: {
            email: "caohuy@gmail.com",
            password: faker.internet.password(),
            username: faker.internet.userName()
          }
        });
      });

      it("Username has been register", async () => {
        await testRegisterFail({
          user: {
            email: faker.internet.email(),
            password: faker.internet.password,
            username: "caohuy"
          }
        });
      });

      it("Both email and username has been register", async () => {
        await testRegisterFail({
          user: {
            email: "caohuy@gmail.com",
            password: faker.internet.password(),
            username: "caohuy"
          }
        });
      });
    });
  });

  describe("Register success", () => {
    async function testRegisterSuccess(user) {
      return await axios.post(apiRegister, user, headers);
    }

    afterEach(async () => {
      await User.where({ email: "testregis@gmail.com" }).destroy();
    });

    it("Check data return", async () => {
      const res = await testRegisterSuccess({
        user: {
          email: "testregis@gmail.com",
          password: "122222222",
          username: "test"
        }
      });
      expect(res.status).eql(200);
      expect(res.data.user).is.an("object");
      expect(res.data.user).have.property("email");
      expect(res.data.user).have.property("username");
      expect(res.data.user).have.property("bio");
      expect(res.data.user).have.property("image");
      expect(res.data.user).have.property("token");
      expect(res.data.user.email).is.not.null;
      expect(res.data.user.username).is.not.null;
      expect(res.data.user.token).is.not.null;
    });

    it("Check data in database", async () => {
      const res = await testRegisterSuccess({
        user: {
          email: "testregis@gmail.com",
          password: "122222222",
          username: "test"
        }
      });
      const { data } = res;
      const userInDB = await User.where({ email: data.user.email }).fetch();
      const { email, username, bio, image } = userInDB.toJSON();
      expect(res.status).eql(200);
      expect(data.user.email).eql(email);
      expect(data.user.username).eql(username);
      expect(data.user.bio).eql(bio);
      expect(data.user.image).eql(image);
    });
  });
});
