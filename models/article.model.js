const bookshelf = require("../configs/bookshelf.config");

const User = require("./user.model");

const Article = bookshelf.Model.extend({
  tableName: "articles",
  requireFetch: false,

  user() {
    return this.belongsTo(User);
  }
});

// Article.fetchAll().then(article => {
//     console.log(article.toJSON());
// });

// Article.where({id: 7}).fetch({
//   withRelated: 'user'
// }).then(article => {
//   console.log(article.toJSON())
// })

module.exports = Article;
