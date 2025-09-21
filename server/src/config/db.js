const serverlessMysql = require("serverless-mysql");

const db = serverlessMysql({
  config: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  },
});

module.exports = db;
