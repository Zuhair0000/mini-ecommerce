// const mysql = require("mysql2");
// const dotenv = require("dotenv");
// dotenv.config();

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// db.connect((err) => {
//   if (err) throw err;
//   console.log("MySQL Connected");
// });

// module.exports = db;

const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool
  .getConnection()
  .then(() => console.log("MySQL pool connected"))
  .catch((err) => console.error("DB connection failed: ", err.message));

module.exports = pool;
