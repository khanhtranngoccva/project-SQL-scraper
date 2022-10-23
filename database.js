const mysql = require("mysql2");
const path = require("path");
require("dotenv").config({path: path.join(__dirname, ".env")});
const dbConnection = mysql.createConnection({
    host: "localhost",
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: "magic_snippets",
    insecureAuth: false,
}).promise();

module.exports = dbConnection;