const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "mysql-aprenderencasa.alwaysdata.net",
  user: "368507_grupo19",
  password: "368507_grupo19_368507",
  database: "aprenderencasa_db",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
const conn = pool.promise();

conn
  .getConnection()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection error:", err));
module.exports = {
  conn: pool.promise(),
};
