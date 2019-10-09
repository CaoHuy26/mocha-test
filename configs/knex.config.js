const options = {
  client: "mysql",
  connection: {
    host: "167.71.202.52",
    user: "realhome",
    password: "yT&+Kz5Eb26%=Vgs",
    database: "homestead"
  }
};

const knex = require("knex")(options);

module.exports = knex;
