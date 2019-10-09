const chai = require("chai");
const chaiHttp = require("chai-http");

// const axios = require("../utils/http");

const app = "http://167.71.202.52";
const apiLogin = "/api/users/login";

const expect = chai.expect;
chai.use(chaiHttp);

describe("Login success", () => {
  it("Login success and return token", async () => {
    const headers = {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest"
      // "Authorization": "Token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjMsImlzcyI6Imh0dHA6XC9cLzE2Ny43MS4yMDIuNTJcL2FwaVwvdXNlcnNcL2xvZ2luIiwiaWF0IjoxNTcwNTE2NTAyLCJleHAiOjE1NzU3MDA1MDIsIm5iZiI6MTU3MDUxNjUwMiwianRpIjoiWUF1aURSUm8zazNTNHVKOSJ9.NQaocE1-X24L3af0M-ARXTF1LcC14Ke_tB1OhSRktP0"
    };

    // const res = await axios.post(apiLogin, user, headers);

    const res = await chai
      .request(app)
      .post(apiLogin)
      .set(headers)
      .send({
        user: {
          email: "caohuy@gmail.com",
          password: "12345678"
        }
      });

    console.log(res.body.user);

    expect(res.status).eql(200);
    expect(res.body.user).is.an("object");
    expect(res.body.user).have.property("email");
    expect(res.body.user).have.property("username");
    expect(res.body.user).have.property("bio");
    expect(res.body.user).have.property("image");
    expect(res.body.user).have.property("token");
    expect(res.body.user.email).is.not.null;
    expect(res.body.user.username).is.not.null;
    expect(res.body.user.token).is.not.null;
  });
});
