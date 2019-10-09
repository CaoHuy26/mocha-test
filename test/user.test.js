const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require("faker");

// const axios = require("../utils/http");

const app = "http://167.71.202.52";
const apiGetProfile = "/api/profiles";
const apiUser = "/api/user";

const expect = chai.expect;
chai.use(chaiHttp);

const headers = {
  Accept: "application/json",
  "X-Requested-With": "XMLHttpRequest",
  Authorization:
    "Token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjMsImlzcyI6Imh0dHA6XC9cLzE2Ny43MS4yMDIuNTJcL2FwaVwvdXNlcnNcL2xvZ2luIiwiaWF0IjoxNTcwNTE2NTAyLCJleHAiOjE1NzU3MDA1MDIsIm5iZiI6MTU3MDUxNjUwMiwianRpIjoiWUF1aURSUm8zazNTNHVKOSJ9.NQaocE1-X24L3af0M-ARXTF1LcC14Ke_tB1OhSRktP0"
};

// Get profile
describe("#GET /profiles/{{USERNAME}}", () => {
  describe("GET profile success and return profile", () => {
    it("Success with token", async () => {
      const res = await chai
        .request(app)
        .get(`${apiGetProfile}/johnjacob`)
        .set(headers);

      expect(res.status).to.eql(200);
      expect(res.body.profile).is.an("object");
      expect(res.body.profile).have.property("username");
      expect(res.body.profile).have.property("bio");
      expect(res.body.profile).have.property("image");
      expect(res.body.profile).have.property("following");
      expect(res.body.profile.username).is.not.null;
    });

    it("Success without token", async () => {
      const res = await chai.request(app).get(`${apiGetProfile}/johnjacob`);

      expect(res.status).to.eql(200);
      expect(res.body.profile).is.an("object");
      expect(res.body.profile).have.property("username");
      expect(res.body.profile).have.property("bio");
      expect(res.body.profile).have.property("image");
      expect(res.body.profile).have.property("following");
      expect(res.body.profile.username).is.not.null;
    });
  });

  describe("GET profile fail", () => {
    it("Profile does not exits", async () => {
      const res = await chai
        .request(app)
        .get(`${apiGetProfile}/${faker.internet.userName()}`)
        .set(headers);

      expect(res.status).to.eql(404);
      expect(res.body.errors).is.an("object");
      expect(res.body.errors.message).is.include("No query results");
      expect(res.body.errors.status_code).to.eql(404);
    });

    it("Token is invalid", async () => {
      const res = await chai
        .request(app)
        .get(`${apiGetProfile}/johnjacob`)
        .set({
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          Authorization: "Token Fake"
        });
      expect(res.status).to.eql(401);
      expect(res.body.errors).is.an("object");
      expect(res.body.errors.message).to.have.string(
        "JWT error: Token is invalid"
      );
      expect(res.body.errors.status_code).to.eql(401);
    });
  });
});

// // Get current user
describe("#GET /api/user", () => {
  describe("GET current user success", () => {
    it("Success and return user", async () => {
      const res = await chai
        .request(app)
        .get(apiUser)
        .set(headers);
      expect(res.status).is.eql(200);
      expect(res.body.user).is.a("object");
      expect(res.body.user).to.have.property("email");
      expect(res.body.user).to.have.property("token");
      expect(res.body.user).to.have.property("username");
      expect(res.body.user).to.have.property("bio");
      expect(res.body.user).to.have.property("image");
      expect(res.body.user.email).is.not.null;
      expect(res.body.user.token).is.not.null;
      expect(res.body.user.token).is.not.null;
    });
  });

  describe("GET current user fail", () => {
    it("Token is absent", async () => {
      const res = await chai
        .request(app)
        .get(apiUser)
        .set({
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest"
        });
      expect(res.status).is.eql(401);
      expect(res.body.errors).is.a("object");
      expect(res.body.errors).to.have.property("message");
      expect(res.body.errors).to.have.property("status_code");
      expect(res.body.errors.message).is.include("Token is absent");
      expect(res.body.errors.status_code).is.eql(401);
    });

    it("Token is invalid", async () => {
      const res = await chai
        .request(app)
        .get(apiUser)
        .set({
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          Authorization: "Token Fake"
        });
      expect(res.status).is.eql(401);
      expect(res.body.errors).is.a("object");
      expect(res.body.errors).to.have.property("message");
      expect(res.body.errors).to.have.property("status_code");
      expect(res.body.errors.message).is.include("Token is invalid");
      expect(res.body.errors.status_code).is.eql(401);
    });
  });
});

