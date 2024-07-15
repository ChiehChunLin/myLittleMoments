"use strict";

const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const ejs = require("ejs");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/userRouter");
const adminRoute = require("./routes/adminRouter");
const timelineRoute = require("./routes/timelineRouter");
const auth = require("./middlewares/authHandler");
const { errorHandler } = require("./middlewares/errorHandler");

app.set("views", path.join(path.dirname(__dirname), "/client/views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // false to store anything before user logs in.
    cookie: {
      httpOnly: true,
      sameSite: "none"
      // secure: true, //secure makes flash doesn't work
      // maxAge: 24 * 60 * 60 * 1000,
    }
  })
);

app.use("/", userRoute);
app.use("/timeline", auth.authJwtCheckLogin, timelineRoute);
app.use("/admin", auth.authJwtCheckLogin, auth.authAdminCheck, adminRoute);
app.use("/admin", auth.authJwtCheckLogin, auth.authAdminCheck, express.static("./admin"));
app.use("/public", express.static("../client"));

app.use((req, res, next) => {
  const err = new Error(`Not Found!`);
  err.status = 404;
  next(err);
});

// app.use(errorHandler);
app.use((err, req, res, next) => {
  if (err.status = 404) {
    return res.status(200).render("errorPage", { user : undefined});
  }
  console.log(err);
  res.locals.error = err;
  const status = err.status || 500;
  res.status(status).send({ message: `Oops!! ${err}` });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});

// function handle(code) {
//   console.log(`${code} signal received: closing HTTP server`);
//   server.close(() => {
//     console.debug("HTTP server closed");
//   });
// }

// process.on("SIGTERM", handle);
// process.on("SIGINT", handle);

module.exports = app;
