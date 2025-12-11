const mysql = require("mysql2");

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "netwatch_db", // o nome que você escolheu
});

module.exports = connection;
