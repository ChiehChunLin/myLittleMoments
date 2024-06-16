"use strict";

const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const ejs = require("ejs");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { errorHandler } = require("./middlewares/errorHandler");
const userRoute = require("./routes/userRouter");
const adminRoute = require("./routes/adminRouter");
const timelineRoute = require("./routes/timelineRouter");

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
app.use("/admin", adminRoute);
app.use("/timeline", timelineRoute);
app.use("/public", express.static("../client"));

// app.use(errorHandler);
app.use((err, req, res, next) => {
  console.log(err);
  res.locals.error = err;
  const status = err.status || 500;
  res.status(status).send({ message: `Oops!! ${err}` });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});

module.exports = app;
