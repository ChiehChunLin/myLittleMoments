const axios = require("axios");
const qs = require("qs");
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
const lineCallback = async (req, res, next) => {
  const { code } = req.query;
  console.log(req.query);
  try {
    // Request an access token
    const tokenResponse = await axios.post(
      "https://api.line.me/oauth2/v2.1/token",
      qs.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.LINE_CALLBACK_URI,
        client_id: process.env.LINE_CHANNEL_ID,
        client_secret: process.env.LINE_CHANNEL_SECRET
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    const { access_token } = tokenResponse.data;
    console.log(access_token);
    // Use the access token to get user profile information
    const profileResponse = await axios.get("https://api.line.me/v2/profile", {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    const profile = profileResponse.data;
    res.json(profile);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.response ? error.response.data : error.message });
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
  lineCallback,
  loginRender,
  loginController,
  signupController,
  logoutController
};
