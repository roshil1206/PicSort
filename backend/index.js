require("dotenv").config();

require("express-async-errors");
const express = require("express");
const app = express();
const morgan = require("morgan");
const { handleError } = require("./utils/error");
const routes = require("./routes/index");
const cors = require("cors");

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded());
app.use("/", routes);

app.use(handleError);

app.listen(process.env.PORT || 4000, () =>
  console.log(`Server is running on ${process.env.PORT}`)
);
