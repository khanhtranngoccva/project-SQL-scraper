const mysql = require("mysql2");
require("dotenv").config();
const dbConnection = mysql.createConnection({
    host: "localhost",
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: "magic_snippets",
    insecureAuth: false,
}).promise();

module.exports = dbConnection;