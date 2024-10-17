var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
const Sentry = require("@sentry/node");
var dotenv = require("dotenv");
const bootstrapLoco = require("./app/loco/bootstrap");
const cors = require("cors");

const corsOptions = {
  origin: "*", // Specify allowed origins
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow credentials
  optionsSuccessStatus: 204,
};

dotenv.config({ path: ".env" });

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENV,
});

Sentry.setTag("app-name", process.env.APP_NAME);

var indexRouter = require("./routes/index");
var auth = require("./app/middlewares/auth");

indexRouter = bootstrapLoco(app, indexRouter);

var app = express();

app.use(cors(corsOptions));
app.use(auth);

// view engine setup

app.use(logger("dev"));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).send({ error: "Not found" });
});

// error handler
app.use(async function (err, req, res, next) {
  console.log("I am gonna catch");
  Sentry.captureException(err);
  await Sentry.flush();
  if (process.env.DEBUG === "true") {
    console.log("Global error handler", err.message, err.status);
    return res.status(err.status || 500).send({ message: err.message });
    // return res
    //   .status(err.status || JSON.parse(err.message).code)
    //   .send(JSON.parse(err.message));
  } else {
    return res.status(500).send({ message: "Something went wrong" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

module.exports = app;
