const mariadb = require("mariadb");

var pool = mariadb.createPool({
  connectionLimit: 5,
  host: "localhost",
  user: "root",
  password: "Hiod&fo@fj7kenwqvtj",
  database: "email_ticketing",
});

module.exports = pool;
