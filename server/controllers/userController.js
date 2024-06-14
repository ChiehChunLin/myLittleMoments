const conn = require("../database/connDB");
const userDB = require("../database/userDB");

const homeRender = async (req, res, next) => {
  try {
    res.status(200).send("Hello");
    // res.status(200).redirect("/login");
  } catch (error) {
    next(error);
  }
};
const loginRender = async (req, res, next) => {
  try {
    res.status(200).render("login");
  } catch (error) {
    next(error);
  }
};
const loginController = async (req, res, next) => {
  try {
    res.status(200).send({
      access_token,
      access_expired,
      user,
      message
    });
  } catch (error) {
    next(error);
  }
};
const signupController = async (req, res, next) => {
  try {
    res.status(200).send({
      access_token,
      access_expired,
      user,
      message
    });
  } catch (error) {
    next(error);
  }
};
const logoutController = async (req, res, next) => {
  try {
    res.status(200).render("/login");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  homeRender,
  loginRender,
  loginController,
  signupController,
  logoutController
};
