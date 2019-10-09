const bookshelf = require("../configs/bookshelf.config");

const Article = require("./article.model");

const User = bookshelf.Model.extend({
  tableName: "users",
  requireFetch: false,

  articles() {
    return this.hasMany(Article);
  }
});

// User.where({ id: 3 })
//   .fetch({
//     withRelated: 'articles'
//   })
//   .then(user => {
//     console.log(user.toJSON());
//   })
//   .catch(e => console.log(e))
//   .finally(() => knex.destroy());

module.exports = User;
