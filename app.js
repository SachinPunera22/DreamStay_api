require("./models/db");
require("dotenv").config({ path: "./config.env" });

const express = require("express");
const app = express();

const bodyParser = require("body-parser");

const cors = require("cors");

const userRoute = require("./routes/user.routes");
const packageRoute = require("./routes/package.routes");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


app.use(cors());
app.use("/user", userRoute);
app.use("/package", packageRoute);


app.listen(process.env.PORT || 3000, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
