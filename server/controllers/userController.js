const bcrypt = require("bcrypt");
const saltRounds = 10;
const axios = require("axios");
const qs = require("qs");
const conn = require("../database/connDB");
const userDB = require("../database/userDB");
const auth = require("../middlewares/authHandler");

const homeRender = async (req, res, next) => {
  try {
    // res.status(200).send("Hello");
    res.status(200).redirect("/login");
  } catch (error) {
    next(error);
  }
};
const userCheckAuth = async (req, res, next) => {
  if (req.session.accessToken) {
    const user = req.user;
    const accessJwtToken = req.session.accessToken;
    const accessExpired = req.session.cookie.maxAge / 1000;
    return res
      .status(200)
      .send({ accessJwtToken, accessExpired, user, message: undefined });
  }
  return res.status(401).send({ message: "Please Login to continue." });
};
const lineCallback = async (req, res, next) => {
  const { code } = req.query;
  // {
  //   code: '2NIQOipvfxePtTfyYALZ',             // deliver by LINE
  //   state: 'e83212f595634b668df31795f701bee8' //according to the req from client
  // }
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
    const profileResponse = await axios.get("https://api.line.me/v2/profile", {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    // {
    //   userId: 'U9acc24aec8497b5e7159c861f9079b71',
    //   displayName: '林潔君',
    //   pictureUrl: 'https://profile.line-scdn.net/0hOFa5F3OkEGlMTAVAkk5uFjwcEwNvPUl7Mn1aXSkZSVBzfAM-MChWXH5NHFBxKVFqZyoIXS1KTl1AX2cPUhrsXUt8TVhweFA6Yytciw'
    // }
    const profile = profileResponse.data;
    const user = await userDB.getUserByEmail(conn, profile.userId);
    // console.log("%j", user);
    if (user == undefined) {
      const user = await userDB.newLineUser(
        conn,
        profile.userId,
        profile.displayName,
        profile.userId,
        profile.pictureUrl
      );
      console.log(`${profile.displayName} register successfully`);
    }
    const { accessJwtToken, accessExpired } = auth.authJwtSign(user);
    req.user = user;
    req.session.accessToken = accessJwtToken;
    req.session.cookie.maxAge = accessExpired * 1000;
    res.cookie("accessToken", accessJwtToken);

    return res.status(200).redirect("/timeline");
  } catch (error) {
    res
      .status(500)
      .json({ error: error.response ? error.response.data : error.message });
  }
};
const loginRender = async (req, res, next) => {
  try {
    res.status(200).render("login", { message: undefined });
  } catch (error) {
    next(error);
  }
};
const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userDB.getUserByEmail(conn, email);
    if (!user) {
      return res.status(403).send({ message: "User account doesn't exit!" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const { accessJwtToken, accessExpired } = auth.authJwtSign(user);
      req.session.accessToken = accessJwtToken;
      res.cookie("accessToken", accessJwtToken);
      req.session.cookie.maxAge = accessExpired * 1000;

      return res.status(200).send({
        accessJwtToken,
        accessExpired,
        user,
        message: ""
      });
    } else {
      const message = "Wrong email or password!";
      return res.status(403).send({ message });
    }
  } catch (error) {
    next(error);
  }
};
const signupController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const messagePW = verificationOfPassword(password);
    if (messagePW != undefined) {
      req.flash("message", messagePW);
      return res.status(403).send(messagePW);
    }
    const messageEmail = verificationOfEmail(email);
    if (messageEmail != undefined) {
      req.flash("message", messageEmail);
      return res.status(400).send(messageEmail);
    }
    const user = await userDB.getUserByEmail(conn, email);
    if (user != undefined) {
      console.log("signup user duplicated:" + JSON.stringify(user));
      return res
        .status(403)
        .send({ message: "Email has already been registered." });
    } else {
      const passwordHash = await bcrypt.hash(password, saltRounds); //length:60
      const user = await userDB.newNativeUser(conn, name, email, passwordHash);
      const { accessJwtToken, accessExpired } = auth.authJwtSign(user);
      req.session.accessToken = accessJwtToken;
      req.session.cookie.maxAge = accessExpired * 1000;
      res.cookie("accessToken", accessJwtToken);
      res.status(200).send({
        accessJwtToken,
        accessExpired,
        user,
        message: ""
      });
    }
  } catch (error) {
    next(error);
  }
};
const logoutController = async (req, res, next) => {
  try {
    //clear cache
    req.session.accessToken = null;
    res.clearCookie("accessToken");
    res.status(200).redirect("/login");
  } catch (error) {
    next(error);
  }
};
//---------------------------------
//------      Functions -----------
//---------------------------------
function verificationOfPassword(password) {
  //Check Complexity Of Password
  if (password.length < 8) {
    return "password should be at least 8 characters.";
  }
  // else if (!/[A-Z]/.test(password)) {
  //   return "password should be at least one UpperCase";
  // }
  else if (!/[a-z]/.test(password)) {
    return "password should be at least one LowerCase";
  } else if (!/\d/.test(password)) {
    return "password should be at least one Number";
  } else {
    return undefined;
  }
  // } else if (!/\W/.test(password)) {
  //   return "password should be at least non-alphas"; //特殊符號
  // }
}
function verificationOfEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(email)) {
    return "email without domain address.";
  } else {
    return undefined;
  }
}

module.exports = {
  homeRender,
  userCheckAuth,
  lineCallback,
  loginRender,
  loginController,
  signupController,
  logoutController
};
