require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const { createUserTable } = require("./models/auth-model");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

createUserTable()
  .then(() => console.log("User table created."))
  .catch((error) => console.log(error));


app.use("/api/auth", require("./routes/auth-route"));
app.use("/api/onboarding", require("./routes/onboarding-route"));

app.listen(5000, () => console.log(`Server is running.`));
