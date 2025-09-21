require("dotenv").config();
const express = require("express");
const app = express();
const { createUserTable } = require("./models/auth-model");

app.use(express.json());

createUserTable()
  .then(() => console.log("User table created."))
  .catch((error) => console.log(error));

app.use("/api/auth", require("./routes/auth-route"));

app.listen(5000, () => console.log(`Server is running.`));