// // Update user
describe("#PUT /api/user", () => {
  describe("Update fail", () => {
    describe("Token is incorrect", () => {
      it("Token is absent", async () => {
        const res = await chai
          .request(app)
          .put(apiUser)
          .set({
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest"
          })
          .send();
        expect(res.status).is.eql(401);
        expect(res.body.errors).is.a("object");
        expect(res.body.errors).to.have.property("message");
        expect(res.body.errors).to.have.property("status_code");
        expect(res.body.errors.message).is.include("Token is absent");
        expect(res.body.errors.status_code).is.eql(401);
      });

      it("Token is invalid", async () => {
        const res = await chai
          .request(app)
          .put(apiUser)
          .set({
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
            Authorization: "Token Fake"
          })
          .send({
            user: {
              email: faker.internet.email()
            }
          });
        expect(res.status).is.eql(401);
        expect(res.body.errors).is.a("object");
        expect(res.body.errors).to.have.property("message");
        expect(res.body.errors).to.have.property("status_code");
        expect(res.body.errors.message).is.include("Token is invalid");
        expect(res.body.errors.status_code).is.eql(401);
      });
    });

    describe("Form data is incorrect", () => {
      describe("Data has already been taken", () => {
        it("Email has already been taken", async () => {
          const res = await chai
            .request(app)
            .put(apiUser)
            .set(headers)
            .send({
              user: {
                email: "jake@jake.jake"
              }
            });
          expect(res.status).is.eql(422);
          expect(res.body.errors).is.a("object");
          expect(res.body.errors).have.property("email");
          expect(res.body.errors.email[0]).is.include("has already been taken");
        });

        it("Username has already been taken", async () => {
          const res = await chai
            .request(app)
            .put(apiUser)
            .set(headers)
            .send({
              user: {
                username: "Jacob"
              }
            });
          expect(res.status).is.eql(422);
          expect(res.body.errors).is.a("object");
          expect(res.body.errors).have.property("username");
          expect(res.body.errors.username[0]).is.include(
            "has already been taken"
          );
        });

        it("Both username and email have already been taken", async () => {
          const res = await chai
            .request(app)
            .put(apiUser)
            .set(headers)
            .send({
              user: {
                email: "jake@jake.jake",
                username: "Jacob"
              }
            });
          expect(res.status).is.eql(422);
          expect(res.body.errors).is.a("object");
          expect(res.body.errors).have.property("email");
          expect(res.body.errors).have.property("username");
          expect(res.body.errors.email[0]).is.include("has already been taken");
          expect(res.body.errors.username[0]).is.include(
            "has already been taken"
          );
        });
      });

      describe("Data is invalid", () => {
        it("Email is invalid", async () => {
          const res = await chai
            .request(app)
            .put(apiUser)
            .set(headers)
            .send({
              user: {
                email: "@jake"
              }
            });
          expect(res.status).is.eql(422);
          expect(res.body.errors).is.a("object");
          expect(res.body.errors).have.property("email");
          expect(res.body.errors.email[0]).is.include(
            "must be a valid email address"
          );
        });

        it("Username is invalid", async () => {
          const res = await chai
            .request(app)
            .put(apiUser)
            .set(headers)
            .send({
              user: {
                username: "@@@"
              }
            });
          expect(res.status).is.eql(422);
          expect(res.body.errors).is.a("object");
          expect(res.body.errors).have.property("username");
          expect(res.body.errors.username[0]).is.include(
            "may only contain letters and numbers"
          );
        });

        it("Password is invalid", async () => {
          const res = await chai
            .request(app)
            .put(apiUser)
            .set(headers)
            .send({
              user: {
                password: "123"
              }
            });
          expect(res.status).is.eql(422);
          expect(res.body.errors).is.a("object");
          expect(res.body.errors).have.property("password");
          expect(res.body.errors.password[0]).is.include(
            "must be at least 6 characters"
          );
        });
      });
    });
  });

  describe("Update sucsess", () => {
    it("Update username", async () => {
      const fakeUsername = faker.name.firstName();
      const res = await chai
        .request(app)
        .put(apiUser)
        .set(headers)
        .send({
          user: {
            username: fakeUsername
          }
        });
      expect(res.status).is.eql(200);
      expect(res.body.user).is.a("object");
      expect(res.body.user).have.property("email");
      expect(res.body.user).have.property("token");
      expect(res.body.user).have.property("username");
      expect(res.body.user).have.property("bio");
      expect(res.body.user).have.property("image");
      expect(res.body.user.username).is.eql(fakeUsername);
    });
  });
});
