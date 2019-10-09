const chai = require("chai");
const faker = require("faker");

const axios = require("../utils/http");

const apiArticle = "api/articles";

const expect = chai.expect;

// Create article
describe("#POST /articles", () => {
  describe("POST create article fail", () => {
    // describe("Token is incorrect", () => {
    //     const article = {
    //         article: {
    //             title: faker.name.title(),
    //             description: faker.lorem.word(),
    //             body: faker.lorem.paragraph()
    //         }
    //     };
    //     it('Token is absent', async () => {
    //         const headers = { };
    //         const res = await axios.post(apiArticle, article, headers);
    //         const { data } = res;
    //         expect(res.status).is.eql(401);
    //         expect(data.errors).is.a('object');
    //         expect(data.errors).have.property('message');
    //         expect(data.errors).have.property('status_code');
    //         expect(data.errors.message).is.include('Token is absent');
    //         expect(data.errors.status_code).is.eql(401);
    //     });

    //     it('Token is invalid', async () => {
    //         const headers = {
    //             Authorization: "Token 56565656"
    //         };
    //         const res = await axios.post(apiArticle, article, headers);
    //         const { data } = res;
    //         expect(res.status).is.eql(401);
    //         expect(data.errors).is.a('object');
    //         expect(data.errors).have.property('message');
    //         expect(data.errors).have.property('status_code');
    //         expect(data.errors.message).is.include('Token is absent');
    //         expect(data.errors.status_code).is.eql(401);
    //     });
    // });

    describe("Data is incorrect", () => {
      it("Missing title", async () => {
        const article = {
          article: {
            description: faker.lorem.word(),
            body: faker.lorem.paragraph()
          }
        };
        const res = await axios.post(apiArticle, article);
        const { data } = res;
        expect(res.status).is.eql(422);
        expect(data.errors).is.a("object");
        expect(data.errors).have.property("title");
        expect(data.errors.title[0]).is.include("field is required");
      });

      it("Missing description", async () => {
        const article = {
          article: {
            title: faker.name.title(),
            body: faker.lorem.paragraph()
          }
        };
        const res = await axios.post(apiArticle, article);
        const { data } = res;
        expect(res.status).is.eql(422);
        expect(data.errors).is.a("object");
        expect(data.errors).have.property("description");
        expect(data.errors.description[0]).is.include("field is required");
      });

      it("Missing body", async () => {
        const article = {
          article: {
            title: faker.name.title(),
            description: faker.lorem.word()
          }
        };
        const res = await axios.post(apiArticle, article);
        const { data } = res;
        expect(res.status).is.eql(422);
        expect(data.errors).is.a("object");
        expect(data.errors).have.property("body");
        expect(data.errors.body[0]).is.include("field is required");
      });

      it("Missing all", async () => {
        const article = {};
        const res = await axios.post(apiArticle, article);
        const { data } = res;
        expect(res.status).is.eql(422);
        expect(data.errors).is.a("object");
        expect(data.errors).have.property("title");
        expect(data.errors).have.property("description");
        expect(data.errors).have.property("body");
      });
    });
  });

  describe("POST create article succsess", () => {
    it("POST success", async () => {
      const article = {
        article: {
          title: faker.name.title(),
          description: faker.lorem.word(),
          body: faker.lorem.paragraph()
        }
      };

      const res = await axios.post(apiArticle, article);
      const { data } = res;
      expect(res.status).is.eql(200);
      expect(data.article).is.a("object");
      expect(data.article).have.property("slug");
      expect(data.article).have.property("title");
      expect(data.article).have.property("description");
      expect(data.article).have.property("body");
      expect(data.article).have.property("author");
      expect(data.article).have.property("tagList");
      expect(data.article.tagList).is.a("array");
      expect(data.article.author).is.a("object");
      expect(data.article.author).have.property("username");
      expect(data.article.author.username).is.not.null;
    });
  });
});
